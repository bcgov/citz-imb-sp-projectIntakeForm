import React from "react";

import { GetList, GetListItems } from "citz-imb-sp-utilities";
import Moment from "react-moment";
import AttachFileIcon from "@material-ui/icons/AttachFile";
const getList = async (listName: string) => {
  let list = await GetList({
    listName: listName,
    expand: "DefaultView,DefaultView/ViewFields,Fields,Items,Views,Views/ViewFields,Forms",
  });
  //console.log("list :>> ", list);
  return list;
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
  console.log("tempItems :>> ", tempItems);
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
            itemFormatted[key] = value;
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
// return items;

export const GetListAndItems = async (listName: string, handleFormTypeContext: any, currentItemContext: any, dialogToggleContext: any) => {
  let title, columns, views, list: any, items;
  list = await getList(listName);
  items = await getListItems(listName, list);
  views = list.Views.results.map((view: Object) => {
    //@ts-ignore
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
  columns = list.DefaultView.ViewFields.Items.results.map((field: string) => {
    // console.log("fieldwqw12qdqw :>> ", field);
    let fieldObject: any = {
      //@ts-ignore
      title: listColumns[field].Title,
      field: field,
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
        }

        if (field === "LinkTitle") {
          //@ts-ignore
          viewColumns.render = (rowdata) => {
            return <>{rowdata.Title}</>;
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
  for (let i = 0; i < XMLTagName.length; i++) {
    viewSortBy.push({ sortTitle: XMLTagName[i].getAttribute("Name"), ascending: XMLTagName[i].getAttribute("Ascending") });
  }
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].field === viewSortBy[0].sortTitle) {
      if (viewSortBy[0].ascending === null) {
        columns[i].defaultSort = "asc";
      } else {
        columns[i].defaultSort = "desc";
      }
    }
    if (columns[i].field === viewSortBy[1]?.sortTitle) {
      if (viewSortBy[1]?.ascending === null) {
        columns[i].defaultSort = "asc";
      } else {
        columns[i].defaultSort = "desc";
      }
    }
  }
  //!Beautify needed
  for (let i = 0; i < viewColumns.length; i++) {
    for (let j = 0; j < viewColumns[i].fields.length; j++) {
      if (viewColumns[i].fields[j].field === viewSortBy[0]?.sortTitle) {
        if (viewSortBy[1].ascending === null) {
          viewColumns[i].fields[j].defaultSort = "asc";
        } else {
          viewColumns[i].fields[j].defaultSort = "desc";
        }
      }
      if (viewColumns[i].fields[j].field === viewSortBy[1]?.sortTitle) {
        if (viewSortBy[1].ascending === null) {
          viewColumns[i].fields[j].defaultSort = "asc";
        } else {
          viewColumns[i].fields[j].defaultSort = "desc";
        }
      }
    }
  }
  // console.log("viewColumns :>> ", viewColumns);
  // console.log("XMLTagName :>> ", XMLTagName);
  // console.log("parsedXML :>> ", parsedXML);
  //console.log("viewSortBy :>> ", viewSortBy);
  //console.log("columns :>> ", columns);
  //Name Ascending
  // [1].getAttribute('category')

  return { title, columns, views, items, viewColumns };
};
