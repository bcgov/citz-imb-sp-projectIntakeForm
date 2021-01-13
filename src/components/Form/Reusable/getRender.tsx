import React from "react";
import { PeoplePicker, SingleLineTextField, MultiLineTextField, DateTimePicker, DropDown, NumberColumn, Section } from "Components";
import TextField from "@material-ui/core/TextField";
import { Field } from "formik";
import "react-dropzone-uploader/dist/styles.css";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
export function getRender(title?: any, fieldType?: any, choices?: any, internalName?: any, description?: any, required?: any, currentItem?: any) {
  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  switch (fieldType) {
    case "Text":
      return (
        <SingleLineTextField label={title} name={internalName} toolTip={description} required={required} />

        // if (!returnedFields[i].DefaultValue) {
        //   returnedFields[i].DefaultValue = "";
        // }
      );
      // console.log("returnedFields[i].DefaultValue :>> ", returnedFields[i].DefaultValue, returnedFields[i].InternalName);

      break;
    case "Note":
      return <MultiLineTextField label={title} name={internalName} toolTip={description} required={required} />;
      // if (!returnedFields[i].DefaultValue) {
      //   returnedFields[i].DefaultValue = "";
      // }
      // console.log("returnedFields[i].DefaultValue :>> ", returnedFields[i].DefaultValue, returnedFields[i].InternalName);

      break;
    case "Number":
      if (internalName.split("_x002d_")[1] !== "hidden")
        return <NumberColumn label={title} name={internalName} toolTip={description} required={required} />;

      // if (!returnedFields[i].DefaultValue) {
      //   returnedFields[i].DefaultValue = "";
      // }
      // console.log("returnedFields[i].DefaultValue :>> ", returnedFields[i].DefaultValue, returnedFields[i].InternalName);
      break;
    case "DateTime":
      return <DateTimePicker label={title} name={internalName} toolTip={description} editValue={currentItem} />;
      // if (!returnedFields[i].DefaultValue) {
      //   returnedFields[i].DefaultValue = null;
      // }
      break;
    case "Choice":
      return <DropDown label={title} name={internalName} toolTip={description} required={required} choices={choices} />;
      // if (!returnedFields[i].DefaultValue) {
      //   returnedFields[i].DefaultValue = "";
      // }
      break;
    case "User":
      return (
        <Field name={internalName}>
          {(fieldProps: any) => {
            return (
              <PeoplePicker
                label={title}
                name={internalName + "Id"}
                setFieldValue={fieldProps.form.setFieldValue}
                {...fieldProps}
                currentItem={currentItem}
              />
            );
          }}
        </Field>
      );

      // <PeoplePicker label={title} name={internalName} />;

      break;
    // case "Attachments":
    //   return <Dropzone />;

    //   break;
    case "section":
      return <Section title={title} />;
      break;
    case "sectionDescription":
      return <Alert severity="info">{title}</Alert>;
      break;

    default:
      return <div>default render</div>;
      break;
  }
}
