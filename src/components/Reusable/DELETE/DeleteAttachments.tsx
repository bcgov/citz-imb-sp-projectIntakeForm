export const DeleteAttachments = async (itemAttachmentName: any, itemId: any, listName: any) => {
  //@ts-ignore
  let _spPageContextInfo = window._spPageContextInfo;
  let APIurl = "";
  if (_spPageContextInfo !== undefined) {
    //@ts-ignore
    APIurl = _spPageContextInfo.webAbsoluteUrl;
  } else {
    APIurl = "http://localhost:8081";
  }

  await fetch(
    APIurl + "/_api/lists/getbytitle('" + listName + "')/GetItemById(" + itemId + ")/AttachmentFiles/getByFileName('" + itemAttachmentName + "')",
    {
      method: "DELETE",
      headers: {
        // accept: "application/json;odata=verbose",
        // "X-HTTP-Method": "DELETE",
        "X-RequestDigest": (document.getElementById("__REQUESTDIGEST")! as HTMLTextAreaElement).value,
      },
    }
  )
    .then(() => {
    })
    .catch((error: any) => {
      console.log(JSON.stringify(error));
    });
};
