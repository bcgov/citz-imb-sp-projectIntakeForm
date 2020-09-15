import React, { FC, useState, useEffect, Fragment } from "react";
import { Formik, Form, Field } from "formik";
import { CreateFormContent, useFormType } from "Components";

export function FormFrame() {
  const [formState, setFormState] = useState("");
  const [initialValues, setInitialValues] = useState();
  const [onSubmit, setOnSubmit] = useState<Function>(() => {});
  const [validationSchema, setValidationSchema] = useState({});

  const [formType, handleFormType] = useFormType();

  return (
    <>
      {/* <Formik initialValues={initialValues} onSubmit={()=>{}} validationSchema={validationSchema}>
        <CreateFormContent />
      </Formik> */}
      {formType === "New"} ? (
      <CreateFormContent />)
    </>
  );
}

export default FormFrame;
