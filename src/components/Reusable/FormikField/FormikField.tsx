import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";
import { Field, ErrorMessage } from "formik";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import { CustomToolTip } from "Components";

interface FormikFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  toolTip?: string;
  render?: any;
}

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    display: "block",
  },
}))(Tooltip);

export const FormikField: FC<FormikFieldProps> = ({ label, name, type = "text", required, toolTip, render }) => {
  return (
    <>
      <CustomToolTip toolTip={toolTip} />

      <Field
        required={required}
        as={render}
        autoComplete="off"
        label={label}
        fullWidth={true}
        type={type}
        name={name}
        helperText={<ErrorMessage name={name} />}
      />
    </>
  );
};

export default FormikField;
