export const HandleAttachments = async (listName: any, listItem: any, filesToUpload: any) => {
  // console.log("filesToUpload :>> ", filesToUpload);
  //@ts-ignore
  let _spPageContextInfo = window._spPageContextInfo;
  let APIurl = "";
  if (_spPageContextInfo !== undefined) {
    //@ts-ignore
    APIurl = _spPageContextInfo.webAbsoluteUrl;
  } else {
    APIurl = "http://localhost:8081";
  }

  for (let i = 0; i < filesToUpload.length; i++) {
    await fetch(
      APIurl +
        "/_api/web/lists/getbytitle('" +
        listName +
        "')/items(" +
        listItem.data.d.ID +
        ")/AttachmentFiles/add(FileName='" +
        filesToUpload[i].name +
        "')",
      {
        method: "POST",
        headers: {
          accept: "application/json;odata=verbose",
          "content-type": "application/json;odata=verbose",
          "X-RequestDigest": (document.getElementById("__REQUESTDIGEST")! as HTMLTextAreaElement).value,
        },
        body: filesToUpload[i],
      }
    );
  }

  //upload the file
};
