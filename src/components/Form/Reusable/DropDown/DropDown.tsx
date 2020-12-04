import React, { FC, ReactNode, useContext, useState } from "react";
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
import { ScoreContext } from "Components";

interface DropDownItem extends FieldInputProps<string> {
  label: string;
  value: string;
}

interface DropDownProps {
  choices: any[];
  label: string;
  name?: any;
  toolTip?: string;
  required?: boolean;
  handleShowChoices?: Function;
  setFieldValue?: Function;
  setFieldName?: string;
  editValue?: any;
}

interface MaterialUISelectFieldProps extends FieldInputProps<string> {
  errorMessage?: string;
  children: ReactNode;
  label: string;
  required?: boolean;
  handleShowChoices?: Function;
  setFieldValue?: Function;
  setFieldName?: string;
  editValue?: any;
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
    //console.log("no set Field Function Provided");
  },
  setFieldName,
  editValue,
}) => {
  const [previousComponentScore, setPreviousComponentScore] = useState(0);
  const scoreContext: any = useContext(ScoreContext);
  return (
    <FormControl fullWidth={true} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        onChange={(event: any) => {
          console.log('event._targetInst.memoizedProps["data-score"] :>> ', event._targetInst.memoizedProps["data-score"]);
          //The reason for "formattedComponentScore" is because not all choices will have a score value and they will return NaN if they don't have a score.  The apps reducer function has not been adjusted to account for NaN so we need to convert NaN to 0.
          let formattedComponentScore: any;
          if (Number.isNaN(event._targetInst.memoizedProps["data-score"])) {
            console.log("is not a number");
            formattedComponentScore = 0;
          } else {
            console.log("is a number");
            formattedComponentScore = event._targetInst.memoizedProps["data-score"];
          }
          scoreContext.scoreDispatch([formattedComponentScore, previousComponentScore]);
          setPreviousComponentScore(formattedComponentScore);
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

export const DropDown: FC<DropDownProps> = ({
  setFieldName,
  choices,
  name,
  label,
  toolTip,
  required,
  handleShowChoices,
  setFieldValue,
  editValue = "",
}) => {
  // console.log("dropDownValue :>> ", choices);
  return (
    <>
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
        {choices.map((choice, index) => {
          return (
            <MenuItem data-score={choice.score} key={choice.value} value={choice.value}>
              {choice.label}
            </MenuItem>
          );
        })}
      </Field>
    </>
  );
};
export default DropDown;
