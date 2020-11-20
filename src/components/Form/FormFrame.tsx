import React, { FC, useState, useEffect, Fragment, useContext } from "react";
import { Formik, Form, Field } from "formik";
import { CreateFormContent, FormTypeContext, FormikPropsContext, FormEditor, ViewFormContent, CurrentItemContext } from "Components";
import Container from "@material-ui/core/Container";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import * as Yup from "yup";

export function FormFrame() {
  const [formState, setFormState] = useState("");
  const [initialValues, setInitialValues] = useState();
  const [onSubmit, setOnSubmit] = useState<Function>(() => {});
  const [validationSchema, setValidationSchema] = useState({});

  let formType = useContext(FormTypeContext);
  let formikProps: any = useContext(FormikPropsContext);
  let currentItem = useContext(CurrentItemContext);

  return (
    <>
      <Container maxWidth="lg">
        {formType === "New" ? (
          <CreateFormContent />
        ) : formType === "Edit" ? (
          <div>Edit</div>
        ) : formType === "View" ? (
          <ViewFormContent currentItem={currentItem} />
        ) : (
          ""
        )}
      </Container>
      {/* <FormEditor /> */}
    </>
  );
}

export default FormFrame;
