import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import * as Yup from "yup";
import { SingleLineTextField, DropDown, CreateListFields, CreateListItem, InlineEditList, MultiLineTextField } from "Components";
import "../AddFieldForm/AddFieldForm.css";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";
interface AddFieldFormProps {
  yPosition?: any;
  handleAddField: Function;
}
//@ts-ignore
export const AddFieldForm: React.FC<AddFieldFormProps> = ({ yPosition, handleAddField }) => {
  // console.log("handleAddField :>> ", handleAddField);
  const [validationSchema, setValidationSchema] = useState();
  // Yup.object().shape({
  //   title: Yup.string().required("This field is required"),
  //   fieldType: Yup.string().required("This field is required"),
  // });

  //If true, also make choices text field required
  const [showChoices, setShowChoices] = useState(false);

  const handleShowChoices = (dropDownValue: string) => {
    if (dropDownValue === "Choice") {
      setShowChoices(true);
    } else {
      if (document.getElementsByName("choices").length > 0) {
        //@ts-ignore
        (document.getElementsByName("choices") as HTMLInputElement)[0].innerHTML = "";
        setShowChoices(false);
      }
    }
  };

  const HandleSubmit = async (formValues: any) => {
    // console.log("formValues :>> ", formValues);

    let choices = () => {
      let choices: any;
      if (formValues.choices != undefined) {
        choices = formValues.choices.split("\n");
      }
      return choices;
    };

    let fieldTitleCamelCase = _.camelCase(formValues.title);
    let newItemProperties = {
      Title: fieldTitleCamelCase,
      InternalName: fieldTitleCamelCase,
      w: 2,
      y: yPosition.yPosition,
      x: 0,
    };

    handleAddField(formValues); //!ADD THIS BACK AFTER TESTING
    try {
      await CreateListFields(formValues.fieldType, "Submitted Projects", fieldTitleCamelCase, choices);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik
      onSubmit={(formValues) => {
        HandleSubmit(formValues);
      }}
      initialValues={{ title: "" }}
      // validationSchema={validationSchema}
    >
      {({ isValid, dirty, setFieldValue }) => (
        <Form>
          <Grid container spacing={3}>
            <SingleLineTextField required={true} label={"Title"} name={"title"} gridSize={4} toolTip={"Please enter a title for the field"} />
            <br />
            <DropDown
              label={"Field Type"}
              name={"fieldType"}
              gridSize={4}
              items={[
                { value: "Choice" },
                { value: "Person or Group" },
                { value: "Single Line of Text" },
                { value: "Multi Line of Text" },
                { value: "Date & Time" },
              ]}
              toolTip={"Please choose the field type"}
              required={true}
              handleShowChoices={handleShowChoices}
              setFieldValue={setFieldValue}
              setFieldName={"choices"}
            />
            <br />
            {showChoices && <MultiLineTextField required={showChoices} label={"Choices"} name={"choices"} gridSize={4} />}
          </Grid>
          <Button type="submit" variant="contained" color="primary">
            Add Field
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddFieldForm;
