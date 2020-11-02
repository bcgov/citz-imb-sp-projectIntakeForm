import React from "react";
import { DateTimeFormEditor, SelectFormEditor } from "Components";
import TextField from "@material-ui/core/TextField";
export function getRender(title: any, fieldType: any, choices: any) {
  switch (fieldType) {
    case "Text":
      return <TextField label={title} variant="outlined" />;

      break;
    case "Note":
      return <TextField multiline={true} label={title} variant="outlined" />;

      break;
    case "DateTime":
      return <DateTimeFormEditor title={title} />;

      break;
    case "Choice":
      return <SelectFormEditor title={title} values={choices} />;

      break;
    case "Person or Group":
      return <TextField multiline={true} label={title} variant="outlined" />;

      break;
    case "Section":
      return <div>section {title}</div>;
      break;

    default:
      return <div>{title}</div>;
      break;
  }
}

// if (!returnedFields[i].DefaultValue) {
//   returnedFields[i].DefaultValue = null;
// }
