import axios from "axios";

export function DeleteListField(listName: string, fieldName: string) {
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
      method: "POST",
      url: APIurl + "/_api/web/lists/getbytitle('" + listName + "')/fields/getbytitle('" + fieldName + "')",
      headers: {
        Accept: "application/json;odata=verbose",
        //@ts-ignore
        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        "content-type": "application/json;odata=verbose",
        accept: "application/json;odata=verbose",
        "X-HTTP-Method": "DELETE",
        "IF-MATCH": "*",
      },
    }).then(function (listColumns: any) {
      resolve();
    });
  });
}

export default DeleteListField;
