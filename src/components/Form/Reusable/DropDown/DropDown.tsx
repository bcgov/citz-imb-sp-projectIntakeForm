import React, { FC, ReactNode } from "react";
import { Field, ErrorMessage, FieldInputProps } from "formik";
import Grid from "@material-ui/core/Grid";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import { withStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

interface DropDownItem extends FieldInputProps<string> {
  label: string;
  value: string;
}

interface DropDownProps {
  items: any[];
  label: string;
  name?: any;
  gridSize: any;
  toolTip?: string;
  required?: boolean;
  handleShowChoices?: Function;
  setFieldValue?: Function;
  setFieldName?: string;
}

interface MaterialUISelectFieldProps extends FieldInputProps<string> {
  errorMessage?: string;
  children: ReactNode;
  label: string;
  required?: boolean;
  handleShowChoices?: Function;
  setFieldValue?: Function;
  setFieldName?: string;
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

const MaterialUISelectField: React.FC<MaterialUISelectFieldProps> = ({
  errorMessage,
  label,
  children,
  value,
  name,
  onChange,
  onBlur,
  required,
  handleShowChoices = () => {},
  setFieldValue = () => {
    console.log("no set Field Function Provided");
  },
  setFieldName,
}) => {
  return (
    <FormControl fullWidth={true} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        onChange={(event) => {
          console.log("value :>> ", event);
          handleShowChoices(event.target.value);
          setFieldValue(setFieldName, "");
          onChange(event);
        }}
        value={value}
      >
        {children}
      </Select>
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};

export const DropDown: FC<DropDownProps> = ({ setFieldName, items, name, label, gridSize, toolTip, required, handleShowChoices, setFieldValue }) => {
  // console.log("dropDownValue :>> ", items);
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
        handleShowChoices={handleShowChoices}
        setFieldValue={setFieldValue}
        name={name}
        as={MaterialUISelectField}
        label={label}
        errorMessage={<ErrorMessage name={name} />}
        required={required}
        setFieldName={setFieldName}
      >
        {items.map((item, index) => (
          <MenuItem key={item.value} value={item.value}>
            {item.value}
          </MenuItem>
        ))}
      </Field>
    </Grid>
  );
};
export default DropDown;
