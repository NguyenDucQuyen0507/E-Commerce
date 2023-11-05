import React, { memo } from "react";
import clsx from "clsx";
const InputForm = ({
  label,
  disabled,
  register,
  errors,
  id,
  validate,
  type = "text",
  placeholder,
  fullWidth,
  defaultValue,
  style,
  readOnly,
}) => {
  return (
    <div className={clsx("flex flex-col", style)}>
      {label && (
        <label className="font-medium" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        {...register(id, validate)}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={clsx("form-input my-auto rounded-sm", fullWidth && "w-full")}
        readOnly={readOnly}
        disabled={disabled}
      />
      {errors[id] && (
        <small className="text-sm text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(InputForm);
