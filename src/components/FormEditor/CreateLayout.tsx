import { useState, useEffect } from "react";
import { PeoplePickerFormEditor, AddFieldForm, GetFormFields, GetFormSettings } from "Components";
import { getRender } from "../Form/Reusable/getRender";

// interface CreateLayoutProps {
//   handleFieldsCallback?: any;
// }

export const CreateLayout = async () => {
  let returnedFields: any = await GetFormFields("Submitted Projects");
  let returnedSettings: any = await GetFormSettings("IntakeForm Config");
  let settings: any = {};

  let formConfig = JSON.parse(returnedSettings[0].JSON);
  for (let j = 0; j < formConfig.length; j++) {
    settings[formConfig[j].i] = {
      InternalName: formConfig[j].i,
      w: formConfig[j].w,
      y: formConfig[j].y,
      x: formConfig[j].x,
    };
    if (formConfig[j].FieldType === "Section") {
      returnedFields.push(settings[formConfig[j].i]);
    }
  }

  for (let j = 0; j < returnedFields.length; j++) {
    returnedFields[j].y = settings[formConfig[j].i].y;
    returnedFields[j].w = settings[formConfig[j].i].w;
    returnedFields[j].x = settings[formConfig[j].i].x;
    returnedFields[j].ID = settings[formConfig[j].i].ID;
    returnedFields[j].title = settings[formConfig[j].i].Title;
    returnedFields[j].i = settings[formConfig[j].i].InternalName;
    returnedFields[j].index = j;
    returnedFields[j].internalName = settings[formConfig[j].i].InternalName;
    returnedFields[j].render = getRender(returnedFields[j].Title, returnedFields[j].FieldType, returnedFields[j].Choices);
  }
  console.log("returnedFields :>> ", returnedFields);

  // returnedFields.sort((a: any, b: any) => {
  //   // Use toUpperCase() to ignore character casing
  //   const fieldA = a.y;
  //   const fieldB = b.y;

  //   let comparison = 0;
  //   if (fieldA > fieldB) {
  //     comparison = 1;
  //   } else if (fieldA < fieldB) {
  //     comparison = -1;
  //   }
  //   return comparison;
  // });

  return returnedFields;
};
