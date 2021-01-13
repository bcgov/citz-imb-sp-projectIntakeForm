import React, { FC } from "react";
import { CustomToolTip } from "Components";
import { Typography } from "@material-ui/core";
import "./ViewField.css";
interface ViewFieldProps {
  label: any;
  name: any;
  toolTip: any;
  itemValue: any;
}

export const ViewField: FC<ViewFieldProps> = ({ label, name, toolTip, itemValue }) => {
  return (
    <>
      <CustomToolTip toolTip={toolTip} />
      <Typography variant="h6">{label}</Typography>
      <Typography className={"viewField"} variant="body1">
        {itemValue}
      </Typography>
    </>
  );
};

export default ViewField;
