import mysql.connector as connection
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Connect to MySQL Database
db = connection.connect(
    host="localhost",
    user="root",  # Replace with your MySQL username
    password="",  # Replace with your MySQL password
    database="ohctech"  # Replace with your database name
)

# Fetch data from MySQL
query = """
SELECT age,
bmi,
blood_pressure,
glucose,
insulin,
skin_thickness,
diabetes_pedigree_function,
pregnancies,
diabetes,
cholesterol,
heart_rate,
hypertension,
exercise,
heart_disease 
FROM diabetes_data
"""
data = pd.read_sql(query, db)

# Close the database connection
db.close()

# FOR DIABETES MODEL

# Preprocess the data
X = data.drop(["diabetes", "cholesterol", "heart_rate", "hypertension", "exercise", "heart_disease"] , axis=1)  
y = data["diabetes"]             

# Split data into training and testing sets 
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Random Forest model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)
joblib.dump(model,'./models/diabetes_model')


# FOR HYPERTENSION

# Preprocess the data
X1 = data.drop(["diabetes", "hypertension", "exercise", "heart_disease"] , axis=1)  
y1 = data["hypertension"]             

# Split data into training and testing sets 
X1_train, X1_test, y1_train, y1test = train_test_split(X1, y1, test_size=0.2, random_state=42)

# Train the Random Forest model
model1 = RandomForestClassifier(random_state=42)
model1.fit(X1_train, y1_train)
joblib.dump(model1,'./models/hypertension_model')


# FOR HEART_DISEASE

# Preprocess the data
X2 = data.drop(["diabetes", "hypertension", "exercise", "heart_disease"], axis=1) 
y2 = data["heart_disease"]            

# Split data into training and testing sets 
X2_train, X2_test, y2_train, y2_test = train_test_split(X2, y2, test_size=0.2, random_state=42)

# Train the Random Forest model
model2 = RandomForestClassifier(random_state=42)
model2.fit(X2_train, y2_train)
joblib.dump(model2,'./models/heart_disease_model')