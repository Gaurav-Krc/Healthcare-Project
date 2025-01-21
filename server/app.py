from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
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

def identify_disease(matched_symptoms):
    for symptom in matched_symptoms:
        if symptom in df.columns:
            continue
        else: return []

    possible_diseases = df[(df[matched_symptoms] == 1).all(axis=1)]
    df1 = df.drop(columns=matched_symptoms)
    df1 = df1.drop(columns=['diagnosis'])
    diagnosis = possible_diseases[(possible_diseases[df1.columns] == 0).all(axis=1)]

    return diagnosis['diagnosis'].tolist()

@app.route('/chat', methods=['POST'])
def chat():
    global symptom_storage

    data = request.json
    user_input = data.get('input', '').strip().lower()
    user_selected_symptom = data.get('selected', '')

    if not user_input and not user_selected_symptom:
        return jsonify({'output': "I didn't get any input. Please try again."})

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
