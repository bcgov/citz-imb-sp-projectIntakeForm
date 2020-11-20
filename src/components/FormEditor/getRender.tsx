import React from "react";
import { PeoplePicker, SingleLineTextField, MultiLineTextField, DateTimePicker, DropDown } from "Components";
import TextField from "@material-ui/core/TextField";
// import Dropzone from "react-dropzone-uploader";

export function getRender(title: any, fieldType: any, choices: any, internalName?: any, description?: any, required?: any) {
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
    case "DateTime":
      return <DateTimePicker label={title} name={internalName} toolTip={description} />;
      // if (!returnedFields[i].DefaultValue) {
      //   returnedFields[i].DefaultValue = null;
      // }
      break;
    case "Choice":
      return <DropDown label={title} name={internalName} toolTip={description} required={required} items={choices} />;
      // if (!returnedFields[i].DefaultValue) {
      //   returnedFields[i].DefaultValue = "";
      // }
      break;
    case "User":
      return <PeoplePicker pLabel={title} pDivId={title} />;

      break;
    case "Section":
      return <div>section</div>;
      break;

    default:
      return "";
      break;
  }
}
