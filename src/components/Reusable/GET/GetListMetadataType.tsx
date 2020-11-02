import axios from "axios";

export function GetListMetadataType(listName: string) {
  //@ts-ignore
  let _spPageContextInfo = window._spPageContextInfo;
  let APIurl = "";
  if (_spPageContextInfo !== undefined) {
    //@ts-ignore
    APIurl = _spPageContextInfo.siteAbsoluteUrl;
  } else {
    APIurl = "http://localhost:8081";
  }
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: APIurl + "/_api/lists/getbytitle('" + listName + "')/items",
      headers: {
        //@ts-ignore
        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        "content-type": "application/json;odata=verbose",
        accept: "application/json;odata=verbose",
      },
    })
      .then((listData) => {
        resolve(listData);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default GetListMetadataType;
// listColumns.data.d.results[i].FieldTypeKind
