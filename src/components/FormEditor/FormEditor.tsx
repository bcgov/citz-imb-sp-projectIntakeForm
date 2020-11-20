import React, { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { getRender, CreateLayout, AddFieldForm, DeleteListField, UpdateListItem, useFormData } from "Components";
import Typography from "@material-ui/core/Typography";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import _ from "lodash";
import { usePeoplePickerFunctionality } from "components/Hooks/usePeoplePickerFunctionality";

export const HandleRemoveGridItemContext = React.createContext((event: any) => {});

const ReactGridLayout = WidthProvider(RGL);

// export default class ErrorCaseLayout extends React.PureComponent {
export const FormEditor = () => {
  const { formLayout, addField } = useFormData();
  //const [peoplePickerValues] = usePeoplePickerFunctionality();

  const generateDOM = () => {
    let gridBlocks = formLayout.map((field: any) => {
      return (
        <div key={field.i}>
          {" "}
          <button data-title={field.i} data-internalName={field.i} data-id={field.index} onClick={handleRemoveField}>
            Delete
          </button>
          {field.render}
        </div>
      );
    });
    return gridBlocks;
  };

  const handleRemoveField = (event: any) => {
    if (window.confirm("Are you sure you want to delete " + event.target.getAttribute("data-title") + "?")) {
      DeleteListField("Submitted Projects", event.target.getAttribute("data-internalName"));
    } else {
      // They clicked no
    }
  };

  const handleAddField = (formValues: any) => {
    console.log("formValues :>> ", formValues);
    addField(formValues.title);
  };

  const handleOnLayoutChange = (layout: any) => {
    console.log("changeHappened :>> ", layout);
    console.log("changeHappened layoutState :>> ", formLayout);
  };

  const defaultProps = {
    className: "layout",
    rowHeight: 100,
    cols: 2,
    layout: formLayout,
    isResizable: false,
    onLayoutChange: handleOnLayoutChange,
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Add Field</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddFieldForm handleAddField={handleAddField} />
        </AccordionDetails>
      </Accordion>
      <HandleRemoveGridItemContext.Provider value={handleRemoveField}>
        <ReactGridLayout compactType={"vertical"} {...defaultProps}>
          {generateDOM()}
        </ReactGridLayout>
      </HandleRemoveGridItemContext.Provider>
    </div>
  );
};
