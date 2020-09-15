import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";
import { Field, ErrorMessage } from "formik";
import "./SingleLineTextField.css";

interface SingleLineTextFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}

export const SingleLineTextField: FC<SingleLineTextFieldProps> = ({ label, name, type = "text", required = false }) => {
  return (
    <div className="SingleLineTextField">
      <Field
        required={required}
        as={TextField}
        autoComplete="off"
        label={label}
        fullwidth={true}
        type={type}
        name={name}
        helperText={<ErrorMessage name={name} />}
      />
    </div>
  );
};

export default SingleLineTextField;
