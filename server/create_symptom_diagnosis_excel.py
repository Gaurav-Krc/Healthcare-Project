import pandas as pd

# Define the columns and some example data
data = {
    'IRRITATION BOTH EYE': [1, 0, 0, 0],
    'RT EYE IRRITATION': [0, 1, 0, 0],
    'LT EYE IRRITATION': [0, 0, 1, 0],
    'TOOTH PAIN': [1, 0, 0, 1],
    'diagnosis': ['Flu', 'Cold', 'Allergy', 'COVID-19']
}

# Create DataFrame
df = pd.DataFrame(data)

# Save to Excel
df.to_excel('symptom_diagnosis_data.xlsx', index=False)