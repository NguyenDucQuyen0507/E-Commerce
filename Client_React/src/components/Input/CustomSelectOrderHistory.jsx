import { clsx } from "clsx";
import React, { memo } from "react";
import Select from "react-select";
const CustomSelectOrderHistory = ({
  label,
  placeholder,
  onChange,
  options = [],
  value,
  className,
  fw,
}) => {
  return (
    <div className={clsx(fw)}>
      {label && <h3 className="">{label}</h3>}
      <Select
        placeholder={placeholder}
        isClearable
        options={options}
        value={value}
        isSearchable
        onChange={(val) => onChange(val)}
        formatOptionLabel={(option) => <div>{option.label}</div>}
      />
    </div>
  );
};

export default memo(CustomSelectOrderHistory);
