import React from "react";

const MatchedSymptoms = ({ symptoms, onSymptomClick }) => {
  if (!symptoms || symptoms.length === 0) return null;

  return (
    <div className="mt-4">
      <h2 className="text-lg font-medium text-violet-600 mb-2">
        Matched Symptoms
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {symptoms.map((symptom, index) => (
          <button
            key={index}
            onClick={() => onSymptomClick(symptom)}
            className="px-4 py-2 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {symptom}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MatchedSymptoms;
