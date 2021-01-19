import React, { useState, useEffect, useContext, FC } from "react";
import { Formik, Form, Field } from "formik";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dropzone from "react-dropzone-uploader";
import Paper from "@material-ui/core/Paper";
import {
  useFormData,
  HandleAttachments,
  CreateListItem,
  DialogToggleContext,
  ProgressIndicator,
  FormTypeContext,
  UpdateListItem,
  ScoreContext,
  AttachmentViewer,
  RefreshDataContext,
} from "Components";
import * as Yup from "yup";

interface InputFormContentProps {
  currentItem?: any;
}

export const InputFormContent: FC<InputFormContentProps> = ({ currentItem }) => {
  const scoreContext: any = useContext(ScoreContext);
  const refreshDataContext: any = useContext(RefreshDataContext);

  let formType = useContext(FormTypeContext);

  const [filesToUpload, setFilesToUpload] = useState<any>([]);
  const [initialValues, setIntitialValues] = useState<any>();
  const [validationSchema, setValidationSchema] = useState(Yup.object().shape({}));
  const [isLoading, setIsLoading] = useState(true);

  const dialogToggleContext: any = useContext(DialogToggleContext);
  const { formLayout } = useFormData(currentItem);

  useEffect(() => {
    setValidationSchema(() => {
      let tempSchema: any = {};
      formLayout.map((field: any) => {
        if (field.Required) tempSchema[field.InternalName] = Yup.string().required(field.InternalName + " is required");
      });
      let schema = Yup.object().shape(tempSchema);
      return schema;
    });
  }, []);

  useEffect(() => {
    setIntitialValues(() => {
      if (currentItem) {
        let initialValues: any = { ID: currentItem.ID };
        Object.keys(currentItem).forEach((currentItemKey) => {
          Object.keys(formLayout).forEach((formLayoutKey) => {
            if (formLayout[formLayoutKey].i === currentItemKey) {
              initialValues[currentItemKey] = currentItem[currentItemKey];
            }
          });
        });

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
    if (initialValues) {
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
        const CreateListItemResponse: any = await CreateListItem(formValues, "Submitted Projects", scoreContext.scoreState);
        if (filesToUpload.length > 0) {
          await HandleAttachments("Submitted Projects", CreateListItemResponse.d.ID, filesToUpload);
        }
      } catch (error) {}
    } else {
      try {
        const UpdateListItemResponse = await UpdateListItem("Submitted Projects", formValues.ID, formValues, initialValues, scoreContext.scoreState);

        if (filesToUpload.length > 0) {
          await HandleAttachments("Submitted Projects", currentItem, filesToUpload);
        }
      } catch (error) {}
    }

    // //@ts-ignore
    // dialogToggleContext.close();
    // setSubmitting(false);
    // refreshDataContext.handleRefresh();
    // console.log("formValues :>> ", formValues);
  };

  const handleChangeStatus = ({ meta, remove, file }: any, status: any) => {
    if (status === "rejected_file_type") {
      alert("file Type not accepted");
    } else if (status === "rejected_max_files") {
      alert("exceeded max number of files");
    } else if (status === "error_file_size") {
      alert("File exceeds maximum allowed file size");
    } else if (status === "error_validation") {
      alert("File validation failed");
    } else if (status === "upload timed out, lost connection to upload server") {
      alert("exceeded max number of files");
    } else if (status === "error_upload") {
      alert("response has HTTP status code >= 400");
    } else if (status === "done") {
      setFilesToUpload((previousFiles: any) => {
        let tempPreviousFiles = [...previousFiles];
        let fileExists = false;

        fileExists = previousFiles.find((file: any) => file.name === meta.name);

        if (!fileExists) {
          tempPreviousFiles.push(file);
        } else {
          remove();
        }

        return tempPreviousFiles;
      });
    }
  };
  useEffect(() => {
    console.log("filesToUpload :>> ", filesToUpload);
  }, [filesToUpload]);
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
                    {formType === "Edit" ? <AttachmentViewer attachments={currentItem.AttachmentFiles.results} currentItemId={currentItem.Id} /> : ""}

                    <Dropzone onChangeStatus={handleChangeStatus} />
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
                      dialogToggleContext.close();
                      refreshDataContext.handleRefresh();
                    }}
                    variant="contained"
                    color="secondary"
                  >
                    Close
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
