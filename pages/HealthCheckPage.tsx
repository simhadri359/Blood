import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

type Answer = 'yes' | 'no' | null;

interface Answers {
  age: Answer;
  weight: Answer;
  illness: Answer;
  medication: Answer;
  tattoo: Answer;
}

const HealthCheckPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answers>({
    age: null,
    weight: null,
    illness: null,
    medication: null,
    tattoo: null,
  });
  const [result, setResult] = useState<{ eligible: boolean; reason: string | null } | null>(null);

  const handleAnswerChange = (question: keyof Answers, value: Answer) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let eligibilityResult = { eligible: true, reason: null as string | null };

    if (answers.age === 'no') {
      eligibilityResult = { eligible: false, reason: 'Donor must be between 18 and 65 years old.' };
    } else if (answers.weight === 'no') {
      eligibilityResult = { eligible: false, reason: 'Donor must weigh over 50kg (110 lbs).' };
    } else if (answers.illness === 'yes') {
      eligibilityResult = { eligible: false, reason: 'Recent illness with fever requires a temporary deferral.' };
    } else if (answers.medication === 'yes') {
      eligibilityResult = { eligible: false, reason: 'Taking certain medications like antibiotics requires a temporary deferral.' };
    } else if (answers.tattoo === 'yes') {
      eligibilityResult = { eligible: false, reason: 'A new tattoo, piercing, or permanent makeup in the last 3 months requires a deferral.' };
    }

    setResult(eligibilityResult);
    
    if (eligibilityResult.eligible) {
      updateUser({ isAvailable: true, deferralReason: null });
    } else {
      updateUser({ isAvailable: false, deferralReason: eligibilityResult.reason });
    }
  };
  
  const isFormComplete = Object.values(answers).every(answer => answer !== null);

  const Question: React.FC<{ questionKey: keyof Answers, text: string }> = ({ questionKey, text }) => (
    <div className="py-4 border-b border-gray-200">
        <p className="font-medium text-gray-800">{text}</p>
        <div className="mt-2 space-x-6">
            <label className="inline-flex items-center cursor-pointer">
                <input type="radio" className="form-radio h-5 w-5 text-primary focus:ring-primary" name={questionKey} value="yes" checked={answers[questionKey] === 'yes'} onChange={() => handleAnswerChange(questionKey, 'yes')} />
                <span className="ml-3 text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
                <input type="radio" className="form-radio h-5 w-5 text-primary focus:ring-primary" name={questionKey} value="no" checked={answers[questionKey] === 'no'} onChange={() => handleAnswerChange(questionKey, 'no')} />
                <span className="ml-3 text-gray-700">No</span>
            </label>
        </div>
    </div>
  );
  
  if (result) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Eligibility Result</h1>
        {result.eligible ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
            <h2 className="font-bold text-lg">Congratulations! You are eligible to donate.</h2>
            <p className="mt-2">Your status has been updated. Thank you for your willingness to save a life!</p>
          </div>
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
            <h2 className="font-bold text-lg">You are temporarily deferred from donating.</h2>
            <p className="mt-2"><strong>Reason:</strong> {result.reason}</p>
            <p className="mt-2">Your status has been updated. Please check back later or consult a donation center for more information.</p>
          </div>
        )}
        <Button onClick={() => navigate('/profile')} className="mt-6">
            Back to Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Questionnaire</h1>
      <p className="text-gray-600 mb-6">Answer a few questions to check your donation eligibility.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Question questionKey="age" text="1. Are you between 18 and 65 years old?" />
        <Question questionKey="weight" text="2. Do you weigh more than 50kg (110 lbs)?" />
        <Question questionKey="illness" text="3. In the last 48 hours, have you had a fever or felt unwell?" />
        <Question questionKey="medication" text="4. Are you currently taking antibiotics for an infection?" />
        <Question questionKey="tattoo" text="5. In the last 3 months, have you gotten a tattoo, piercing, or permanent make-up?" />

        <div className="flex justify-end pt-6">
          <Button type="submit" size="lg" disabled={!isFormComplete}>
            Check My Eligibility
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HealthCheckPage;