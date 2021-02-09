import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";
import { Field, ErrorMessage } from "formik";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import { CustomToolTip } from "Components";

interface MultiLineTextFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  toolTip?: string;
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

export const MultiLineTextField: FC<MultiLineTextFieldProps> = ({ label, name, type = "text", required, toolTip }) => {
  return (
    <>
      <CustomToolTip toolTip={toolTip} />

      <Field
        id="outlined-multiline-static"
        as={TextField}
        autoComplete="off"
        label={required ? `${label} *` : label}
        variant={"outlined"}
        fullWidth={true}
        multiline={true}
        rows="4"
        type={type}
        name={name}
        helperText={<ErrorMessage name={name} />}
      />
    </>
  );
};

export default MultiLineTextField;
