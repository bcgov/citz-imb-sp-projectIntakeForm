import React, { useState, useEffect, useContext, FC } from "react";
import { Formik, Form } from "formik";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useFormData, HandleAttachments, CreateListItem, DialogCloseContext, ProgressIndicator, ViewField, useCurrentItem } from "Components";
import * as Yup from "yup";

interface ViewFormContentProps {
  currentItem: any;
}

export const ViewFormContent: FC<ViewFormContentProps> = ({ currentItem }) => {
  console.log("currentItem :>> ", currentItem);
  const { formLayout } = useFormData();

  const handleDialogClose = useContext(DialogCloseContext);

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
      // Need to add item value to column Title.  These two values are seperate because one comes from the item call API and the other comes from the column settings call API
      for (let [key, value] of Object.entries(currentItem)) {
        if (key === field.title) {
          field.itemValue = value;
        }
      }

      return (
        <Grid item xs={field.w}>
          <ViewField label={field.title} name={field.internalName} toolTip={field.description} itemValue={field.itemValue} />
        </Grid>
      );
      return field;
    });

    return formFields;
  };

  return (
    <>
      {/* <ProgressIndicator /> */}

      <Grid container spacing={3}>
        {generateDOM()}
      </Grid>
      <br />
      <br />
      <Button
        type="button"
        onClick={() => {
          // @ts-ignore
          handleDialogClose();
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
