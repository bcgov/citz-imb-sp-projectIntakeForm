import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";
import { Field, ErrorMessage } from "formik";
import "./SingleLineTextField.css";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import Grid from "@material-ui/core/Grid";

interface SingleLineTextFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  toolTip?: string;
  gridSize: any;
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

export const SingleLineTextField: FC<SingleLineTextFieldProps> = ({ label, name, type = "text", required, toolTip, gridSize }) => {
  return (
    <Grid item xs={gridSize}>
      <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Tip</Typography>
            {toolTip}
          </React.Fragment>
        }
      >
        <InfoIcon />
      </HtmlTooltip>
      <Field
        required={required}
        as={TextField}
        autoComplete="off"
        label={label}
        fullWidth={true}
        type={type}
        name={name}
        helperText={<ErrorMessage name={name} />}
      />
    </Grid>
  );
};

export default SingleLineTextField;
