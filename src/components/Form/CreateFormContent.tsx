import React, { useState, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useFormData, HandleAttachments, CreateListItem, DialogCloseContext, ProgressIndicator } from "Components";
import * as Yup from "yup";

export function CreateFormContent() {
  const [filesToUpload, setFilesToUpload] = useState<any>([]);
  const [initialValues, setIntitialValues] = useState<any>();
  const [validationSchema, setValidationSchema] = useState(Yup.object().shape({}));

  const handleDialogClose = useContext(DialogCloseContext);
  const { formLayout } = useFormData();

  useEffect(() => {
    setValidationSchema(() => {
      let tempSchema: any = {};
      formLayout.map((field: any) => {
        if (field.Required) tempSchema[field.InternalName] = Yup.string().required(field.InternalName + " is required");
      });
      let schema = Yup.object().shape(tempSchema);
      return schema;
    });

    setIntitialValues(() => {
      let initialValues: any = {};
      formLayout.map((field: any) => {
        if (field.FieldType !== "Section") initialValues[field.InternalName] = field.defaultValue;
      });
      return initialValues;
    });
  }, []);

  const generateDOM = () => {
    let orderByYaxis = formLayout.sort(function (a: any, b: any) {
      var textA = a.y;
      var textB = b.y;
      return textA < textB ? -1 : textA > textB ? 1 : 0;
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
    console.log("formFields2", formFields);
    return formFields;
  };

  const handleFormSubmit = async (formValues: any, { setSubmitting }: any) => {
    try {
      const CreateListItemResponse = await CreateListItem(formValues, "Submitted Projects");
      const HandleAttachmentRepsonse = await HandleAttachments("Submitted Projects", CreateListItemResponse, filesToUpload);
    } catch (error) {
      console.log(error);
    }
    // @ts-ignore
    handleDialogClose();
    setSubmitting(false);
  };

  return (
    <>
      {initialValues ? (
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
      ) : (
        <div style={{ position: "absolute", left: "50%", top: "50%" }}>
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default CreateFormContent;
