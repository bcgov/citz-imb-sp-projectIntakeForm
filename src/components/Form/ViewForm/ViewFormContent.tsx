import React, { useState, useEffect, useContext, FC } from "react";
import { Formik, Form } from "formik";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useFormData, DialogToggleContext, ProgressIndicator, ViewField, AttachmentViewer, Section } from "Components";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import Moment from "react-moment";
import "./ViewFormContent.css";
import Typography from "@material-ui/core/Typography";

interface ViewFormContentProps {
  currentItem: any;
}

export const ViewFormContent: FC<ViewFormContentProps> = ({ currentItem }) => {
  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const { formLayout } = useFormData();
  const dialogToggle = useContext(DialogToggleContext);
  const generateDOM = () => {
    let orderByYaxis = formLayout.sort(function (a: any, b: any) {
      var textA = a.y;
      var textB = b.y;
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    let formFields = orderByYaxis.map((field: any) => {
      if (field.w === 1) {
        field.w = 6;
      } else if (field.w === 2) {
        field.w = 12;
      }
      // Need to add item value to column Title.  These two values are seperate because one comes from the item call API and the other comes from the column settings call API
      for (let [key, value] of Object.entries(currentItem)) {
        if (key === field.i) {
          field.itemValue = value;
        }
      }
      if (field.fieldType === "section") {
        return (
          <>
            <Section title={field.title} />
          </>
        );
      } else if (field.fieldType === "sectionDescription") {
        return (
          <div>
            <br />

            <Alert severity="info">{field.title}</Alert>
          </div>
        );
      } else if (field.fieldType === "StartDate" || field.fieldType === "FinishDate") {
        if (field.itemValue !== null) {
          return (
            <Grid item xs={field.w}>
              <ViewField
                label={field.title}
                name={field.internalName}
                toolTip={field.description}
                itemValue={<Moment format={"YYYY-MM-DD"}>{field.itemValue}</Moment>}
              />
            </Grid>
          );
        } else {
          return (
            <Grid item xs={field.w}>
              <ViewField label={field.title} name={field.internalName} toolTip={field.description} itemValue="" />
            </Grid>
          );
        }
      } else if (field.fieldType === "Choice") {
        return (
          <Grid item xs={field.w}>
            <ViewField label={field.title} name={field.internalName} toolTip={field.description} itemValue={field?.itemValue?.split("-")[0]} />
          </Grid>
        );
      } else {
        return (
          <Grid item xs={field.w}>
            <ViewField label={field.title} name={field.internalName} toolTip={field.description} itemValue={field.itemValue} />
          </Grid>
        );
      }

      // return field;
    });
    return formFields;
  };

  return (
    <>
      {/* <ProgressIndicator /> */}

      <Grid container spacing={3}>
        <Paper>
          <Typography variant="h6" gutterBottom>
            <b>Created:</b> <Moment format="YYYY-MM-DD">{currentItem.Created_x0020_Date}</Moment> <b>by:</b> {currentItem.Author}
          </Typography>
          <Typography variant="h6" gutterBottom>
            <b>Last Modified:</b> <Moment format="YYYY-MM-DD">{currentItem.Last_x0020_Modified}</Moment> <b>by:</b> {currentItem.Editor}
          </Typography>
        </Paper>
        {generateDOM()}
        <AttachmentViewer attachments={currentItem.AttachmentFiles.results} currentItemId={currentItem.Id} />
      </Grid>

      <br />
      <br />
      <Button
        type="button"
        onClick={() => {
          // @ts-ignore
          dialogToggle.close();
        }}
        variant="contained"
        color="secondary"
      >
        Close
      </Button>

      {/* <div style={{ position: "absolute", left: "50%", top: "50%" }}>
          <CircularProgress />
        </div> */}
    </>
  );
};

export default ViewFormContent;
