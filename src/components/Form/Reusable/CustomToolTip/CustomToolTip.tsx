import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { withStyles, Theme } from "@material-ui/core/styles";
import React, { FC } from "react";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";

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

interface CustomToolTipProps {
  toolTip: any;
}

export const CustomToolTip: FC<CustomToolTipProps> = ({ toolTip }) => {
  return (
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
  );
};

export default CustomToolTip;
