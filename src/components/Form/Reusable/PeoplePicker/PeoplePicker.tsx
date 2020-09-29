import React, { FC, useEffect, useState } from "react";
import { InputLabel } from "@material-ui/core";
import { Field } from "formik";
import Grid from "@material-ui/core/Grid";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import { withStyles, Theme } from "@material-ui/core/styles";

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
  gridSize: any;
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

//Add the required JS files from SharePoint, needed for People Picker to render.
const GetPPScriptFiles: any = (filename: any) => {
  const scriptEle = document.createElement("script");
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("src", "/_layouts/15/" + filename);
  document.getElementsByTagName("head")[0].appendChild(scriptEle);
};

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
  gridSize,
  toolTip,
}) => {
  /*Set State*/
  const [timeoutSeconds, settimeoutSeconds] = useState(1000); //<-- Development timeout is default(500 mili seconds)

  /* Run on page load*/
  useEffect(() => {
    const schema: object = {
      PrincipalAccountType: pPrincipalAccountType,
      SearchPrincipalSource: pSearchPrincipalSource,
      ResolvePrincipalSource: pResolvePrincipalSource,
      AllowMultipleValues: pAllowMultipleValues,
      MaximumEntitySuggestions: pMaximumEntitySuggestions,
      Width: pWidth,
      titleText: "test",
      showtooltip: true,
    };

    const observer = new MutationObserver((mutations) => {
      let userArray: any = [];

      for (let i = 0; i < mutations[0].addedNodes.length; i++) {
        userArray.push({
          //@ts-ignore
          displayName: mutations[0].addedNodes[i].childNodes[1].title,
          //@ts-ignore
          account: mutations[0].addedNodes[i].attributes.sid.value,
        });
      }
      console.log("userArray", userArray);
      pGetUserInfo(userArray);
      ptestPerson(userArray.length);
    });

    GetPPScriptFiles("clienttemplates.js");
    GetPPScriptFiles("clientforms.js");
    GetPPScriptFiles("clientpeoplepicker.js");
    GetPPScriptFiles("autofill.js");

    //@ts-ignore  //!test if SharePoint variable exists, if it does, its production
    let _spPageContextInfo = window._spPageContextInfo;

    //Equation to set the timeout in seconds based on environment(Development, Production)
    if (_spPageContextInfo !== undefined) {
      settimeoutSeconds(0);
      console.log(timeoutSeconds, "0 = production");
    } else {
      console.log(timeoutSeconds, "1000 = Development");
    }

    //Timeout needed for development to work.  If this is production timeoutSeconds will equal 0
    //@ts-ignore
    ExecuteOrDelayUntilScriptLoaded(() => {
      setTimeout(function () {
        //@ts-ignore //!ignore for SharePoint loading purposes
        SPClientPeoplePicker_InitStandaloneControlWrapper(pDivId, null, schema);

        //Need to get observer value
        let el: any = document.querySelector(`#${pDivId}_TopSpan_ResolvedList`);

        observer.observe(el, { childList: true });
      }, timeoutSeconds);
    }, "clientTemplates.js");

    return () => {
      observer.disconnect();
    };
  }, []);

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
