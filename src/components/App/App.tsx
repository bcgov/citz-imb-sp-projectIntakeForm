import React, { useEffect, useReducer } from "react";

import logo from "./logo.svg";
import "./App.css";
import { Table, useDialogToggle, FormDialog, ProgressIndicator, useFormData, useCurrentItem } from "Components";
import { useState } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ListAltIcon from "@material-ui/icons/ListAlt";
import CreateIcon from "@material-ui/icons/Create";
import { MTableToolbar } from "material-table";

import { CsvBuilder } from "filefy";

export const FormTypeContext = React.createContext("");
// @ts-ignore
export const FormikPropsContext = React.createContext<any>();

export const DialogStatusContext = React.createContext("");
// @ts-ignore
export const DialogToggleContext = React.createContext<any>();

// @ts-ignore
export const CurrentItemContext = React.createContext<any>();
//@ts-ignore
export const ScoreContext = React.createContext<any>();
//@ts-ignore
export const RefreshDataContext = React.createContext<any>();
//@ts-ignore
export const HandleFormTypeContext = React.createContext<any>();

const reducer = (state: any, score: any) => {
  switch (score.trigger) {
    case "initial":
      return score.initialValue;
    default:
      return state + score.currentItemScore - score.previousItemScore;
  }

  //action variable is a string at this point so you need to convert it to a number using unary plus operator "+"
};

export function App() {
  const initialScore = 0;
  const [score, dispatch] = useReducer(reducer, initialScore);
  const [refresh, setRefresh] = useState(false);
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
    setFormType(formTypePassed); //!change to hook that handles the field type
    handleFieldType(formTypePassed); //!change to hook that handles the field type
  };

  const handleFormikProps = (FormikPropsPassed: any) => {
    setFormikProps(FormikPropsPassed);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const { handleFieldType } = useFormData(currentItem);

  return (
    <div className="App">
      {formType === "Submitting" ? (
        <ProgressIndicator />
      ) : (
        <RefreshDataContext.Provider value={{ handleRefresh: handleRefresh, refresh: refresh }}>
          <FormikPropsContext.Provider value={formikProps}>
            <FormTypeContext.Provider value={formType}>
              <HandleFormTypeContext.Provider value={handleFormType}>
                <ScoreContext.Provider value={{ scoreState: score, scoreDispatch: dispatch }}>
                  <CurrentItemContext.Provider value={{ currentItemValue: currentItem, handleCurrentItem: setCurrentItem }}>
                    <DialogToggleContext.Provider value={{ close: handleDialogClose, open: handleDialogOpen }}>
                      {/* <DialogStatusContext.Provider value={dialogStatus}> */}
                      <Table
                        listName={"Submitted Projects"}
                        options={{
                          sorting: true,
                          // exportButton: { csv: true, pdf: false },
                          exportButton: { csv: true, pdf: false },
                          pageSize: 500,
                          maxBodyHeight: 1080,
                          headerStyle: {
                            backgroundColor: "#212756",
                            color: "#FFF",
                          },
                          // exportAllData: true,
                        }}
                        actions={[
                          {
                            icon: () => <AddCircleIcon style={{ fill: "rgb(0 128 0 / 62%)", fontSize: "31px" }} />,
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
                            icon: () => (
                              <CreateIcon
                                style={{
                                  fill: "rgba(255,255,255)",
                                  fontSize: "31px",
                                  background: "rgb(21 168 40)",
                                  borderRadius: "39px",
                                  padding: "6px",
                                }}
                              />
                            ),
                            tooltip: "Edit Project",
                            onClick: (event: any, rowData: any) => {
                              dispatch({ trigger: "initial", initialValue: rowData.ProjectScore_x002d_hidden });
                              handleDialogOpen();
                              handleFormType("Edit");
                              setCurrentItem(rowData);
                              console.log("rowData :>> ", rowData);
                            },
                          }),
                          //!replaced with click link to view project
                          // (rowData: any) => ({
                          //   icon: () => (
                          //     <ListAltIcon
                          //       style={{
                          //         fill: "rgb(255,255,255)",
                          //         fontSize: "31px",
                          //         background: "rgb(113, 111, 111)",
                          //         borderRadius: "39px",
                          //         padding: "6px",
                          //       }}
                          //     />
                          //   ),
                          //   tooltip: "View Project",
                          //   onClick: (event: any, rowData: any) => {
                          //     dispatch({ trigger: "initial", initialValue: rowData.ProjectScore_x002d_hidden });
                          //     handleDialogOpen();
                          //     handleFormType("View");
                          //     setCurrentItem(rowData);
                          //     console.log("rowData :>> ", rowData);
                          //   },
                          // }),
                        ]}
                      />{" "}
                      <FormDialog dialogStatus={dialogStatus} />
                    </DialogToggleContext.Provider>
                  </CurrentItemContext.Provider>
                </ScoreContext.Provider>
              </HandleFormTypeContext.Provider>
              {/* </DialogStatusContext.Provider> */}
              {/* Remove when done testing only!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! <FormDialog dialogStatus={true} /> */}
            </FormTypeContext.Provider>
          </FormikPropsContext.Provider>
        </RefreshDataContext.Provider>
      )}
    </div>
  );
}

export default App;
