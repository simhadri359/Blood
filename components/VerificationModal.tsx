import React from 'react';
import Modal from './common/Modal';
import Button from './common/Button';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import Alert from './common/Alert';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  status: 'idle' | 'success' | 'error';
  error?: string | null;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onVerify, status, error }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Your Profile">
      {status === 'success' ? (
        <div className="text-center p-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                 <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Verification Successful!</h3>
            <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                    Your profile is now verified. Thank you for helping build a trusted community.
                </p>
            </div>
            <div className="items-center px-4 py-3">
                <Button onClick={onClose} className="w-full">
                    Close
                </Button>
            </div>
        </div>
      ) : (
      <div className="space-y-4">
        {error && <Alert type="error" title="Verification Failed" message={error} />}
        <p className="text-sm text-gray-600">
          To ensure the safety and trust of our community, we require verification. Please upload a document to confirm your blood type (e.g., a donor card or a medical report).
        </p>
        <p className="text-xs text-gray-500">
            For demonstration purposes, clicking "Submit" will automatically verify your account.
        </p>
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
            Verification Document
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onVerify}>
            Submit for Verification
          </Button>
        </div>
      </div>
      )}
    </Modal>
  );
};

export default VerificationModal;