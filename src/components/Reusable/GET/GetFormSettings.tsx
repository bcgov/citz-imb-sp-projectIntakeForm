// import { GetListFields } from "citz-imb-sp-utilities";

// const getList = async (listName: string) => {
//   let list = await GetListFields({
//     listName: listName,
//     expand: "DefaultView,DefaultView/ViewFields,Fields,Items,Views,Views/ViewFields,Forms&$filter=Hidden eq false and ReadOnlyField eq false",
//     // filter: "Hidden eq false and ReadOnlyField eq false",
//   });
//   console.log("list2 :>> ", list);
//   return list;
// };

// export const GetFormSettings = async (listName: string) => {
//   let list: any;
//   list = await getList(listName);
//   return list;
// };

// export default GetFormSettings;

// Invalid	Must not be used. The value = 0.
// Integer	Specifies that the field contains an integer value. The value = 1.
// Text	Specifies that the field contains a single line of text. The value = 2.
// Note	Specifies that the field contains multiple lines of text. The value = 3.
// DateTime	Specifies that the field contains a date and time value or a date-only value. The value = 4.
// Counter	Specifies that the field contains a monotonically increasing integer. The value = 5.
// Choice	Specifies that the field contains a single value from a set of specified values. The value = 6.
// Lookup	Specifies that the field is a lookup field. The value = 7.
// Boolean	Specifies that the field contains a Boolean value. The value = 8.
// Number	Specifies that the field contains a floating-point number value. The value = 9.
// Currency	Specifies that the field contains a currency value. The value = 10.
// URL	Specifies that the field contains a URI and an optional description of the URI. The value = 11.
// Computed	Specifies that the field is a computed field. The value = 12.
// Threading	Specifies that the field indicates the thread for a discussion item in a threaded view of a discussion board. The value = 13.
// Guid	Specifies that the field contains a GUID value. The value = 14.
// MultiChoice	Specifies that the field contains one or more values from a set of specified values. The value = 15.
// GridChoice	Specifies that the field contains rating scale values for a survey list. The value = 16.
// Calculated	Specifies that the field is a calculated field. The value = 17.
// File	Specifies that the field contains the leaf name of a document as a value. The value = 18.
// Attachments	Specifies that the field indicates whether the list item has attachments. The value = 19.
// User	Specifies that the field contains one or more users and groups as values. The value = 20.
// Recurrence	Specifies that the field indicates whether a meeting in a calendar list recurs. The value = 21.
// CrossProjectLink	Specifies that the field contains a link between projects in a Meeting Workspace site. The value = 22.
// ModStat	Specifies that the field indicates moderation status. The value = 23.
// Error	Specifies that the type of the field was set to an invalid value. The value = 24.
// ContentTypeId	Specifies that the field contains a content type identifier as a value. The value = 25.
// PageSeparator	Specifies that the field separates questions in a survey list onto multiple pages. The value = 26.
// ThreadIndex	Specifies that the field indicates the position of a discussion item in a threaded view of a discussion board. The value = 27.
// WorkflowStatus	Specifies that the field indicates the status of a workflow instance on a list item. The value = 28.
// AllDayEvent	Specifies that the field indicates whether a meeting in a calendar list is an all-day event. The value = 29.
// WorkflowEventType	Specifies that the field contains the most recent event in a workflow instance. The value = 30.
// Geolocation
// OutcomeChoice
// MaxItems	Must not be used. The value = 31.

import axios from "axios";

export function GetFormSettings(listName: string) {
  //@ts-ignore
  let _spPageContextInfo = window._spPageContextInfo;
  let APIurl = "";
  if (_spPageContextInfo !== undefined) {
    //@ts-ignore
    APIurl = _spPageContextInfo.webAbsoluteUrl;
  } else {
    APIurl = "http://localhost:8081";
  }
  console.log("APIurl", APIurl);

  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: APIurl + "/_api/web/lists/getbytitle('" + listName + "')/Items", //?$orderby=InternalName asc
      headers: {
        Accept: "application/json;odata=verbose",
        //@ts-ignore
        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        "content-type": "application/json;odata=verbose",
        accept: "application/json;odata=verbose",
      },
    }).then(function (listColumns) {
      let formFields = [];
      for (let i = 0; i < listColumns.data.d.results.length; i++) {
        formFields.push({
          // InternalName: listColumns.data.d.results[i].InternalName,
          // w: listColumns.data.d.results[i].w,
          // y: listColumns.data.d.results[i].y,
          // x: listColumns.data.d.results[i].x,
          Title: listColumns.data.d.results[i].Title,
          JSON: listColumns.data.d.results[i].JSON,
          itemID: listColumns.data.d.results[i].ID,
        });
      }
      //console.log("formFields :>> ", formFields);
      resolve(formFields);
    });
  });
}

export default GetFormSettings;
// listColumns.data.d.results[i].FieldTypeKind
