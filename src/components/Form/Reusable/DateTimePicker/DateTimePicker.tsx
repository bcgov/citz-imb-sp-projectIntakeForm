import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";
import { Field, ErrorMessage } from "formik";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker } from "formik-material-ui-pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import { CustomToolTip } from "Components";

interface DatePickerProps {
  label: string;
  name: string;
  required?: boolean;
  toolTip?: string;
  editValue?: any;
}

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    display: "block",
  },
}))(Tooltip);

export const DateTimePicker: FC<DatePickerProps> = ({ label, name, required, toolTip, editValue = null }) => {
  return (
    <>
      <CustomToolTip toolTip={toolTip} />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Field
          clearable
          component={DatePicker}
          name={name}
          variant="dialog"
          inputVariant="outlined"
          placeholder="MM/DD/YYYY"
          format={"MM/dd/yyyy"}
          fullWidth={true}
          autoOk={true}
          label={label}
        />
      </MuiPickersUtilsProvider>
    </>
  );
};

export default DateTimePicker;
