from flask import Flask, request, jsonify
from flask_cors import CORS
from mysql.connector import pooling
import spacy
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import joblib
from auth import auth_blueprint
app = Flask(__name__)
CORS(app)

# Register the auth blueprint
app.register_blueprint(auth_blueprint)

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "ohctech"
}

connection_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

df = pd.read_excel('symptom_diagnosis_data.xlsx')

# Global variables
symptom_storage = []
current_emp_id = None

def load_model(disease_name):
    model_path = os.path.join('models', f"{disease_name}_model")
    if os.path.exists(model_path):
        return joblib.load(model_path)
    else:
        raise FileNotFoundError(f"Model for {disease_name} not found in 'models' directory.")

def predict_disease_probability(disease_name, patient_data):
    features = []
    model = load_model(disease_name)
    if disease_name == 'diabetes':
        features = [
            patient_data['age'], patient_data['bmi'], patient_data['blood_pressure'],
            patient_data['glucose'], patient_data['insulin'], patient_data['skin_thickness'],
            patient_data['diabetes_pedigree_function'], patient_data['pregnancies']
        ]
    elif disease_name == 'hypertension':
        features = [
            patient_data['age'], patient_data['bmi'], patient_data['blood_pressure'],
            patient_data['glucose'], patient_data['insulin'], patient_data['skin_thickness'],
            patient_data['diabetes_pedigree_function'], patient_data['pregnancies'],
            patient_data['cholesterol'], patient_data['heart_rate']
        ]
    elif disease_name == 'heart_disease':
        features = [
            patient_data['age'], patient_data['bmi'], patient_data['blood_pressure'],
            patient_data['glucose'], patient_data['insulin'], patient_data['skin_thickness'],
            patient_data['diabetes_pedigree_function'], patient_data['pregnancies'],
            patient_data['cholesterol'], patient_data['heart_rate']
        ]
    probability = model.predict_proba([features])[0][1]
    return probability

def interpret_probability(probability):
    if probability > 0.8:
        return "severe"
    elif probability > 0.5:
        return "moderate"
    else:
        return "mild or no"

def handle_disease_prediction(disease_name, user_input):
    emp_id = extract_emp_id(user_input)
    if not emp_id:
        return "You have not provided the patient's ID. Please try again!"

    patient_details = get_patient_details(emp_id)
    if not patient_details:
        return f"No details found for ID {emp_id}. Please try again with a valid ID."

    probability = predict_disease_probability(disease_name, patient_details)
    condition = interpret_probability(probability)
    return f"The patient has a {condition} risk of {disease_name.replace('_', ' ')} (probability: {probability:.2f})."


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


def identify_disease(matched_symptoms):
    for symptom in matched_symptoms:
        if symptom in df.columns: continue
        else: return []

    possible_diseases = df[(df[matched_symptoms] == 1).all(axis=1)]
    df1 = df.drop(columns=matched_symptoms)
    df1 = df1.drop(columns=['diagnosis'])
    diagnosis = possible_diseases[(possible_diseases[df1.columns] == 0).all(axis=1)]

    return diagnosis['diagnosis'].tolist()


# def count_diabetes_patients():
#     connection = connection_pool.get_connection()
#     cursor = connection.cursor()
#     try:
#         cursor.execute("SELECT COUNT(*) FROM diabetes_data WHERE diabetes = 1")
#         return cursor.fetchone()[0]
#     finally:
#         cursor.close()
#         connection.close()


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
    global current_emp_id
    words = user_input.split()
    for word in words:
        if word.isdigit():
            current_emp_id = word
            return current_emp_id
    return current_emp_id


@app.route('/chat', methods=['POST'])
def chat():
    global symptom_storage
    global current_emp_id

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

    emp_id = extract_emp_id(user_input)

    # Disease Prediction Flow
    if "check" in user_input:
        if "diabetes" in user_input:
            return jsonify({'output': handle_disease_prediction('diabetes', user_input)})

        if "hypertension" in user_input:
            return jsonify({'output': handle_disease_prediction('hypertension', user_input)})

        if "heart disease" in user_input:
            return jsonify({'output': handle_disease_prediction('heart_disease', user_input)})


    if "details" in user_input or (emp_id is not None and emp_id in user_input):
        if emp_id:
            patient_details = get_patient_details(emp_id)
            if patient_details:           
                # Format details and diseases
                details = ", ".join([f"{key}: {value}" for key, value in patient_details.items() 
                                     if key not in ['diabetes', 'hypertension', 'heart_disease']])
                return jsonify({
                    'output': f"Details for patient ID {emp_id} --> {details}. "
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

    if user_selected_symptom:
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

 