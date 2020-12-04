import React, { useEffect, useReducer } from "react";

import logo from "./logo.svg";
import "./App.css";
import { Table, useDialogToggle, FormDialog, ProgressIndicator, useFormData, useCurrentItem } from "Components";
import { useState } from "react";
export const FormTypeContext = React.createContext("");
// @ts-ignore
export const FormikPropsContext = React.createContext<any>();

export const DialogStatusContext = React.createContext("");
// @ts-ignore
export const DialogCloseContext = React.createContext<any>();

// @ts-ignore
export const CurrentItemContext = React.createContext<any>();
//@ts-ignore
export const ScoreContext = React.createContext<any>();

const initialScore = 0;
const reducer = (state: any, action: any) => {
  console.log("action :>> ", action);
  console.log("state :>> ", state);
  //action variable is a string at this point so you need to convert it to a number using unary plus operator "+"
  return state + action[0] - action[1];
};

export function App() {
  const [score, dispatch] = useReducer(reducer, initialScore);
  console.log("score :>> ", score);
  const GetPPScriptFiles: any = () => {
    const styleSheet = document.createElement("link");
    styleSheet.setAttribute("rel", "stylesheet");
    styleSheet.setAttribute("href", "https://fonts.googleapis.com/icon?family=Material+Icons");
    document.getElementsByTagName("head")[0].appendChild(styleSheet);
  };

  useEffect(() => {
    GetPPScriptFiles();
  }, []);

  const [dialogStatus, handleDialogClose, handleDialogOpen] = useDialogToggle();
  // const { currentItem, setCurentItem } = useCurrentItem();
  const [currentItem, setCurrentItem] = useState();
  const [formType, setFormType] = useState("");
  const [formikProps, setFormikProps] = useState({
    initialValues: { projectName: "", projectID: "", objective: "", projectOwner: "" },
    onSubmit: "",
    validationSchema: "",
  });

  const handleFormType = (formTypePassed: string) => {
    console.log("formType :>> ", formTypePassed);
    setFormType(formTypePassed); //!change to hook that handles the field type
    handleFieldType(formTypePassed); //!change to hook that handles the field type
  };

  const handleFormikProps = (FormikPropsPassed: any) => {
    setFormikProps(FormikPropsPassed);
  };

  const { handleFieldType } = useFormData(currentItem);
  return (
    <div className="App">
      {formType === "Submitting" ? (
        <ProgressIndicator />
      ) : (
        <FormikPropsContext.Provider value={formikProps}>
          <FormTypeContext.Provider value={formType}>
            {/* <DialogStatusContext.Provider value={dialogStatus}> */}
            <Table
              listName={"Submitted Projects"}
              options={{
                sorting: true,
                exportButton: true,
                pageSize: 15,
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
                    setCurrentItem(rowData);
                    console.log("rowData :>> ", rowData);
                  },
                }),
                (rowData: any) => ({
                  icon: "list_alt",
                  tooltip: "More Details",
                  onClick: (event: any, rowData: any) => {
                    handleDialogOpen();
                    handleFormType("View");
                    setCurrentItem(rowData);
                  },
                }),
              ]}
            />{" "}
            <ScoreContext.Provider value={{ scoreState: score, scoreDispatch: dispatch }}>
              <CurrentItemContext.Provider value={currentItem}>
                <DialogCloseContext.Provider value={handleDialogClose}>
                  <FormDialog dialogStatus={dialogStatus} />
                </DialogCloseContext.Provider>
              </CurrentItemContext.Provider>
            </ScoreContext.Provider>
            {/* </DialogStatusContext.Provider> */}
            {/* Remove when done testing only!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! <FormDialog dialogStatus={true} /> */}
          </FormTypeContext.Provider>
        </FormikPropsContext.Provider>
      )}
    </div>
  );
}

export default App;
