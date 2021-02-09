import React from "react";

import { GetList, GetListItems } from "citz-imb-sp-utilities";
import Moment from "react-moment";
import moment from "moment";
import AttachFileIcon from "@material-ui/icons/AttachFile";
const getList = async (listName: string) => {
  try {
    let list = await GetList({
      listName: listName,
      expand: "DefaultView,DefaultView/ViewFields,Fields,Items,Views,Views/ViewFields,Forms",
      //@ts-ignore
      "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
    });
    //console.log("list :>> ", list);
    return list;
  } catch (error) {
    alert(error);
    return;
  }
};

const getListItems = async (listName: string, list: any) => {
  let userFieldNamesSelect: any[] = [];
  let userFieldNamesExpand: any = [];
  //@ts-ignore
  for (let i = 0; i < list.Fields.results.length; i++) {
    // @ts-ignore
    if (
      !list.Fields.results[i].StaticName.startsWith("_") &&
      list.Fields.results[i].StaticName !== "HTML_x0020_File_x0020_Type" &&
      list.Fields.results[i].StaticName !== "Editor" &&
      list.Fields.results[i].StaticName !== "Author" &&
      list.Fields.results[i].StaticName !== "Edit" &&
      list.Fields.results[i].StaticName !== "ProgId" &&
      list.Fields.results[i].StaticName !== "SyncClientId" &&
      list.Fields.results[i].StaticName !== "MetaInfo" &&
      list.Fields.results[i].StaticName !== "Restricted" &&
      list.Fields.results[i].StaticName !== "ContentVersion" &&
      list.Fields.results[i].StaticName !== "AppAuthor" &&
      list.Fields.results[i].StaticName !== "AppEditor" &&
      list.Fields.results[i].StaticName !== "ProjectManager" &&
      list.Fields.results[i].StaticName !== "BusinessLead" &&
      list.Fields.results[i].StaticName !== "ExecutiveSponsor" &&
      list.Fields.results[i].StaticName !== "SortBehavior" &&
      list.Fields.results[i].StaticName !== "ScopeId" &&
      list.Fields.results[i].StaticName !== "ItemChildCount" &&
      list.Fields.results[i].StaticName !== "FolderChildCount"
      // list.Fields.results[i].StaticName !== "Attachments"
    ) {
      //@ts-ignore
      userFieldNamesSelect.push(list.Fields.results[i].StaticName);
    }
  }

  //@ts-ignore
  for (let i = 0; i < list.Fields.results.length; i++) {
    //@ts-ignore
    if (list.Fields.results[i].FieldTypeKind === 20) {
      //@ts-ignore
      userFieldNamesSelect.push(list.Fields.results[i].StaticName + "/Title");
      //@ts-ignore
      userFieldNamesExpand.push(list.Fields.results[i].StaticName);
    }
  }
  //Needed for attachments
  userFieldNamesSelect.push("AttachmentFiles");
  userFieldNamesExpand.push("AttachmentFiles");

  let tempItems = await GetListItems({
    listName: listName,
    expand: userFieldNamesExpand,
    select: userFieldNamesSelect,
  });
  let formattedItems = () => {
    let itemsFormatted: any = [];
    for (let i = 0; i < tempItems.length; i++) {
      let itemFormatted: any = {};
      //@ts-ignore
      for (const [key, value] of Object.entries(tempItems[i])) {
        //@ts-ignore
        if (value != null) {
          //@ts-ignore
          if (value.Title) {
            //@ts-ignore
            itemFormatted[key] = value.Title;
            //@ts-ignore
          } else if (value.Title || value.__metadata || value.__deferred) {
            itemFormatted[key] = "";
          } else {
            if (key === "StartDate" || key === "FinishDate" || key === "Modified" || key === "Created_x0020_Date" || key === "Created") {
              //@ts-ignore
              itemFormatted[key] = moment(value).format("YYYY-MM-DD");
            } else {
              itemFormatted[key] = value;
            }
          }
        } else if (key === "StartDate" || key === "FinishDate") {
          itemFormatted[key] = null;
        }
      }
      itemsFormatted.push(itemFormatted);
    }
    return itemsFormatted;
  };
  return formattedItems;
};

