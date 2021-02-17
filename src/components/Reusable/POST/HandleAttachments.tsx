export const HandleAttachments = async (
  listName: any,
  formValues: any,
  filesToUpload: any
) => {
  console.log("formValues3", formValues);
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
        "/_api/web/lists/getbytitle('Submitted Projects')/items(" +
        formValues.Id +
        ")/AttachmentFiles/add(FileName='" +
        filesToUpload[i].file.name +
        "')",
      {
        method: "POST",
        headers: {
          accept: "application/json;odata=verbose",
          "content-type": "application/json;odata=verbose",
          "X-RequestDigest": (document.getElementById(
            "__REQUESTDIGEST"
          )! as HTMLTextAreaElement).value,
        },
        body: filesToUpload[i].file,
      }
    );
  }

  //upload the file
};
