from flask import Flask, request, jsonify
from flask_cors import CORS
from mysql.connector import pooling
import spacy
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)
CORS(app)

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "ohctech"
}

connection_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

df = pd.read_excel('symptom_diagnosis_data.xlsx')

# Global list to store symptoms
symptom_storage = []

def get_symptom_list():
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT complaint FROM complaints")
        symptoms = [row[0] for row in cursor.fetchall()]
        return symptoms
    finally:
        cursor.close()
        connection.close()

def match_symptoms(user_input, symptom_list):
    vectorizer = CountVectorizer().fit_transform([user_input] + symptom_list)
    vectors = vectorizer.toarray()
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:]).flatten()
    matched_symptoms = [symptom_list[i] for i in range(len(symptom_list)) if cosine_sim[i] > 0.4]
    return matched_symptoms


# nlp = spacy.load("en_core_web_md")

# def match_symptoms(user_input, symptom_list):
#     # Preprocess and vectorize the user input
#     user_vector = nlp(user_input).vector

#     # Preprocess and vectorize each symptom in the list
#     symptom_vectors = [nlp(symptom).vector for symptom in symptom_list]

#     # Compute cosine similarity between user input and each symptom vector
#     similarities = cosine_similarity([user_vector], symptom_vectors).flatten()

#     # Filter symptoms with similarity > threshold (e.g., 0.5)
#     matched_symptoms = [
#         symptom_list[i] for i in range(len(symptom_list)) if similarities[i] > 0.5
#     ]
#     return matched_symptoms

def identify_disease(matched_symptoms):
    for symptom in matched_symptoms:
        if symptom in df.columns: continue
        else: return []

    possible_diseases = df[(df[matched_symptoms] == 1).all(axis=1)]
    df1 = df.drop(columns=matched_symptoms)
    df1 = df1.drop(columns=['diagnosis'])
    diagnosis = possible_diseases[(possible_diseases[df1.columns] == 0).all(axis=1)]

    return diagnosis['diagnosis'].tolist()


def count_diabetes_patients():
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT COUNT(*) FROM diabetes_data WHERE diabetes = 1")
        return cursor.fetchone()[0]
    finally:
        cursor.close()
        connection.close()


def count_patients(condition=None):
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    try:
        if condition:
            query = f"SELECT COUNT(*) FROM diabetes_data WHERE {condition} = 1"
        else:
            query = "SELECT COUNT(*) FROM diabetes_data"
        cursor.execute(query)
        return cursor.fetchone()[0]
    finally:
        cursor.close()
        connection.close()

def get_patient_details(emp_id):
    connection = connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        query = """
            SELECT age, bmi, blood_pressure, glucose, insulin, skin_thickness, 
                   diabetes_pedigree_function, pregnancies, cholesterol, 
                   heart_rate, exercise, diabetes, hypertension, heart_disease
            FROM diabetes_data 
            WHERE emp_id = %s
        """
        cursor.execute(query, (emp_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        connection.close()


def extract_emp_id(user_input):
    words = user_input.split()
    for word in words:
        if word.isdigit():
            return word
    return None


@app.route('/chat', methods=['POST'])
def chat():
    global symptom_storage

    data = request.json
    user_input = data.get('input', '').strip().lower()
    user_selected_symptom = data.get('selected', '')

    if not user_input and not user_selected_symptom:
        return jsonify({'output': "I didn't get any input. Please try again."})

    if 'count' in user_input:
        if 'diabetes' in user_input:
            count = count_patients(condition="diabetes")
            return jsonify({'output': f"No. of Diabetes patients = {count}"})
        elif 'hypertension' in user_input:
            count = count_patients(condition="hypertension")
            return jsonify({'output': f"No. of Hypertension patients = {count}"})
        elif 'heart disease' in user_input:
            count = count_patients(condition="heart_disease")
            return jsonify({'output': f"No. of Heart disease patients = {count}"})
        elif any(word in user_input for word in ['total', 'all', 'patients']):
            count = count_patients()
            return jsonify({'output': f"Total no. of patients = {count}"})
        else:
            return jsonify({'output': "I couldn't understand your count query. Please specify the condition."})

    # Check for "patient details" query
    emp_id = extract_emp_id(user_input)
    if any(word in user_input for word in ["details", emp_id]):
        if emp_id:
            patient_details = get_patient_details(emp_id)
            if patient_details:
                diseases = []
                if patient_details['diabetes']:     diseases.append("diabetes")
                if patient_details['hypertension']:     diseases.append("hypertension")
                if patient_details['heart_disease']:    diseases.append("heart disease")
                
                # Format details and diseases
                details = ", ".join([f"{key}: {value}" for key, value in patient_details.items() 
                                     if key not in ['diabetes', 'hypertension', 'heart_disease']])
                disease_info = " and ".join(diseases) if diseases else "no specific diseases"

                return jsonify({
                    'output': f"Details for patient ID {emp_id} --> {details}. "
                              f"This patient has {disease_info}."
                })
            else:
                return jsonify({'output': f"No details found for patient ID {emp_id}. Please try again with a valid ID."})
        else:
            return jsonify({'output': "Please provide the patient's ID."})


    if user_input == 'no':
        if not symptom_storage:
            return jsonify({'output': "You haven't entered any symptoms yet. Please provide at least one symptom."})
        
        diseases = identify_disease(symptom_storage)
        symptom_storage = []  # Clear stored symptoms after processing
        if diseases:
            return jsonify({'output': f"Based on the symptoms, possible diseases are: {', '.join(diseases)}."})
        else:
            return jsonify({'output': "I couldn't match your symptoms to any diseases. Please consult a doctor."})

    elif user_selected_symptom:
        symptom_storage.append(user_selected_symptom)
        return jsonify({
            'output': f"You selected '{user_selected_symptom}'. Do you want to add more symptoms?"
        })

    else:
        # Match symptoms from user input
        symptom_list = get_symptom_list()
        matched_symptoms = match_symptoms(user_input, symptom_list)

        if matched_symptoms:
            return jsonify({
                'output': f"Please select one from the following",
                'matched_symptoms': matched_symptoms  # Send matched symptoms to frontend
            })
        else:
            return jsonify({'output': "I couldn't match your input to any known symptoms. Please try again."})



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
