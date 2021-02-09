import React, { FC, useContext, useEffect } from "react";
import { ErrorMessage } from "formik";
import { usePeoplePicker, FormTypeContext } from "Components";
import { TextField, Chip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";

import "../PeoplePicker/PeoplePicker.css";
interface PeoplePickerProps {
  name: string;
  label: string;
  currentItem: any;
  field: any;
  form: any;
  meta: any;
  required: any;
}

export const PeoplePicker: FC<PeoplePickerProps> = (props) => {
  const { name, label, currentItem, field, form, meta, required } = props;

  let formTypeContext: any = useContext(FormTypeContext);

  const { onChange, searchResults, reset } = usePeoplePicker();

  // const getDefaultValue = () => {
  //   console.log(form);
  //   // console.log('[currentItem[name.replace("Id", "")]]', [currentItem[name.replace("Id", "")]]);
  //   if (formTypeContext === "Edit") {
  //     console.log("form.values[name] :>> ", name, form.values[name]);
  //     if (form.initialValues[name] !== "") {
  //       if (form.values[name]) {
  //         return { DisplayText: form.values[name] };
  //       } else {
  //         return { DisplayText: form.initialValues[name] };
  //       }
  //     } else {
  //       console.log("bad news");
  //       return undefined;
  //     }
  //   }

  //   return undefined;
  // };

  const getDefaultValue = () => {
    if (form.values[name] !== "") {
      if (form.values[name]?.DisplayText === undefined) {
        return { DisplayText: form.values[name] };
      } else {
        return form.values[name];
      }
    }

    return undefined;
  };

  useEffect(() => {
    form.setFieldValue(name, form.values[name], false);
    reset();
  }, []);
  return (
    <>
      <Autocomplete
        // defaultValue={() => {
        //   console.log("name :>> ", name);
        //   form.setFieldValue(name, form.initialValues[name], true);
        //   form.setFieldTouched(name, true, true);

        //   return getDefaultValue();
        // }}
        defaultValue={getDefaultValue()}
        autoHighlight={true}
        // @ts-ignore
        // name={name}
        options={searchResults}
        getOptionLabel={(option: any) => option.DisplayText}
        // value={value}
        onBlur={form.handleBlur}
        onChange={(e: any, value: any) => {
          setTimeout(function () {
            form.setFieldValue(name, value, true);
            form.setFieldTouched(name, true, true);
            reset();
          }, 100); //Time before execution
        }}
        renderInput={(params) => (
          <TextField
            className="reactTextInput"
            {...params}
            onChange={onChange}
            name={name}
            label={required ? `${label} *` : label}
            variant="outlined"
            fullWidth
          />
        )}
      />
      <FormHelperText>
        <ErrorMessage name={name} />
      </FormHelperText>
    </>
  );
};
