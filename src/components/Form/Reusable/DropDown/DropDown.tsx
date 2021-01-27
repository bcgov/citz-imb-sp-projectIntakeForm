import React, { FC, ReactNode, useEffect, useContext, useState } from "react";
import { Field, ErrorMessage, FieldInputProps } from "formik";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "../DropDown/DropDown.css";
import { ScoreContext, CustomToolTip } from "Components";

interface DropDownProps {
  choices: any[];
  label: string;
  name?: any;
  toolTip: any;
}

interface MaterialUISelectFieldProps extends FieldInputProps<string> {
  errorString?: string;
  children: ReactNode;
  label: string;
}

const MaterialUISelectField: FC<MaterialUISelectFieldProps> = ({ errorString, label, children, value, name, onChange, onBlur }) => {
  const [previousComponentScore, setPreviousComponentScore] = useState<any>(0);
  const scoreContext: any = useContext(ScoreContext);
  useEffect(() => {
    setPreviousComponentScore(() => {
      if (isNaN(parseInt(value?.split("-")[1]))) {
        return 0;
      } else {
        return parseInt(value?.split("-")[1]);
      }
    });
    return;
  }, []);
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        onChange={(event: any) => {
          //The reason for "formattedComponentScore" is because not all choices will have a score value and they will return NaN if they don't have a score.  The apps reducer function has not been adjusted to account for NaN so we need to convert NaN to 0.
          let formattedComponentScore: any;
          if (Number.isNaN(event._targetInst.memoizedProps["data-score"])) {
            formattedComponentScore = 0;
          } else {
            formattedComponentScore = event._targetInst.memoizedProps["data-score"];
          }
          scoreContext.scoreDispatch({ currentItemScore: formattedComponentScore, previousItemScore: previousComponentScore });
          setPreviousComponentScore(formattedComponentScore);

          onChange(event);
        }}
        onBlur={onBlur}
        value={value}
      >
        {children}
      </Select>
      <FormHelperText>{errorString}</FormHelperText>
    </FormControl>
  );
};

export const DropDown: FC<DropDownProps> = ({ choices, name, label, toolTip }) => {
  return (
    <div>
      <CustomToolTip toolTip={toolTip} />

      <Field name={name} as={MaterialUISelectField} label={label} errorString={<ErrorMessage name={name} />}>
        {choices.map((choice: any) => (
          <MenuItem data-score={choice.score} key={choice.value} value={choice.value}>
            {choice.label}
          </MenuItem>
        ))}
      </Field>
    </div>
  );
};
export default DropDown;
