import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Table, useDialogToggle, FormDialog } from "Components";
import { useState } from "react";

export const FormTypeContext = React.createContext("");

// @ts-ignore
export const FormikPropsContext = React.createContext();

export function App() {
  const [dialogStatus, handleDialogClose, handleDialogOpen] = useDialogToggle();
  const [formType, setFormType] = useState("");
  const [formikProps, setFormikProps] = useState({
    initialValues: { projectName: "", projectID: "", objective: "", projectOwner: "" },
    onSubmit: "",
    validationSchema: "",
  });

  const handleFormType = (formTypePassed: string) => {
    setFormType(formTypePassed);
  };

  const handleFormikProps = (FormikPropsPassed: any) => {
    setFormikProps(FormikPropsPassed);
  };

  return (
    <div className="App">
      <FormikPropsContext.Provider value={formikProps}>
        <FormTypeContext.Provider value={formType}>
          <Table
            listName={"Submitted Projects"}
            options={{
              sorting: true,
            }}
            actions={[
              {
                icon: "add",
                tooltip: "Add Project",
                isFreeAction: true, //Allows you to add the button on it's own in the top right
                onClick: () => {
                  handleDialogOpen();
                  handleFormType("New");
                  handleFormikProps({
                    initialValues: { projectName: "", projectID: "", objective: "", projectOwner: "" },
                    onSubmit: "",
                    validationSchema: "",
                  });
                },
              },
              (rowData: any) => ({
                icon: "edit",
                tooltip: "Edit Project",
                onClick: (event: any, rowData: any) => {
                  handleDialogOpen();
                  handleFormType("Edit");
                },
              }),
              (rowData: any) => ({
                icon: "list_alt",
                tooltip: "More Details",
                onClick: (event: any, rowData: any) => {
                  handleDialogOpen();
                  handleFormType("View");
                },
              }),
            ]}
          />
          <FormDialog dialogStatus={dialogStatus} />
        </FormTypeContext.Provider>
      </FormikPropsContext.Provider>
    </div>
  );
}

export default App;
