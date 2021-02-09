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
  const [initialValues, setIntitialValues] = useState<any>({});
  const [validationSchema, setValidationSchema] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const dialogToggleContext: any = useContext(DialogToggleContext);
  const { formLayout } = useFormData(currentItem);
  // const validationSchema = Yup.object().shape({
  //   Title: Yup.string().required("Project Name is required"),
  //   Branch: Yup.string().required("Project Name is required"),
  // });

  useEffect(() => {
    setIntitialValues(() => {
      if (currentItem) {
        // let initialValues: any = { ID: currentItem.ID };
        // Object.keys(currentItem).forEach((currentItemKey) => {
        //   Object.keys(formLayout).forEach((formLayoutKey) => {
        //     console.log("formLayout[formLayoutKey] :>> ", formLayout[formLayoutKey]);
        //     console.log("currentItem[currentItemKey] :>> ", currentItem[currentItemKey]);
        //     if (formLayout[formLayoutKey].i === currentItemKey) {
        //       initialValues[currentItemKey] = currentItem[currentItemKey];
        //     }
        //   });
        // });
        // return Object.keys(initialValues).length > 1 ? initialValues : undefined;
        return currentItem;
      } else {
        let tempInitialValues: any = {};

        for (let i = 0; i < formLayout.length; i++) {
          if (formLayout[i].internalName === "StartDate" || formLayout[i].internalName === "FinishDate") {
            tempInitialValues[formLayout[i].internalName] = null;
          } else {
            tempInitialValues[formLayout[i].internalName] = "";
          }
        }
        return tempInitialValues; //!make less static
      }
    });
    setValidationSchema(() => {
      let tempSchema: any = {};
      // formLayout.map((field: any) => {
      //   if (field.Required) tempSchema[field.internalName] = Yup.string().required(field.internalName + " is required");
      // });
      for (let i = 0; i < formLayout.length; i++) {
        if (formLayout[i].required) tempSchema[formLayout[i].internalName] = Yup.string().required(formLayout[i].title + " is required");
      }
      let schema = Yup.object().shape(tempSchema);
      return schema;
    });
  }, [formLayout]);

  useEffect(() => {
    if (formType === "New") {
      if (Object.keys(initialValues).length > 0) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [initialValues, formLayout]);

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
    console.log("formValues :>> ", formValues);
    console.log("filesToUpload :>> ", filesToUpload);
    console.log("formType :>> ", formType);
    if (formType === "New") {
      console.log("NEW ");
      // //!add back after testing Date of note: 12-03-2020
      try {
        const CreateListItemResponse: any = await CreateListItem(formValues, "Submitted Projects", initialValues, scoreContext.scoreState);
        if (filesToUpload.length > 0) {
          await HandleAttachments("Submitted Projects", CreateListItemResponse.data.d, filesToUpload);
        }
      } catch (error) {
        console.log("error :>> ", error);
      }
    } else {
      try {
        const UpdateListItemResponse = await UpdateListItem("Submitted Projects", formValues.ID, formValues, initialValues, scoreContext.scoreState);

        if (filesToUpload.length > 0) {
          await HandleAttachments("Submitted Projects", currentItem, filesToUpload);
        }
      } catch (error) {}
    }
    window.location.reload();

    //@ts-ignore
    // dialogToggleContext.close();
    // setSubmitting(false);
    // refreshDataContext.handleRefresh();
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
  useEffect(() => {}, [filesToUpload]);
  return (
    <>
      {isLoading ? (
        <div style={{ position: "absolute", left: "50%", top: "50%" }}>
          <CircularProgress />
        </div>
      ) : validationSchema !== undefined ? (
        <Formik initialValues={initialValues} onSubmit={handleFormSubmit} validationSchema={validationSchema}>
          {({ isValid, dirty, isSubmitting, validateForm }) => (
            <Form>
              {isSubmitting ? (
                <ProgressIndicator />
              ) : (
                <>
                  <Grid container spacing={2}>
                    {generateDOM()}
                    {formType === "Edit" ? (
                      currentItem === undefined ? (
                        <AttachmentViewer attachments={currentItem.AttachmentFiles.results} currentItemId={currentItem.Id} />
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}

                    <Dropzone onChangeStatus={handleChangeStatus} />
                  </Grid>
                  <br />
                  <br />

                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <Button
                        type="button"
                        onClick={() => {
                          window.location.reload();
                          // @ts-ignore
                          // dialogToggleContext.close();
                          // refreshDataContext.handleRefresh();
                        }}
                        variant="contained"
                        color="secondary"
                        fullWidth
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={3}></Grid>

                    <Grid item xs={3}>
                      <Button disabled={isSubmitting} type="submit" variant="contained" color="primary" fullWidth>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
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
};

export default InputFormContent;
