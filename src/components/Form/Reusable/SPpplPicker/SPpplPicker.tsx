import React, { FC, useEffect, useState } from "react";
import { InputLabel } from "@material-ui/core";
import { Field } from "formik";

//Create a default prop interface for, Type and isRequired(?)
interface SPpplPickerProps {
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
}

//Add the required JS files from SharePoint, needed for People Picker to render.
const GetPPScriptFiles: any = (filename: any) => {
  const scriptEle = document.createElement("script");
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("src", "/_layouts/15/" + filename);
  document.getElementsByTagName("head")[0].appendChild(scriptEle);
};

//People Picker Component
export const SPpplPicker: FC<SPpplPickerProps> = ({
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
    <div className="SPpplPicker">
      <InputLabel children={pLabel} />
      <div id={pDivId}></div>
      {/* <Field id={pDivId} name={pDivId} as={"div"} /> */}
    </div>
  );
};

export default SPpplPicker;
