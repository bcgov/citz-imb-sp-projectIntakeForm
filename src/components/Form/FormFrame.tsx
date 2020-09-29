import React, { FC, useState, useEffect, Fragment, useContext } from "react";
import { Formik, Form, Field } from "formik";
import { CreateFormContent, FormTypeContext, FormikPropsContext } from "Components";
import Container from "@material-ui/core/Container";

import * as Yup from "yup";

export function FormFrame() {
  const [formState, setFormState] = useState("");
  const [initialValues, setInitialValues] = useState();
  const [onSubmit, setOnSubmit] = useState<Function>(() => {});
  const [validationSchema, setValidationSchema] = useState({});

  let formType = useContext(FormTypeContext);
  let formikProps: any = useContext(FormikPropsContext);
  return (
    <>
      <Container maxWidth="lg">{formType === "New" ? <CreateFormContent /> : formType === "Edit" ? <div>Edit</div> : <div>View</div>}</Container>
    </>
  );
}

export default FormFrame;
