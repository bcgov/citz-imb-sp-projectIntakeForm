import React from "react";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

interface DateTimeFormEditorProps {
  title?: string;
}

export const DateTimeFormEditor: React.FC<DateTimeFormEditorProps> = ({ title }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date("2014-08-18T21:11:54"));
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  //console.log("title :>> ", title);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        margin="normal"
        label={title}
        format="MM/dd/yyyy"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateTimeFormEditor;
