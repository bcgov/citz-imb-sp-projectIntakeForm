import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";
import { Field, ErrorMessage } from "formik";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import Grid from "@material-ui/core/Grid";
const EditableLabel = require("react-inline-editing");

interface InlineEditListProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  toolTip?: string;
  gridSize?: any;
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

const EditableTextBox = () => {
  return (
    <EditableLabel
      text="Hello!"
      labelClassName="myLabelClass"
      inputClassName="myInputClass"
      inputWidth="200px"
      inputHeight="25px"
      inputMaxLength="50"
      labelFontWeight="bold"
      inputFontWeight="bold"
    />
  );
};

export const InlineEditList: FC<InlineEditListProps> = ({ label, name, type = "text", required, toolTip, gridSize }) => {
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
        as={EditableTextBox}
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

export default InlineEditList;
