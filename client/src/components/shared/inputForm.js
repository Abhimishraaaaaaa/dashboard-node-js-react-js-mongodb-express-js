import React from "react";

const InputForm = ({ htmlFor, labeltext, type, name, value, handleChange }) => {
  return (
    <>
      <div className="mb-3">
        <label htmlFor={htmlFor} className="form-label">
          {labeltext}
        </label>
        <input
          type={type}
          className="form-control"
          name={name}
          value={value}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default InputForm;
