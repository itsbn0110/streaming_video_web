import React, { useState } from "react";

const TagInput = ({
  label,
  options = [],
  selectedTags = [],
  onTagsChange,
  placeholder = "Add new item...",
  allowCustom = true,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (!value) return;

    const selectedOption = options.find(
      (option) => option.id === parseInt(value, 10)
    );
    console.log("selectedOption", selectedOption);
    if (
      selectedOption &&
      !selectedTags.some((tag) => tag.id === selectedOption.id)
    ) {
      onTagsChange([...selectedTags, selectedOption]);
    }
    e.target.value = ""; // Reset select after selection
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() && allowCustom) {
      e.preventDefault();
      // Check if this custom tag already exists
      if (
        !selectedTags.some(
          (tag) =>
            (tag.name || tag).toLowerCase() === inputValue.trim().toLowerCase()
        )
      ) {
        const newTag = { name: inputValue.trim(), isCustom: true };
        onTagsChange([...selectedTags, newTag]);
        setInputValue("");
      }
    }
  };

  const removeTag = (indexToRemove) => {
    onTagsChange(selectedTags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && <label className="font-medium text-gray-700">{label}</label>}
      <div className="border border-gray-300 rounded p-1 bg-white flex flex-col">
        <select
          className="w-full p-2 border-b border-gray-200 outline-none"
          onChange={handleSelectChange}
          value=""
        >
          <option value="">-- Select an option --</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2 p-2">
          {selectedTags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
            >
              <span>{tag.name || tag}</span>
              <button
                type="button"
                className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                onClick={() => removeTag(index)}
              >
                ×
              </button>
            </div>
          ))}

          {allowCustom && (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-grow outline-none min-w-[120px] p-1"
            />
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500">
        {allowCustom ? "Type and press Enter to add custom items" : ""}
      </p>
    </div>
  );
};

export default TagInput;
