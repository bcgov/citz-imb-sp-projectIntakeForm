import React, { FC } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

interface SectionProps {
  title: any;
}

export const Section: FC<SectionProps> = ({ title }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">{title}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Section;
