import React, { useState, useEffect, useContext, FC } from "react";
import { Formik, Form, Field } from "formik";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useFormData, HandleAttachments, CreateListItem, DialogCloseContext, ProgressIndicator, FormTypeContext, UpdateListItem } from "Components";
import * as Yup from "yup";

interface InputFormContentProps {
  currentItem?: any;
}

export const InputFormContent: FC<InputFormContentProps> = ({ currentItem }) => {
  let formType = useContext(FormTypeContext);

  const [filesToUpload, setFilesToUpload] = useState<any>([]);
  const [initialValues, setIntitialValues] = useState<any>();
  const [validationSchema, setValidationSchema] = useState(Yup.object().shape({}));
  const [isLoading, setIsLoading] = useState(true);

  const handleDialogClose = useContext(DialogCloseContext);
  const { formLayout } = useFormData(currentItem);

  useEffect(() => {
    setValidationSchema(() => {
      let tempSchema: any = {};
      formLayout.map((field: any) => {
        console.log("formLayout :>> ", formLayout);
        if (field.Required) tempSchema[field.InternalName] = Yup.string().required(field.InternalName + " is required");
      });
      let schema = Yup.object().shape(tempSchema);
      return schema;
    });
  }, []);

  useEffect(() => {
    setIntitialValues(() => {
      console.log("currentItem :>> ", currentItem);
      console.log("formLayout :>> ", formLayout);
      if (currentItem) {
        let initialValues: any = { ID: currentItem.ID };
        Object.keys(currentItem).forEach((currentItemKey) => {
          Object.keys(formLayout).forEach((formLayoutKey) => {
            if (formLayout[formLayoutKey].i === currentItemKey) {
              initialValues[currentItemKey] = currentItem[currentItemKey];
            }
          });
        });
        // let tempFormattedValues: any = {};
        // Object.keys(currentItem).forEach((currentItemKey) => {
        //   console.log("currentItem :>> ", currentItem);
        //   console.log("currentItemKey :>> ", currentItemKey);
        //   console.log("currentItem[currentItemKey] :>> ", currentItem[currentItemKey]);
        // tempFormattedValues.currentItemKey = currentItem[currentItemKey].split("-")[0];
        // });
        return Object.keys(initialValues).length > 1 ? initialValues : undefined;
      } else {
        let initialValues: any = {};
        formLayout.map((field: any) => {
          if (field.FieldType !== "Section") initialValues[field.InternalName] = field.defaultValue;
        });
        return initialValues;
      }
    });
  }, [formLayout]);

  useEffect(() => {
    console.log("initialValues.Title :>> ", initialValues?.Title);
    if (initialValues) {
      console.log("initialValues :>> ", initialValues);
      setIsLoading(false);
    }
  }, [initialValues]);

  const generateDOM = () => {
    let orderByYaxis = formLayout.sort(function (a: any, b: any) {
      var textAy = a.y;
      var textBy = b.y;
      var textAx = a.x;
      var textBx = b.x;
      return textAy < textBy ? -1 : textAy > textBy ? 1 : textAx < textBx ? -1 : textAx > textBx ? 1 : 0;
    });
    let formFields = orderByYaxis.map((field: any) => {
      // console.log("field", field);
      if (field.w === 1) {
        field.w = 6;
      } else if (field.w === 2) {
        field.w = 12;
      }

      return (
        <Grid item xs={field.w}>
          {field.render}
        </Grid>
      );
    });
    return formFields;
  };

  const handleFormSubmit = async (formValues: any, { setSubmitting }: any) => {
    if (formType === "New") {
      // //!add back after testing Date of note: 12-03-2020
      try {
        const CreateListItemResponse = await CreateListItem(formValues, "Submitted Projects");
        // const HandleAttachmentRepsonse = await HandleAttachments("Submitted Projects", CreateListItemResponse, filesToUpload);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        // const UpdateListItemResponse = await UpdateListItem("Submitted Projects", formValues.ID, formValues);
        // const HandleAttachmentRepsonse = await HandleAttachments("Submitted Projects", UpdateListItemResponse, filesToUpload);
      } catch (error) {
        console.log(error);
      }
    }
    console.log("formValues :>> ", formValues);
    // @ts-ignore
    handleDialogClose();
    setSubmitting(false);
  };
  return (
    <>
      {isLoading ? (
        <div style={{ position: "absolute", left: "50%", top: "50%" }}>
          <CircularProgress />
        </div>
      ) : (
        <Formik initialValues={initialValues} onSubmit={handleFormSubmit} validationSchema={validationSchema}>
          {({ isValid, dirty, isSubmitting, validateForm }) => (
            <Form>
              {isSubmitting ? (
                <ProgressIndicator />
              ) : (
                <>
                  <Grid container spacing={3}>
                    {generateDOM()}
                  </Grid>
                  <br />
                  <br />
                  <Button disabled={isSubmitting} type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // @ts-ignore
                      handleDialogClose();
                    }}
                    variant="contained"
                    color="secondary"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default InputFormContent;
