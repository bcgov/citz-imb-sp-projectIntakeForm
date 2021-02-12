import React, { useEffect, useReducer } from "react";

import logo from "./logo.svg";
import "./App.css";
import {
  Table,
  useDialogToggle,
  FormDialog,
  ProgressIndicator,
  useFormData,
  useCurrentItem,
} from "Components";
import { useState } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ListAltIcon from "@material-ui/icons/ListAlt";
import CreateIcon from "@material-ui/icons/Create";
import { MTableToolbar } from "material-table";

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
  console.log("dispatch triggered");
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
    styleSheet.setAttribute(
      "href",
      "https://fonts.googleapis.com/icon?family=Material+Icons"
    );
    document.getElementsByTagName("head")[0].appendChild(styleSheet);
  };
  const _filefy = require("filefy");

  useEffect(() => {
    GetPPScriptFiles();
  }, []);

  useEffect(() => {
    console.log("score :>> ", score);
  }, [score]);

  const [dialogStatus, handleDialogClose, handleDialogOpen] = useDialogToggle();
  // const { currentItem, setCurentItem } = useCurrentItem();
  const [currentItem, setCurrentItem] = useState();
  const [formType, setFormType] = useState("");
  const [formikProps, setFormikProps] = useState({
    initialValues: {
      projectName: "",
      projectID: "",
      objective: "",
      projectOwner: "",
    },
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

  //Production;
  //@ts-ignore
  // let _spPageContextInfo = window._spPageContextInfo;

  //Dev

  let _spPageContextInfo = {
    webPermMasks: { High: 1073742320, Low: 2097093631 },
  };

  return (
    <div className="App" style={{ width: "1732px" }}>
      {formType === "Submitting" ? (
        <ProgressIndicator />
      ) : (
        <RefreshDataContext.Provider
          value={{ handleRefresh: handleRefresh, refresh: refresh }}
        >
          <FormikPropsContext.Provider value={formikProps}>
            <FormTypeContext.Provider value={formType}>
              <HandleFormTypeContext.Provider value={handleFormType}>
                <ScoreContext.Provider
                  value={{ scoreState: score, scoreDispatch: dispatch }}
                >
                  <CurrentItemContext.Provider
                    value={{
                      currentItemValue: currentItem,
                      handleCurrentItem: setCurrentItem,
                    }}
                  >
                    <DialogToggleContext.Provider
                      value={{
                        close: handleDialogClose,
                        open: handleDialogOpen,
                      }}
                    >
                      {/* <DialogStatusContext.Provider value={dialogStatus}> */}
                      <Table
                        listName={"Submitted Projects"}
                        options={{
                          draggable: false,
                          sorting: true,
                          // exportButton: { csv: true, pdf: false },
                          // exportButton: { csv: true, pdf: false },
                          exportButton:
                            _spPageContextInfo.webPermMasks.High ===
                              1073742320 &&
                            _spPageContextInfo.webPermMasks.Low === 2097093631
                              ? { csv: true, pdf: false }
                              : { csv: false, pdf: false },

                          pageSize: 500,
                          maxBodyHeight: 800,
                          headerStyle: {
                            backgroundColor: "#212756",
                            color: "#FFF",
                          },
                          rowStyle: (
                            _data: any,
                            index: number,
                            _level: number
                          ) => {
                            return index % 2
                              ? { backgroundColor: "#ecf2f9" }
                              : {};
                          },
                          // exportAllData: true,
                        }}
                        actions={[
                          _spPageContextInfo.webPermMasks.High === 1073742320 &&
                          _spPageContextInfo.webPermMasks.Low === 2097093631
                            ? {
                                icon: () => (
                                  <AddCircleIcon
                                    style={{
                                      fill: "rgb(0 128 0 / 62%)",
                                      fontSize: "31px",
                                    }}
                                  />
                                ),
                                tooltip: "Add Project",
                                isFreeAction: true, //Allows you to add the button on it's own in the top right
                                onClick: () => {
                                  handleDialogOpen();
                                  handleFormType("New");
                                  handleFormikProps({
                                    initialValues: {
                                      projectName: "",
                                      projectID: "",
                                      objective: "",
                                      projectOwner: "",
                                    },
                                    onSubmit: "",
                                    validationSchema: "",
                                  });
                                },
                              }
                            : {
                                icon: () => (
                                  <AddCircleIcon
                                    style={{
                                      fill: "rgb(0 128 0 / 62%)",
                                      fontSize: "31px",
                                    }}
                                  />
                                ),
                                tooltip: "Add Project",
                                isFreeAction: true, //Allows you to add the button on it's own in the top right
                                onClick: () => {
                                  handleDialogOpen();
                                  handleFormType("New");
                                },
                                hidden: true,
                              },

                          (rowData: any) => ({
                            icon: () => (
                              <CreateIcon
                                style={{
                                  color: "white",
                                  fontSize: "19px",
                                  padding: "5px",
                                  borderRadius: "100px",
                                  background: "green",
                                }}
                              />
                            ),
                            tooltip: "Edit Project",
                            onClick: (event: any, rowData: any) => {
                              dispatch({
                                trigger: "initial",
                                initialValue: rowData.ProjectScore_x002d_hidden,
                              });
                              handleDialogOpen();
                              handleFormType("Edit");
                              setCurrentItem(rowData);
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
