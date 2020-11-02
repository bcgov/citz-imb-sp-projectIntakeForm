import { Formik, Form } from "formik";

import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Dropzone from "react-dropzone-uploader";
import {
  HandleAttachments,
  GetFormFields,
  MultiLineTextField,
  SingleLineTextField,
  DateTimePicker,
  GetFormSettings,
  DropDown,
  CreateListItem,
} from "Components";
import "react-dropzone-uploader/dist/styles.css";
import PublishIcon from "@material-ui/icons/Publish";
import Button from "@material-ui/core/Button";
import * as Yup from "yup";

export const CreateFormContent = () => {
  const [fields, setFields] = useState<any>([]);
  // const [formSettings, setFormSettings] = useState<any>([]);
  const [] = useState(false);
  const [initialValues, setIntitialValues] = useState<any>();
  const [validationSchema, setValidationSchema] = useState(Yup.object().shape({}));
  const [filesToUpload, setFilesToUpload] = useState<any>([]);

  const getFormFields = async () => {
    let returnedFields: any = await GetFormFields("Submitted Projects");
    let returnedSettings: any = await GetFormSettings("Intake Form Settings");
    let settings: any = {};
    for (let j = 0; j < returnedSettings.length; j++) {
      settings[returnedSettings[j].InternalName] = {
        InternalName: returnedSettings[j].Title,
        FieldWidth: returnedSettings[j].FieldWidth,
        VerticalPosition: returnedSettings[j].VerticalPosition,
        FieldType: returnedSettings[j].FieldType,
        Title: returnedSettings[j].Title,
      };
      if (returnedSettings[j].FieldType === "Section") {
        returnedFields.push(settings[returnedSettings[j].InternalName]);
      }
    }
    // console.log("settings :>> ", settings);

    for (let i = 0; i < returnedFields.length; i++) {
      // console.log("returnedFields[i] :>> ", returnedFields[i]);
      returnedFields[i].VerticalPosition = settings[returnedFields[i].InternalName].VerticalPosition;
      returnedFields[i].FieldWidth = settings[returnedFields[i].InternalName].FieldWidth;
      switch (returnedFields[i].FieldType) {
        case "Text":
          returnedFields[i].render = (
            <SingleLineTextField
              label={returnedFields[i].InternalName}
              name={returnedFields[i].InternalName}
              gridSize={returnedFields[i].FieldWidth}
              toolTip={returnedFields[i].Description}
              required={returnedFields[i].Required}
            />
          );
          if (!returnedFields[i].DefaultValue) {
            returnedFields[i].DefaultValue = "";
          }
          // console.log("returnedFields[i].DefaultValue :>> ", returnedFields[i].DefaultValue, returnedFields[i].InternalName);

          break;
        case "Note":
          returnedFields[i].render = (
            <MultiLineTextField
              label={returnedFields[i].InternalName}
              name={returnedFields[i].InternalName}
              gridSize={returnedFields[i].FieldWidth}
              toolTip={returnedFields[i].Description}
              required={returnedFields[i].Required}
            />
          );
          if (!returnedFields[i].DefaultValue) {
            returnedFields[i].DefaultValue = "";
          }
          // console.log("returnedFields[i].DefaultValue :>> ", returnedFields[i].DefaultValue, returnedFields[i].InternalName);

          break;
        case "DateTime":
          returnedFields[i].render = (
            <DateTimePicker
              label={returnedFields[i].InternalName}
              name={returnedFields[i].InternalName}
              gridSize={returnedFields[i].FieldWidth}
              toolTip={returnedFields[i].Description}
            />
          );
          if (!returnedFields[i].DefaultValue) {
            returnedFields[i].DefaultValue = null;
          }
          break;
        case "Choice":
          returnedFields[i].render = (
            <DropDown
              label={returnedFields[i].InternalName}
              name={returnedFields[i].InternalName}
              gridSize={returnedFields[i].FieldWidth}
              items={returnedFields[i].Choices}
              toolTip={returnedFields[i].Description}
              required={returnedFields[i].Required}
            />
          );
          if (!returnedFields[i].DefaultValue) {
            returnedFields[i].DefaultValue = "";
          }
          break;
        case "Section":
          returnedFields[i].render = <div>section</div>;
          break;

        default:
          returnedFields[i].render = "";
          break;
      }
    }

    returnedFields.sort((a: any, b: any) => {
      // Use toUpperCase() to ignore character casing
      const fieldA = a.VerticalPosition;
      const fieldB = b.VerticalPosition;

      let comparison = 0;
      if (fieldA > fieldB) {
        comparison = 1;
      } else if (fieldA < fieldB) {
        comparison = -1;
      }
      return comparison;
    });
    // console.log("returnedFields :>> ", returnedFields);

    setFields(returnedFields);

    setIntitialValues(() => {
      let initialValues: any = {};
      returnedFields.map((field: any) => {
        if (field.FieldType !== "Section") initialValues[field.InternalName] = field.DefaultValue;
      });
      return initialValues;
    });

    setValidationSchema(() => {
      let tempSchema: any = {};
      returnedFields.map((field: any) => {
        if (field.Required) tempSchema[field.InternalName] = Yup.string().required(field.InternalName + " is required");
      });

      let schema = Yup.object().shape(tempSchema);

      return schema;
    });

    // console.log("ValidationSchema :>> ", validationSchema);
  };

  useEffect(() => {
    getFormFields();
  }, []);

  GetFormFields("Submitted Projects");
  GetFormSettings("Intake Form Settings");

  const getUploadParams = () => {};

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

  return (
    <>
      {initialValues ? (
        <Formik
          initialValues={initialValues}
          onSubmit={async (formValues) => {
            try {
              const CreateListItemResponse = await CreateListItem(formValues, "Submitted Projects");
              const HandleAttachmentRepsonse = await HandleAttachments("Submitted Projects", CreateListItemResponse, filesToUpload);
            } catch (error) {
              console.log(error);
            }
          }}
          validationSchema={validationSchema}
        >
          {({ isValid, dirty, isSubmitting, validateForm }) => (
            <Form>
              <Grid container spacing={3}>
                {fields.map((field: any) => {
                  return field.render;
                })}
                <Dropzone onChangeStatus={handleChangeStatus} />
              </Grid>
              <br />
              <br />
              <Button disabled={!isValid || !dirty} type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button type="button" onClick={() => {}} variant="contained" color="secondary">
                Cancel
              </Button>
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

export default CreateFormContent;
// AllowMultipleValues: false
// Choices: []
// Description: ""
// FieldType: "User"
// Required: false
// Title: "ProjectManager"
// TypeDisplayName: "Person or Group"
