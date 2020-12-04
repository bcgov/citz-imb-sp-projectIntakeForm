import axios from "axios";
import { GetListMetadataType } from "Components";
export const UpdateListItem = async (listName: string, itemId: number, data: any) => {
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
      let URL = APIurl + "/_api/lists/getbytitle('" + listName + "')/getItemById(" + itemId + ")";
      //Append metadata type to data
      data.__metadata = { type: __metadata.data.d.results[0].__metadata.type };
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
