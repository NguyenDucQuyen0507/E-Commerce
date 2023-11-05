import clsx from "clsx";
import React, { memo } from "react";

const SelectForm = ({
  label,
  options = [],
  register,
  validate,
  errors,
  id,
  fullWidth,
  defaultValue,
  style,
}) => {
  return (
    <div className={clsx("flex flex-col ", style)}>
      {label && (
        <label className="font-medium" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        defaultValue={defaultValue}
        className={clsx("form-select text-sm ", fullWidth && "w-full")}
        id={id}
        {...register(id, validate)}
      >
        <option value="">--CHOOSE--</option>
        {options?.map((el) => (
          <option className="" value={el.code}>
            {el.value}
          </option>
        ))}
      </select>
      {errors[id] && (
        <small className="text-sm text-main">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(SelectForm);
