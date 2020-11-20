import { useState, useEffect } from "react";
import { GetFormFields, GetFormSettings, UpdateListItem, getRender } from "Components";

export const useFormData = () => {
  const [formLayout, setFormLayout] = useState<any>([]);
  const [formType, setFormType] = useState("");

  let returnedSettings: any;
  let renderProperties: any;

  let getSettings = async () => {
    console.log("test2 :>> ");
    returnedSettings = await GetFormSettings("IntakeForm Config");
    renderProperties = await GetFormFields("Submitted Projects");
    console.log("renderProperties :>> ", renderProperties);
    let layoutParse = JSON.parse(returnedSettings[0].JSON);

    // sort returnedSettings so it's in alphabetical order, this allows both the renderProperties and returnedSettings to be in the same order.
    layoutParse.sort(function (a: any, b: any) {
      var textA = a.i.toUpperCase();
      var textB = b.i.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    setFormLayout(() => {
      let newLayout = layoutParse.map((field: any, index: number) => {
        return {
          x: field.x,
          y: field.y,
          w: field.w,
          h: 1,
          i: field.i,
          title: renderProperties[index].Title,
          render: getRender(
            renderProperties[index].Title,
            renderProperties[index].FieldType,
            renderProperties[index].Choices,
            renderProperties[index].InternalName,
            renderProperties[index].Description,
            renderProperties[index].Required
          ),
          description: renderProperties[index].Description,
          required: renderProperties[index].Required,
          internalName: renderProperties[index].InternalName,
          defaultValue: renderProperties[index].DefaultValue,
        }; //title: any, fieldType: any, choices: any, gridSize?: any, internalName?: any, description?: any, required?: any
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
    UpdateListItem("IntakeForm Config", 1, formLayout);
  };

  useEffect(() => {
    getSettings();
  }, []);

  return { formLayout, addField, handleFieldType };
};

export default useFormData;
