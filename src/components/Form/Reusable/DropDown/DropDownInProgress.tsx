import React, { FC, useEffect, useContext, useState } from "react";
import { Field, ErrorMessage, FieldInputProps } from "formik";
import { FormControl, FormHelperText, Select, MenuItem } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import { ScoreContext, CustomToolTip } from "Components";

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
export const DropDown: FC<DropDownProps> = ({
  setFieldName,
  choices,
  name,
  label,
  toolTip,
  required,
  handleShowChoices = () => {},
  setFieldValue = () => {},
  editValue = "",
}) => {
  const [previousComponentScore, setPreviousComponentScore] = useState<any>(0);
  const scoreContext: any = useContext(ScoreContext);

  return (
    <Field
      handleShowChoices={handleShowChoices}
      setFieldValue={setFieldValue}
      name={name}
      label={label}
      errorMessage={<ErrorMessage name={name} />}
      required={required}
      setFieldName={setFieldName}
    >
      {({ field }: any) => {
        setPreviousComponentScore(() => {
          if (isNaN(parseInt(field.value?.split("-")[1]))) {
            return 0;
          } else {
            return parseInt(field.value?.split("-")[1]);
          }
        });
        return (
          <>
            <CustomToolTip toolTip={toolTip} />

            <FormControl variant="outlined" fullWidth={true} required={required}>
              <InputLabel htmlFor={name + "id"}>{label}</InputLabel>
              <Select
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
                  // handleShowChoices(event.target.value);
                  // setFieldValue(setFieldName, "");
                }}
                id={name + "id"}
                value={field.value}
                label="Age"
                name={name}
              >
                {choices.map((choice, index) => {
                  return (
                    <MenuItem data-score={choice.score} key={choice.value} value={choice.value}>
                      {choice.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </>
        );
      }}
    </Field>
  );
};
