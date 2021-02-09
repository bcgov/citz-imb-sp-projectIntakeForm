import axios from "axios";
import { GetUserId } from "Components";

export const CreateListItem = async (
  formValues: any,
  listName: any,
  initialValues: any,
  score: any
) => {
  console.log("madeit");
  for (var key in formValues) {
    if (initialValues[key] === formValues[key]) {
      delete formValues[key];
      //@ts-ignore
    } else if (key === "ProjectLead" || key === "BusinessOwner") {
      console.log("formValues[key] :>> ", formValues[key]);
      formValues[key + "Id"] = formValues[key].EntityData?.SPUserID;
      delete formValues[key];
    }
  }

  //Set score for item
  formValues["ProjectScore_x002d_hidden"] = score;

  //@ts-ignore
  let _spPageContextInfo = window._spPageContextInfo;
  let APIurl = "";
  if (_spPageContextInfo !== undefined) {
    //@ts-ignore
    APIurl = _spPageContextInfo.webAbsoluteUrl;
  } else {
    APIurl = "http://localhost:8081";
  }

  formValues.__metadata = {
    type: "SP.Data.SubmittedProjectsListItem",
  };

  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: APIurl + "/_api/web/lists/GetByTitle('" + listName + "')/items",
      data: JSON.stringify(formValues),
      headers: {
        accept: "application/json;odata=verbose",
        "content-type": "application/json;odata=verbose",
        "X-RequestDigest": (document.getElementById(
          "__REQUESTDIGEST"
        )! as HTMLTextAreaElement).value,
      },
    })
      .then(function (listItem) {
        console.log("liteItem!!!! :>> ", listItem);
        resolve(listItem);
      })
      .catch((error) => {
        console.groupCollapsed("Error Details");

        if (error.response) {
          // The request was made and the server responded with a status code

          // that falls out of the range of 2xx

          console.error(error.response.data);

          console.error(error.response.status);

          console.error(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received

          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of

          // http.ClientRequest in node.js

          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error

          console.error("Error", error.message);
        }

        console.error(error.config);

        console.groupEnd();
        reject(error);
      });
  });
};
