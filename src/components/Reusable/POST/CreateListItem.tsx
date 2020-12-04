import axios from "axios";
import { GetUserId } from "Components";

export const CreateListItem = async (formValues: any, listName: any) => {
  let GetItemTypeForListName = (listName: any) => {
    return "SP.Data." + listName.charAt(0).toUpperCase() + listName.split(" ").join("").slice(1) + "ListItem";
  };

  const getUserID = async (valueKey: any) => {
    let userID: any = await GetUserId(valueKey);
    console.log("userID", userID);
    return userID.data.d.Id;
  };

  for (var key in formValues) {
    if (formValues[key] === null || formValues[key] === "" || formValues[key].length === 0) {
      delete formValues[key];
    }
    if (Array.isArray(formValues[key])) {
      formValues[key] = await getUserID(formValues[key][0].Key);
      console.log("formValues[key] ", formValues[key]);
    }
  }

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
    type: GetItemTypeForListName(listName),
  };
  console.log("formValues :>> ", formValues);

  // return new Promise((resolve, reject) => {
  //   axios({
  //     method: "POST",
  //     url: APIurl + "/_api/web/lists/GetByTitle('" + listName + "')/items",
  //     data: JSON.stringify(formValues),
  //     headers: {
  //       accept: "application/json;odata=verbose",
  //       "content-type": "application/json;odata=verbose",
  //       "X-RequestDigest": (document.getElementById("__REQUESTDIGEST")! as HTMLTextAreaElement).value,
  //     },
  //   })
  //     .then(function (listItem) {
  //       console.log("listItem :>> ", listItem);
  //       resolve(listItem);
  //     })
  //     .catch((error) => {
  //       console.groupCollapsed("Error Details");

  //       if (error.response) {
  //         // The request was made and the server responded with a status code

  //         // that falls out of the range of 2xx

  //         console.error(error.response.data);

  //         console.error(error.response.status);

  //         console.error(error.response.headers);
  //       } else if (error.request) {
  //         // The request was made but no response was received

  //         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of

  //         // http.ClientRequest in node.js

  //         console.error(error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error

  //         console.error("Error", error.message);
  //       }

  //       console.error(error.config);

  //       console.groupEnd();
  //       reject(error);
  //     });
  // });
};