// console.log("items :>> ", items);

export const GetListAndItems = async (listName: string, handleFormTypeContext: any, currentItemContext: any, dialogToggleContext: any) => {
  let title, columns, views, list: any, items, defaultViewName: any;
  list = await getList(listName);

  items = await getListItems(listName, list);
  views = list.Views.results.map((view: any) => {
    return { title: view.Title, fields: view.ViewFields.Items.results, sort: view.ViewQuery };
  });
  // console.log("views :>> ", views);
  title = list.Title;
  // returns the Fields Titles and Types
  let listColumns: any = {};
  for (let i = 0; i < list.Fields.results.length; i++) {
    //@ts-ignore
    listColumns[list.Fields.results[i].InternalName] = {
      Title: list.Fields.results[i].Title,
      FieldTypeKind: list.Fields.results[i].FieldTypeKind,
    };
  }
  // console.log("listColumns :>> ", listColumns);
  //Table Columns
  defaultViewName = list.DefaultView;
  columns = list.DefaultView.ViewFields.Items.results.map((field: string) => {
    // console.log("fieldwqw12qdqw :>> ", field);
    let fieldObject: any = {
      //@ts-ignore
      title: listColumns[field].Title,
      field: field,

      customSort: (a: any, b: any) => {
        if (a[field] < b[field]) {
          return -1;
        }
        if (a[field] > b[field]) {
          return 1;
        }
        return 0;
      },
    };
    //@ts-ignore
    if (listColumns[field].FieldTypeKind === 4) {
      //datetime
      //@ts-ignore
      fieldObject.render = (rowdata) => {
        return rowdata[field] === null ? undefined : <Moment format={"YYYY-MM-DD"}>{rowdata[field]}</Moment>;
      };
    } else if (
      //@ts-ignore
      listColumns[field].FieldTypeKind === 3 //multilinetext
    ) {
      fieldObject.sorting = false;
      //@ts-ignore
      fieldObject.render = (rowdata) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: rowdata[field],
            }}
          />
        );
      };
    } else if (listColumns[field].FieldTypeKind === 20) {
      fieldObject.render = (rowdata: any) => {
        {
          return <div>{rowdata[field]}</div>;
        }
      };
    } else if (listColumns[field].FieldTypeKind === 6) {
      fieldObject.render = (rowdata: any) => {
        {
          return <div>{rowdata[field]?.split("-")[0]}</div>;
        }
      };
    }

    if (field === "LinkTitle") {
      //@ts-ignore
      fieldObject.render = (rowdata) => {
        return (
          <a
            href="#"
            onClick={() => {
              dialogToggleContext.open();
              handleFormTypeContext("View");
              currentItemContext.handleCurrentItem(rowdata);
            }}
          >
            {rowdata.Title}
          </a>
        );
      };

      fieldObject.customSort = (a: any, b: any) => {
        if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
          return -1;
        }
        if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
          return 1;
        }
        return 0;
      };
    }

    if (field === "Attachments") {
      //@ts-ignore
      fieldObject.render = (rowdata) => {
        if (rowdata.Attachments === true) {
          return <AttachFileIcon />;
        }
      };
    }

    return fieldObject;
  });

  let viewColumns: any = [];
  for (let i = 0; i < list.Views.results.length; i++) {
    viewColumns.push({
      viewTitle: list.Views.results[i].Title,
      fields: list.Views.results[i].ViewFields.Items.results.map((field: string) => {
        // console.log("field :>> ", field);
        let viewColumns: any = {
          //@ts-ignore
          title: listColumns[field].Title,
          field: field,
          customSort: (a: any, b: any) => {
            if (a[field] < b[field]) {
              return -1;
            }
            if (a[field] > b[field]) {
              return 1;
            }
            return 0;
          },
        };
        //@ts-ignore
        if (listColumns[field].FieldTypeKind === 4) {
          //datetime
          //@ts-ignore
          viewColumns.render = (rowdata) => {
            return <Moment format={"YYYY-MM-DD"}>{rowdata[field]}</Moment>;
          };
        } else if (
          //@ts-ignore
          listColumns[field].FieldTypeKind === 3 //multilinetext
        ) {
          //@ts-ignore
          viewColumns.render = (rowdata) => {
            return (
              <div
                dangerouslySetInnerHTML={{
                  __html: rowdata[field],
                }}
              />
            );
          };
        } else if (listColumns[field].FieldTypeKind === 20) {
          viewColumns.render = (rowdata: any) => {
            {
              return <div>{rowdata[field]}</div>;
            }
          };
        } else if (listColumns[field].FieldTypeKind === 6) {
          viewColumns.render = (rowdata: any) => {
            {
              return <div>{rowdata[field]?.split("-")[0]}</div>;
            }
          };
        }

        if (field === "LinkTitle") {
          //@ts-ignore
          viewColumns.render = (rowdata) => {
            return (
              <a
                href="#"
                onClick={() => {
                  dialogToggleContext.open();
                  handleFormTypeContext("View");
                  currentItemContext.handleCurrentItem(rowdata);
                }}
              >
                {rowdata.Title}
              </a>
            );
          };

          viewColumns.customSort = (a: any, b: any) => {
            if (a.Title < b.Title) {
              return -1;
            }
            if (a.Title > b.Title) {
              return 1;
            }
            return 0;
          };
        }
        return viewColumns;
      }),
    });
  }
  // viewColumns = list.Views.results.map((views: string) => {
  //   viewColumns.push({ title: list.Views.results.ViewFields.Items.results, field: list.Views.results.Title });
  //   console.log("viewColumns :>> ", viewColumns);
  // });
  //!Beautify needed
  let viewSortBy: any[] = [];
  let parser: any = new DOMParser();
  let parsedXML = parser.parseFromString(list.Views.results[0].ViewQuery, "text/xml");
  let XMLTagName = parsedXML.getElementsByTagName("FieldRef");
  console.log("XMLTagName :>> ", XMLTagName);
  for (let k = 0; k < XMLTagName.length; k++) {
    viewSortBy.push({ sortTitle: XMLTagName[k].getAttribute("Name"), ascending: XMLTagName[k].getAttribute("Ascending") });
  }

  for (let i = 0; i < columns.length; i++) {
    if (columns[i].field === viewSortBy[0].sortTitle) {
      if (viewSortBy[0].ascending === null) {
        columns[i].defaultSort = "asc";
      } else {
        columns[i].defaultSort = "desc";
      }
    }
    // ! Table can't sort on multiple columns

    // if (columns[i].field === viewSortBy[1]?.sortTitle) {
    //   if (viewSortBy[1]?.ascending === null) {
    //     columns[i].defaultSort = "asc";
    //   } else {
    //     columns[i].defaultSort = "desc";
    //   }
    // }
  }
  //!Beautify needed
  for (let i = 0; i < viewColumns.length; i++) {
    for (let j = 0; j < viewColumns[i].fields.length; j++) {
      if (viewColumns[i].fields[j].field === viewSortBy[0]?.sortTitle) {
        console.log("viewSortBy[0]?.sortTitle :>> ", viewSortBy[0]?.sortTitle);
        if (viewSortBy[0]?.ascending === null) {
          viewColumns[i].fields[j].defaultSort = "asc";
        } else {
          viewColumns[i].fields[j].defaultSort = "desc";
        }
      }
      // ! Table can't sort on multiple columns
      // if (viewColumns[i].fields[j].field === viewSortBy[1]?.sortTitle) {
      //   if (viewSortBy[1].ascending === null) {
      //     viewColumns[i].fields[j].defaultSort = "asc";
      //   } else {
      //     viewColumns[i].fields[j].defaultSort = "desc";
      //   }
      // }
    }
  }

  console.log("viewColumns :>> ", viewColumns);
  console.log("viewSortBy :>> ", viewSortBy);

  return { title, columns, views, items, viewColumns, list, defaultViewName };
};
