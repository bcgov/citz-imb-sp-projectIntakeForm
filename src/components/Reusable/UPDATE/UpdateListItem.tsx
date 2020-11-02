import axios from "axios";
import { GetListMetadataType } from "Components";
export const UpdateListItem = async (listName: string, itemId: number, FormLayout: any) => {
  //@ts-ignore
  let _spPageContextInfo = window._spPageContextInfo;
  let APIurl = "";
  if (_spPageContextInfo !== undefined) {
    //@ts-ignore
    APIurl = _spPageContextInfo.siteAbsoluteUrl;
  } else {
    APIurl = "http://localhost:8081";
  }
  try {
    let __metadata: any = await GetListMetadataType(listName);
    console.log("__metadata :>> ", __metadata.data.d.results[0].__metadata.type);
    console.log("JSON.stringify(FormLayout) :>> ", JSON.stringify(FormLayout));
    return new Promise((resolve, reject) => {
      console.log("object :>> ", __metadata.data.d.results[0].__metadata.type);
      let URL = APIurl + "/_api/lists/getbytitle('" + listName + "')/getItemById(" + itemId + ")";
      let data = { __metadata: { type: __metadata.data.d.results[0].__metadata.type }, JSON: JSON.stringify(FormLayout) };
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
        .post(URL, data, configAxios)
        .then(function (req) {
          resolve();
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
