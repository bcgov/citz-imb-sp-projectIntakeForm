import React, { FC } from "react";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import { Field, ErrorMessage } from "formik";
//@ts-ignore
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import { CustomToolTip } from "Components";

interface NumberColumnProps {
  label: string;
  name: string;
  toolTip?: string;
  type?: string;
  required?: boolean;
}

export const NumberColumn: FC<NumberColumnProps> = ({ label, name, toolTip, type, required }) => {
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
  return (
    <div>
      <CustomToolTip toolTip={toolTip} />

      <Field name={name} required={required}>
        {(fieldProps: any) => {
          const changeHandler = (event: any, value: any, reason: any) => {
            fieldProps.form.setFieldValue(name, value, false);
          };
          return (
            <CurrencyTextField
              inputVariant="outlined"
              name={name}
              label={label}
              variant="outlined"
              value={fieldProps.field.value}
              currencySymbol="$"
              fullWidth={true}
              outputFormat="string"
              onChange={changeHandler}
            />
          );
        }}
      </Field>
    </div>
  );
};

export default NumberColumn;
