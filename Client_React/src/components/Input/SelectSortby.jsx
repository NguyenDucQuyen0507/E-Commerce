import React, { memo } from "react";
const SelectSortby = ({ value, options, changValue }) => {
  return (
    <select
      className="form-select text-sm"
      value={value}
      onChange={(e) => changValue(e.target.value)}
    >
      <option value="">Choose options</option>
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
};

export default memo(SelectSortby);
