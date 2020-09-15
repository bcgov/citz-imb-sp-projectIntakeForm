import { Form, Field } from "formik";
import React from "react";
import { GetFormFields } from "Components";

export const CreateFormContent = () => {
  GetFormFields("IntakeFormSettings");
  return <>{/* <Form>test</Form> */}</>;
};

export default CreateFormContent;
