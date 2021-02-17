import { useState, useEffect } from "react";
import {
  GetFormFields,
  GetFormSettings,
  UpdateListItem,
  getRender,
} from "Components";

export const useFormData = (currentItem: any = "") => {
  const [formLayout, setFormLayout] = useState<any>([]);
  const [formType, setFormType] = useState("");

  let returnedSettings: any;
  let renderProperties: any;

  //Production;
  //@ts-ignore
  let _spPageContextInfo = window._spPageContextInfo;

  //Dev

  // let _spPageContextInfo = {
  //   webPermMasks: { High: 2147483647, Low: 4294967295 },
  //   // webPermMasks: { High: 176, Low: 138612833 },
  // };

  let getSettings = async () => {
    returnedSettings = await GetFormSettings("IntakeForm Config");
    renderProperties = await GetFormFields("Submitted Projects");
    let layoutParse = JSON.parse(returnedSettings[0].JSON);
    console.log("renderProperties :>> ", renderProperties);
    // sort returnedSettings so it's in alphabetical order, this allows both the renderProperties and returnedSettings to be in the same order.
    layoutParse.sort(function (a: any, b: any) {
      var textA = a.i.toUpperCase();
      var textB = b.i.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    let renderPropertiesObject: any = {};
    for (let j = 0; j < renderProperties.length; j++) {
      renderPropertiesObject[renderProperties[j].InternalName] =
        renderProperties[j];
    }
    //Two form layouts because some properties are not necessary for section headers
    setFormLayout(() => {
      let newLayout = layoutParse.map((field: any, index: number) => {
        if (
          field.TypeDisplayName === "section" ||
          field.TypeDisplayName === "sectionDescription"
        ) {
          let layout: any = {};
          layout = {
            x: field.x,
            y: field.y,
            w: field.w,
            h: 1,
            i: field.i,
            title: field.i,
            fieldType: field.TypeDisplayName,
            render: getRender(field.i, field.TypeDisplayName),
          };

          return layout;
        } else {
          let layout: any = {};
          layout = {
            x: field.x,
            y: field.y,
            w: field.w,
            h: 1,
            i: field.i,
            title: renderPropertiesObject[field.i].Title,
            fieldType: renderPropertiesObject[field.i].TypeDisplayName,
            render: getRender(
              renderPropertiesObject[field.i].Title,
              renderPropertiesObject[field.i].FieldType,
              renderPropertiesObject[field.i].Choices,
              renderPropertiesObject[field.i].InternalName,
              renderPropertiesObject[field.i].Description,
              renderPropertiesObject[field.i]?.Required,
              currentItem
            ),
            description: renderPropertiesObject[field.i].Description,
            required: renderPropertiesObject[field.i].Required,
            internalName: renderPropertiesObject[field.i].InternalName,
            defaultValue: renderPropertiesObject[field.i].DefaultValue,
          };

          if (
            renderPropertiesObject[field.i].InternalName !== "SubmissionStatus"
          ) {
            return layout;
          } else {
            console.log(
              "_spPageContextInfo.webPermMasks",
              _spPageContextInfo.webPermMasks
            );
            //if user has full control, show Submission Status.  Adjust the high and low to match Full control perm mask.  Site Collections Admins will also not be able to see this field regardless.

            if (
              (_spPageContextInfo.webPermMasks.High === 2147483647 &&
                _spPageContextInfo.webPermMasks.Low === 4294967295) ||
              (_spPageContextInfo.webPermMasks.High === 1073742320 &&
                _spPageContextInfo.webPermMasks.Low === 2097093631)
            ) {
              return layout;
            } else {
              console.log("field.TypeDisplayName", field.TypeDisplayName);
            }
          }
        }
      });
      //returning with a filter because newlayout variable will have undefined object propoerties if user is not full control.  This results in a fail in another file that relies on these results.
      return newLayout.filter((item: any) => item !== undefined);
    });
  };

  const handleFieldType = (fieldType: any) => {
    setFormType(fieldType);
  };

  let addField: any = (fieldTitle: any) => {
    setFormLayout(() => {
      return formLayout.concat({
        x: 0,
        y: formLayout.length,
        w: 2,
        h: 1,
        i: fieldTitle,
      });
    });
    // UpdateListItem("IntakeForm Config", 1, formLayout);
  };

  useEffect(() => {
    getSettings();
  }, []);

  return { formLayout, addField, handleFieldType };
};

export default useFormData;
