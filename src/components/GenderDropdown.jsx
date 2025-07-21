import { useState } from 'react';

const GenderDropdown = ({ gender, setGender }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = ["male", "female", "others"];

  return (
    <div className="relative w-1/2  ">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border-2 border-black bg-white rounded-sm font-mono font-bold text-sm text-black hover:bg-black hover:text-white transition-all duration-300"
      >
        {gender || "Select Gender"}
        <svg
          className={`w-3 h-3 ml-2 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M6 8L2 4h8L6 8z" />
        </svg>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border-2 border-black z-50">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setGender(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer transition-colors duration-200 font-mono text-sm font-bold border-b last:border-b-0"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default GenderDropdown;