import axios from "axios";

export function GetUserId(accountName: string) {
  //@ts-ignore
  let _spPageContextInfo = window._spPageContextInfo;
  let APIurl = "";
  if (_spPageContextInfo !== undefined) {
    //@ts-ignore
    APIurl = _spPageContextInfo.webAbsoluteUrl;
  } else {
    APIurl = "http://localhost:8081";
  }
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: APIurl + "/_api/web/siteusers(@v)?@v='" + encodeURIComponent(accountName) + "'",
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
        console.log("error", error);
        reject(error);
      });
  });
}

export default GetUserId;
// listColumns.data.d.results[i].FieldTypeKind
