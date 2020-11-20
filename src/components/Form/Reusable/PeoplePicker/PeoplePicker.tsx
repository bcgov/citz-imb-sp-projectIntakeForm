import React, { FC, useEffect, useState } from "react";
import { InputLabel } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import { withStyles, Theme } from "@material-ui/core/styles";
import { usePeoplePickerFunctionality } from "Components";

//Create a default prop interface for, Type and isRequired(?)
interface PeoplePickerProps {
  pPrincipalAccountType?: string;
  pSearchPrincipalSource?: number;
  pResolvePrincipalSource?: number;
  pAllowMultipleValues?: boolean;
  pMaximumEntitySuggestions?: number;
  pWidth?: string;
  pDivId?: string;
  pLabel?: string;
  pGetUserInfo?: any;
  ptestPerson?: any;
  toolTip?: string;
  gridSize?: any;
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

//People Picker Component
export const PeoplePicker: FC<PeoplePickerProps> = ({
  pPrincipalAccountType = "User,DL,SecGroup,SPGroup",
  pSearchPrincipalSource = 15,
  pResolvePrincipalSource = 15,
  pAllowMultipleValues = false,
  pMaximumEntitySuggestions = 50,
  pWidth = "300px",
  pDivId = "",
  pLabel = "",
  pGetUserInfo,
  ptestPerson,
  gridSize = 12,
  toolTip,
}) => {
  const [peoplePickerValues] = usePeoplePickerFunctionality(pDivId);

  return (
    <Grid item xs={gridSize}>
      <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Tip</Typography>
            {toolTip}
          </React.Fragment>
        }
      >
        <InfoIcon />
      </HtmlTooltip>
      <div className="PeoplePicker">
        <InputLabel children={pLabel} />
        <div id={pDivId}></div>
        {/* <Field id={pDivId} name={pDivId} as={"div"} /> */}
      </div>
    </Grid>
  );
};

export default PeoplePicker;
