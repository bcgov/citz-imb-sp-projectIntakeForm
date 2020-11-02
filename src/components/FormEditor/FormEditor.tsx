import React, { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { getRender, CreateLayout, AddFieldForm, DeleteListField, UpdateListItem } from "Components";
import Typography from "@material-ui/core/Typography";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export const HandleRemoveGridItemContext = React.createContext((event: any) => {});

const ReactGridLayout = WidthProvider(RGL);

// export default class ErrorCaseLayout extends React.PureComponent {
export const FormEditor = () => {
  // console.log("test :>> ");
  const [fields, setFields] = useState<any>([]);
  const [layout, setLayout] = useState<{ i: string; x: number; y: number; w: number; h: number; TypeDisplayName: string }[]>([
    {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      i: "1",
      TypeDisplayName: "initial",
    },
  ]);

  const generateDOM = () => {
    let gridBlocks = fields.map((field: any) => {
      return (
        <div key={field.Title}>
          {" "}
          <button data-title={field.Title} data-id={field.index} onClick={handleRemoveField}>
            Delete
          </button>
          {field.render}
        </div>
      );
    });
    return gridBlocks;
  };
  const getFields = async () => {
    const fields = await CreateLayout();
    setFields(fields);
  };

  useEffect(() => {
    getFields();
  }, []);

  useEffect(() => {
    console.log("fields!!!!!!!!!!!!!!!!!!!!!! :>> ", fields);
    setLayout(() => {
      let newLayout = fields.map((field: any) => {
        // console.log("field", field);
        return { x: field.x, y: field.y, w: field.w, h: 1, i: field.Title, TypeDisplayName: field.Title };
      });
      return newLayout;
    });
  }, [fields]);

  useEffect(() => {
    //!ADD THIS BACK AFTER TESTING
    //@ts-ignore
    if (layout[0]) {
      if (layout[0].TypeDisplayName !== "initial") {
        try {
          UpdateListItem("IntakeForm Config", 1, layout);
        } catch (error) {
          console.log("error :>> ", error);
        }
      }
    }
  }, [layout]);
  // console.log("object layout :>> ", layout);

  const handleRemoveField = (event: any) => {
    if (window.confirm("Are you sure you want to delete " + event.target.getAttribute("data-title") + "?")) {
      DeleteListField("Submitted Projects", event.target.getAttribute("data-title"));

      setLayout(() => {
        let prevFields = layout;
        prevFields.splice(event.target.getAttribute("data-id"), 1);
        return prevFields;
      });
    } else {
      // They clicked no
    }
  };

  const handleAddField = (formValues: any) => {
    console.log("formValues :>> ", formValues);
    for (let i = 0; i < layout.length; i++) {
      if (layout[i].i === formValues.title) {
        alert("The field name" + formValues.title + "already exists on the form. Please pick a new name and try again.");
        return;
      }
    }

    // setLayout((prevValues: any) => {
    //   console.log("prevValue :>> ", prevValues);
    //   console.log("formvalues :>>!!!!!! ", formValues.title);
    //   return prevValues.concat({
    //     x: 0,
    //     y: Infinity,
    //     w: formValues.fieldWidth,
    //     h: 1,
    //     i: formValues.title,
    //     TypeDisplayName: formValues.title,
    //   });
    // });

    setFields((prevValues: any) => {
      return prevValues.concat({
        x: 0,
        y: prevValues.length,
        w: 2,
        InternalName: formValues.title,
        Title: formValues.title,
        TypeDisplayName: formValues.fieldType,
        render: getRender(formValues.title, formValues.fieldType, formValues.choices),
      });
    });
  };

  const handleOnLayoutChange = (layout: any) => {
    console.log("changeHappened :>> ");
    console.log("object layout :>> ", layout);

    //!ADD THIS BACK AFTER TESTING
    // if (layout[0]) {
    //   if (layout[0].TypeDisplayName !== "initial") {
    //     UpdateListItem("IntakeForm Config", 1, layout);
    //   }
    // }
  };

  const defaultProps = {
    className: "layout",
    rowHeight: 100,
    cols: 2,
    layout: layout,
    onLayoutChange: handleOnLayoutChange,
    isResizable: false,
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Add Field</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddFieldForm yPosition={fields.length} handleAddField={handleAddField} />
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
