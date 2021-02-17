import axios from "axios";
import { GetListMetadataType, GetUserId } from "Components";
export const UpdateListItem = async (
  listName: string,
  itemId: number,
  formValues: any,
  initialValues: any,
  score: any
) => {
  const getUserID = async (valueKey: any) => {
    let userID: any = await GetUserId(valueKey);
    return userID.data.d.Id;
  };

  //  set score for item
  formValues["ProjectScore_x002d_hidden"] = score;

  for (var key in formValues) {
    if (key !== "Id") {
      if (initialValues[key] === formValues[key]) {
        delete formValues[key];
        //@ts-ignore
      } else if (key === "ProjectLead" || key === "BusinessOwner") {
        console.log("formValues[key] :>> ", formValues[key]);
        formValues[key + "Id"] = formValues[key].EntityData?.SPUserID;
        delete formValues[key];
      }
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
  try {
    let __metadata: any = await GetListMetadataType(listName);
    return new Promise((resolve, reject) => {
      let URL =
        APIurl +
        "/_api/lists/getbytitle('" +
        listName +
        "')/getItemById(" +
        itemId +
        ")";
      //Append metadata type to data
      formValues.__metadata = { type: "SP.Data.SubmittedProjectsListItem" };
      let configAxios = {
        headers: {
          Accept: "application/json;odata=verbose",
          //@ts-ignore
          "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
          "X-HTTP-Method": "MERGE",
          "If-Match": "*",
          "Content-Type": "application/json;odata=verbose",
        },
      };
      axios
        .post(URL, formValues, configAxios)
        .then(function (req) {
          resolve(req);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export default UpdateListItem;
