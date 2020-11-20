import { useEffect, useState } from "react";

export const usePeoplePickerFunctionality = (peoplePickerDiv?: any) => {
  console.log("peoplePickerDiv :>> ", peoplePickerDiv);
  const [timeoutSeconds, settimeoutSeconds] = useState(1000); //<-- Development timeout is default(500 mili seconds)
  const [peoplePickerValues, setPeoplePickerValues] = useState([]);

  const GetPPScriptFiles: any = (filename: any) => {
    const scriptEle = document.createElement("script");
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("src", "/_layouts/15/" + filename);
    document.getElementsByTagName("head")[0].appendChild(scriptEle);
  };
  let schema = {
    PrincipalAccountType: "User,DL,SecGroup,SPGroup",
    SearchPrincipalSource: 15,
    ResolvePrincipalSource: 15,
    AllowMultipleValues: true,
    MaximumEntitySuggestions: 50,
    Width: "400px",
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
    // console.log("userArray", userArray);

    setPeoplePickerValues(() => {
      let tempPeoplePickerValue = peoplePickerValues;
      return tempPeoplePickerValue.concat(userArray);
    });
  });
  useEffect(() => {
    console.log("made it in 1:>> ");

    //  Put peoplePicker required JS files in header
    GetPPScriptFiles("clienttemplates.js");
    GetPPScriptFiles("clientforms.js");
    GetPPScriptFiles("clientpeoplepicker.js");
    GetPPScriptFiles("autofill.js");

    //@ts-ignore  //!test if SharePoint variable exists, if it does, its production
    let _spPageContextInfo = window._spPageContextInfo;

    //Equation to set the timeout in seconds based on environment(Development, Production)
    if (_spPageContextInfo !== undefined) {
      settimeoutSeconds(0);
    }

    //Timeout needed for development to work.  If this is production timeoutSeconds will equal 0

    //@ts-ignore
    ExecuteOrDelayUntilScriptLoaded(function () {
      console.log("made it in2 :>> ");
      setTimeout(function () {
        console.log("made it in3 :>> ");
        //@ts-ignore //!ignore for SharePoint loading purposes
        SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerDiv, null, schema);

        //Need to get observer value
        let el: any = document.querySelector(`#${peoplePickerDiv}_TopSpan_ResolvedList`);

        observer.observe(el, { childList: true });
      }, timeoutSeconds);
    }, "clientTemplates.js");

    return () => {
      observer.disconnect();
    };
  }, []);

  return [peoplePickerValues];
};
