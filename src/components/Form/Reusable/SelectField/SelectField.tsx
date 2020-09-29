import React, { FC, ReactNode } from "react";
import { Field, ErrorMessage, FieldInputProps } from "formik";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import Grid from "@material-ui/core/Grid";

interface SelectFieldProps {
  dropDownValue: any[];
  label: string;
  name?: string;
  gridSize: any;
  toolTip?: string;
}

interface MaterialUISelectFieldProps extends FieldInputProps<string> {
  errorString?: string;
  children: ReactNode;
  label: string;
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

const MaterialUISelectField: FC<MaterialUISelectFieldProps> = ({ errorString, label, children, value, name, onChange, onBlur }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select name={name} onChange={onChange} onBlur={onBlur} value={value}>
        {children}
      </Select>
      <FormHelperText>{errorString}</FormHelperText>
    </FormControl>
  );
};

export const SelectField: FC<SelectFieldProps> = ({ dropDownValue, name, label, gridSize, toolTip }) => {
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
      <Field name={name} as={MaterialUISelectField} label={label} errorString={<ErrorMessage name={"name"} />}>
        {dropDownValue.map((dropDownValue: any) => (
          <MenuItem key={dropDownValue.ID} value={dropDownValue.Title}>
            {dropDownValue.Title}
          </MenuItem>
        ))}
      </Field>
    </Grid>
  );
};
export default SelectField;
