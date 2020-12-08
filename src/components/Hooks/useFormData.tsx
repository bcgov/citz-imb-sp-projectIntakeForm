import { useState, useEffect } from "react";
import { GetFormFields, GetFormSettings, UpdateListItem, getRender } from "Components";

export const useFormData = (currentItem: any = "") => {
  const [formLayout, setFormLayout] = useState<any>([]);
  const [formType, setFormType] = useState("");

  let returnedSettings: any;
  let renderProperties: any;

  let getSettings = async () => {
    console.log("test2 :>> ");
    returnedSettings = await GetFormSettings("IntakeForm Config");
    renderProperties = await GetFormFields("Submitted Projects");
    console.log("renderProperties :>> ", renderProperties);
    console.log("returnedSettings :>> ", returnedSettings);
    let layoutParse = JSON.parse(returnedSettings[0].JSON);

    // sort returnedSettings so it's in alphabetical order, this allows both the renderProperties and returnedSettings to be in the same order.
    layoutParse.sort(function (a: any, b: any) {
      var textA = a.i.toUpperCase();
      var textB = b.i.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    let renderPropertiesObject: any = {};
    for (let j = 0; j < renderProperties.length; j++) {
      renderPropertiesObject[renderProperties[j].InternalName] = renderProperties[j];
    }

    setFormLayout(() => {
      let newLayout = layoutParse.map((field: any, index: number) => {
        if (field.TypeDisplayName === "section") {
          let layout: any = {};
          layout = {
            x: field.x,
            y: field.y,
            w: field.w,
            h: 1,
            i: field.i,
            title: field.i,
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
            render: getRender(
              renderPropertiesObject[field.i].Title,
              renderPropertiesObject[field.i].FieldType,
              renderPropertiesObject[field.i].Choices,
              renderPropertiesObject[field.i].InternalName,
              renderPropertiesObject[field.i].Description,
              renderPropertiesObject[field.i].Required,
              currentItem
            ),
            description: renderPropertiesObject[field.i].Description,
            required: renderPropertiesObject[field.i].Required,
            internalName: renderPropertiesObject[field.i].InternalName,
            defaultValue: renderPropertiesObject[field.i].DefaultValue,
          };

          return layout;
        }
      });
      return newLayout;
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
