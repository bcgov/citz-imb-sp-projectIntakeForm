import React from "react";

import { GetList, GetListItems } from "citz-imb-sp-utilities";
import Moment from "react-moment";

const getList = async (listName: string) => {
  let list = await GetList({
    listName: listName,
    expand: "DefaultView,DefaultView/ViewFields,Fields,Items,Views,Views/ViewFields",
  });
  console.log("list :>> ", list);
  return list;
};

const getListItems = async (listName: string, list: any) => {
  let userFieldNamesSelect: never[] = [];
  let userFieldNamesExpand = [];
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

  let items = await GetListItems({
    listName: listName,
    expand: userFieldNamesExpand,
    select: userFieldNamesSelect,
  });
  // console.log("items :>> ", items);
  return items;
};

export const getListAndItems = async (listName: string) => {
  let title, columns, views, list: any, items, viewColumns;
  list = await getList(listName);
  items = await getListItems(listName, list);
  views = list.Views.results.map((view: Object) => {
    //@ts-ignore
    return { title: view.Title, fields: view.ViewFields.Items.results };
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
    // console.log("field :>> ", field);
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
        return (
          <Moment fromNowDuring={3600000} format={"dddd, MMMM Do, YYYY @ h:mm a"}>
            {rowdata[field]}
          </Moment>
        );
      };
    } else if (
      //@ts-ignore
      listColumns[field].FieldTypeKind === 3 //multilinetext
    ) {
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
        // console.log("rowdata", rowdata);
        return <div>{rowdata.ProjectManager.Title}</div>;
      };
    }

    if (field === "LinkTitle") {
      //@ts-ignore
      fieldObject.render = (rowdata) => {
        return <a href={rowdata.FileDirRef + "/" + rowdata.ProjectName}>{rowdata.Title}</a>;
      };
    }
    return fieldObject;
  });
  console.log("fieldObject :>> ", columns);

  let viewsObject: any = [];
  for (let i = 0; i < list.Views.results.length; i++) {
    viewsObject.push({
      viewTitle: list.Views.results[i].Title,
      fields: list.Views.results[i].ViewFields.Items.results.map((field: string) => {
        // console.log("field :>> ", field);
        let viewsObject: any = {
          //@ts-ignore
          title: listColumns[field].Title,
          field: field,
        };
        //@ts-ignore
        if (listColumns[field].FieldTypeKind === 4) {
          //datetime
          //@ts-ignore
          viewsObject.render = (rowdata) => {
            return (
              <Moment fromNowDuring={3600000} format={"dddd, MMMM Do, YYYY @ h:mm a"}>
                {rowdata[field]}
              </Moment>
            );
          };
        } else if (
          //@ts-ignore
          listColumns[field].FieldTypeKind === 3 //multilinetext
        ) {
          //@ts-ignore
          viewsObject.render = (rowdata) => {
            return (
              <div
                dangerouslySetInnerHTML={{
                  __html: rowdata[field],
                }}
              />
            );
          };
        } else if (listColumns[field].FieldTypeKind === 20) {
          viewsObject.render = (rowdata: any) => {
            // console.log("rowdata", rowdata);
            return <div>{rowdata.ProjectManager.Title}</div>;
          };
        }

        if (field === "LinkTitle") {
          //@ts-ignore
          viewsObject.render = (rowdata) => {
            return <a href={rowdata.FileDirRef + "/" + rowdata.ProjectName}>{rowdata.Title}</a>;
          };
        }
        return viewsObject;
      }),
    });
  }

  console.log("viewsObject :>> ", viewsObject);

  // viewColumns = list.Views.results.map((views: string) => {
  //   viewsObject.push({ title: list.Views.results.ViewFields.Items.results, field: list.Views.results.Title });
  //   console.log("viewsObject :>> ", viewsObject);
  // });

  return { title, columns, views, items, viewsObject };
};
