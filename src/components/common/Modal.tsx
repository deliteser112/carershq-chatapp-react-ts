import React from 'react';

interface ModalProps {
  title: string;
  content: string;
  onConfirm: (message: string) => void;
  onCancel: () => void;
  showInput?: boolean;
  inputValue?: string;
  setInputValue?: (value: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  onConfirm,
  onCancel,
  showInput = false,
  inputValue = '',
  setInputValue
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{content}</p>
        {showInput && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue && setInputValue(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
            placeholder="Enter your input here..."
          />
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(inputValue)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
