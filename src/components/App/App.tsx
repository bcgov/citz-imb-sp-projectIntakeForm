import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Table, useDialogToggle, useFormType, FormDialog } from "Components";

export function App() {
  const [dialogStatus, handleDialogClose, handleDialogOpen] = useDialogToggle();
  const [formType, handleFormType] = useFormType();

  return (
    <div className="App">
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
            },
          },
          (rowData: any) => ({
            icon: "edit",
            tooltip: "Edit Project",
            onClick: (event: any, rowData: any) => {},
          }),
          (rowData: any) => ({
            icon: "list_alt",
            tooltip: "More Details",
            onClick: (event: any, rowData: any) => {},
          }),
        ]}
      />
      <FormDialog dialogStatus={dialogStatus} />
    </div>
  );
}

export default App;
