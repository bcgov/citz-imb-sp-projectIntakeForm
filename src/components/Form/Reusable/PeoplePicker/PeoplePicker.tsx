import React, { useState, useEffect, FC, useContext } from "react";
import { usePeoplePicker, FormTypeContext } from "Components";
import { TextField, Chip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

interface PeoplePickerProps {
  label: any;
  name: any;
  setFieldValue: any;
  fieldProps: any;
  variant?: any;
  placeholder?: any;
  currentItem?: any;
}

export const PeoplePicker: FC<PeoplePickerProps> = ({
  label,
  name,
  setFieldValue,
  fieldProps,
  variant = "outlined",
  placeholder = "",
  currentItem = "",
}) => {
  let formType = useContext(FormTypeContext);

  useEffect(() => {
    console.log("formType :>> ", formType);
    let userFieldLessID = name.replace("Id", "");
    console.log("userFieldLessID :>> ", userFieldLessID);
    // console.log("currentItem :>> ", currentItem[name.replace("Id", "")]);
    console.log("name :>> ", name);
    setFieldValue(name, currentItem, false);
    reset();
  }, []);
  const { onChange, searchResults, reset } = usePeoplePicker();
  const changeHandler = (event: any, value: any, reason: any) => {
    setFieldValue(name, value, false);
    reset();
  };
  const getDefaultValue = () => {
    console.log('[currentItem[name.replace("Id", "")]]', [currentItem[name.replace("Id", "")]]);
    if (formType === "Edit") {
      if (currentItem[name.replace("Id", "")] !== "") {
        return [currentItem[name.replace("Id", "")]];
      }
    }
    return undefined;
  };

  return (
    <Autocomplete
      defaultValue={getDefaultValue()}
      autoHighlight={true}
      multiple
      options={searchResults}
      getOptionLabel={(option: any) => option.DisplayText}
      onChange={changeHandler}
      filterSelectedOptions
      // renderTags={
      //   formType === "Edit"
      //     ? (value, getTagProps) =>
      //         value.map((option, index) => (
      //           <Chip variant="outlined" label={currentItem[name.replace("Id", "")]} size="small" {...getTagProps({ index })} />
      //         ))
      //     : undefined
      // }
      renderInput={(params) => <TextField {...params} onChange={onChange} variant="outlined" label={label} placeholder={placeholder} />}

      // {...remainingProps}
    />
  );
};

{
  /* <TextField {...params} onChange={onChange} variant={variant} label={label} placeholder={placeholder} /> */
}
