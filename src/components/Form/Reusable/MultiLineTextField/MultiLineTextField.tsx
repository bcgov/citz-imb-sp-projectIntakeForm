import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";
import { Field, ErrorMessage } from "formik";

interface MultiLineTextFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}

export const MultiLineTextField: FC<MultiLineTextFieldProps> = ({ label, name, type = "text", required = true }) => {
  return (
    <div className="MultiLineTextField">
      <Field
        id="outlined-multiline-static"
        required={required}
        as={TextField}
        autoComplete="off"
        label={label}
        fullwidth={true}
        multiline={true}
        rows="4"
        type={type}
        name={name}
        helperText={<ErrorMessage name={name} />}
      />
    </div>
  );
};

export default MultiLineTextField;
