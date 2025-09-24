import React, { useState } from 'react';
import Modal from './common/Modal';
import Button from './common/Button';

interface HealthQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: { eligible: boolean; reason: string | null }) => void;
}

type Answer = 'yes' | 'no' | null;

interface Answers {
  age: Answer;
  weight: Answer;
  illness: Answer;
  medication: Answer;
  tattoo: Answer;
}

const HealthQuestionnaireModal: React.FC<HealthQuestionnaireModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [answers, setAnswers] = useState<Answers>({
    age: null,
    weight: null,
    illness: null,
    medication: null,
    tattoo: null,
  });

  const handleAnswerChange = (question: keyof Answers, value: Answer) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Eligibility Checks
    if (answers.age === 'no') {
      onComplete({ eligible: false, reason: 'Donor must be between 18 and 65 years old.' });
      return;
    }
    if (answers.weight === 'no') {
      onComplete({ eligible: false, reason: 'Donor must weigh over 50kg (110 lbs).' });
      return;
    }
    if (answers.illness === 'yes') {
      onComplete({ eligible: false, reason: 'Recent illness with fever requires a temporary deferral.' });
      return;
    }
    if (answers.medication === 'yes') {
      onComplete({ eligible: false, reason: 'Taking certain medications like antibiotics requires a temporary deferral.' });
      return;
    }
    if (answers.tattoo === 'yes') {
      onComplete({ eligible: false, reason: 'A new tattoo, piercing, or permanent makeup in the last 3 months requires a deferral.' });
      return;
    }

    // If all checks pass
    onComplete({ eligible: true, reason: null });
    
    // Reset form for next time
    setAnswers({ age: null, weight: null, illness: null, medication: null, tattoo: null });
  };

  const isFormComplete = Object.values(answers).every(answer => answer !== null);

  const Question: React.FC<{ questionKey: keyof Answers, text: string }> = ({ questionKey, text }) => (
    <div>
        <p className="font-medium text-gray-700">{text}</p>
        <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-primary" name={questionKey} value="yes" checked={answers[questionKey] === 'yes'} onChange={() => handleAnswerChange(questionKey, 'yes')} />
                <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-primary" name={questionKey} value="no" checked={answers[questionKey] === 'no'} onChange={() => handleAnswerChange(questionKey, 'no')} />
                <span className="ml-2">No</span>
            </label>
        </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Health & Eligibility Questionnaire">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-600">Please answer the following questions honestly to determine your eligibility to donate blood today.</p>
        
        <Question questionKey="age" text="1. Are you between 18 and 65 years old?" />
        <Question questionKey="weight" text="2. Do you weigh more than 50kg (110 lbs)?" />
        <Question questionKey="illness" text="3. In the last 48 hours, have you had a fever or felt unwell?" />
        <Question questionKey="medication" text="4. Are you currently taking antibiotics for an infection?" />
        <Question questionKey="tattoo" text="5. In the last 3 months, have you gotten a tattoo, piercing, or permanent make-up?" />

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormComplete}>
            Check My Eligibility
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HealthQuestionnaireModal;
