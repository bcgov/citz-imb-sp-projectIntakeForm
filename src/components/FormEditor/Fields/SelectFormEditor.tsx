import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

interface SelectFormEditorProps {
  title: string;
  values: any;
}

export const SelectFormEditor: React.FC<SelectFormEditorProps> = ({ title, values }) => {
  const [dropDownValue, setDropDownValue] = React.useState("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDropDownValue(event.target.value as string);
  };
  return (
    <>
      <InputLabel>{title}</InputLabel>
      <Select value={dropDownValue} onChange={handleChange}>
        {values.map((dropDownValue: any) => (
          <MenuItem key={dropDownValue.value} value={dropDownValue.value}>
            {dropDownValue.value}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectFormEditor;
