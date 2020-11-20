import axios from "axios";

export const CreateListFields = (columnType: any, listName: any, columnTitle: any, choices: any = "") => {
  console.log("choices :>> ", choices);
  //@ts-ignore
  let _spPageContextInfo = window._spPageContextInfo;
  let APIurl = "";
  if (_spPageContextInfo !== undefined) {
    //@ts-ignore
    APIurl = _spPageContextInfo.webAbsoluteUrl;
  } else {
    APIurl = "http://localhost:8081";
  }
  //console.log("columnType :>> ", columnType);
  let fieldTypeId: number;
  let fieldTypeName: string;

  if (columnType === "Choice") {
    fieldTypeId = 6;
    fieldTypeName = "Choice";
  }
  if (columnType === "Person or Group") {
    fieldTypeId = 20;
    fieldTypeName = "User";
  }
  if (columnType === "Single Line of Text") {
    fieldTypeId = 2;
    fieldTypeName = "Text";
  }
  if (columnType === "Multi Line of Text") {
    fieldTypeId = 3;
    fieldTypeName = "Note";
  }
  if (columnType === "Date & Time") {
    fieldTypeId = 4;
    fieldTypeName = "DateTime";
  }

  return new Promise((resolve, reject) => {
    let apiData: any = {
      __metadata: { type: "SP.Field" + fieldTypeName + "" },
      FieldTypeKind: fieldTypeId,
      Title: columnTitle,
    };
    if (choices() === [""]) {
      //console.log('choices() !== [""] :>> ', choices() !== [""]);
      //console.log("choices :>> ", choices());
      apiData.Choices = { results: choices() };
    }

    //console.log("apiData :>> ", apiData);

    axios({
      method: "POST",
      url: APIurl + "/_api/web/lists/getByTitle('" + listName + "')/fields",
      data: JSON.stringify(apiData),
      headers: {
        accept: "application/json;odata=verbose",
        "content-type": "application/json;odata=verbose",
        "X-RequestDigest": (document.getElementById("__REQUESTDIGEST")! as HTMLTextAreaElement).value,
      },
    })
      .then(function (CreateListFieldsResp) {
        resolve(CreateListFieldsResp);
      })
      .catch((error: any) => {
        console.groupCollapsed("Error Details");

        if (error.response) {
          // The request was made and the server responded with a status code

          // that falls out of the range of 2xx

          console.error(error.response.data);

          console.error(error.response.status);

          console.error(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received

          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of

          // http.ClientRequest in node.js

          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error

          console.error("Error", error.message);
        }

        console.error(error.config);

        console.groupEnd();
        reject(error);
      });
  });
};

/* 'FieldTypeKind' values and their description mentioned below. You can use these values in above method to create column using REST API
 
 
Invalid - Must not be used. The value = 0.
Integer - Specifies that the field contains an integer value. The value = 1.
Text - Specifies that the field contains a single line of text. The value = 2.
Note - Specifies that the field contains multiple lines of text. The value = 3.
DateTime - Specifies that the field contains a date and time value or a date-only value. The value = 4.
Counter - Specifies that the field contains a monotonically increasing integer. The value = 5.
Choice - Specifies that the field contains a single value from a set of specified values. The value = 6.
Lookup - Specifies that the field is a lookup field. The value = 7.
Boolean - Specifies that the field contains a Boolean value. The value = 8.
Number - Specifies that the field contains a floating-point number value. The value = 9.
Currency - Specifies that the field contains a currency value. The value = 10.
URL - Specifies that the field contains a URI and an optional description of the URI. The value = 11.
Computed - Specifies that the field is a computed field. The value = 12.
Threading - Specifies that the field indicates the thread for a discussion item in a threaded view of a discussion board. The value = 13.
Guid - Specifies that the field contains a GUID value. The value = 14.
MultiChoice - Specifies that the field contains one or more values from a set of specified values. The value = 15.
GridChoice - Specifies that the field contains rating scale values for a survey list. The value = 16.
Calculated - Specifies that the field is a calculated field. The value = 17.
File - Specifies that the field contains the leaf name of a document as a value. The value = 18.
Attachments - Specifies that the field indicates whether the list item has attachments. The value = 19.
User - Specifies that the field contains one or more users and groups as values. The value = 20.
Recurrence - Specifies that the field indicates whether a meeting in a calendar list recurs. The value = 21.
CrossProjectLink - Specifies that the field contains a link between projects in a Meeting Workspace site. The value = 22.
ModStat - Specifies that the field indicates moderation status. The value = 23.
Error - Specifies that the type of the field was set to an invalid value. The value = 24.
ContentTypeId - Specifies that the field contains a content type identifier as a value. The value = 25.
PageSeparator - Specifies that the field separates questions in a survey list onto multiple pages. The value = 26.
ThreadIndex - Specifies that the field indicates the position of a discussion item in a threaded view of a discussion board. The value = 27.
WorkflowStatus - Specifies that the field indicates the status of a workflow instance on a list item. The value = 28.
AllDayEvent - Specifies that the field indicates whether a meeting in a calendar list is an all-day event. The value = 29.
WorkflowEventType - Specifies that the field contains the most recent event in a workflow instance. The value = 30.
MaxItems - Must not be used. The value = 31.
 
*/
