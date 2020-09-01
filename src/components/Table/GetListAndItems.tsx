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

const getListItems = async (listName: string) => {
  let listItems = await GetListItems({
    listName: listName,
  });
  console.log("listItems :>> ", listItems);
  return listItems;
};

const getUserColumns = async (listName: string, list: Array<object>) => {
  let userFieldNamesSelect: never[] = [];
  let userFieldNamesExpand = [];
  //@ts-ignore
  for (let i = 0; i < list.Fields.results.length; i++) {
    // @ts-ignore
    if (
      // @ts-ignore
      list.Fields.results[i].FieldTypeKind === 2 &&
      // @ts-ignore
      list.Fields.results[i].StaticName !== "_UIVersionString" &&
      // @ts-ignore
      list.Fields.results[i].StaticName !== "_CopySource"
    ) {
      //@ts-ignore
      userFieldNamesSelect.push(list.Fields.results[i].StaticName);
    }
    //@ts-ignore
    console.log(
      "list.Fields.results[i].StaticName :>> ",
      //@ts-ignore
      list.Fields.results[i].StaticName,
      //@ts-ignore
      list.Fields.results[i].FieldTypeKind,
      //@ts-ignore
      list.Fields.results[i].TypeDisplayName,
      //@ts-ignore
      list.Fields.results[i].TypeAsString
    );
  }

  //@ts-ignore
  for (let i = 0; i < list.Fields.results.length; i++) {
    //@ts-ignore
    if (list.Fields.results[i].FieldTypeKind === 20) {
      //@ts-ignore
      console.log("list.Fields.results[i] :>> ", list.Fields.results[i]);
      //@ts-ignore
      userFieldNamesSelect.push(list.Fields.results[i].StaticName + "/Title");
      //@ts-ignore
      userFieldNamesExpand.push(list.Fields.results[i].StaticName);
    }
  }

  console.log(" userFieldNames :>> ", userFieldNamesSelect);

  let listUserColumns = await GetListItems({
    listName: listName,
    expand: userFieldNamesExpand,
    select: userFieldNamesSelect,
  });
  console.log("listItems :>> ", listUserColumns);
  return listUserColumns;
};

export const getListAndItems = async (listName: string) => {
  let title, columns, items, views, list, listUserColumns;
  list = await getList(listName);
  items = await getListItems(listName);
  listUserColumns = await getUserColumns(listName, list);
  views = list.Views.results.map((view: Object) => {
    //@ts-ignore
    return { title: view.Title, fields: view.ViewFields.Items.results };
  });
  console.log("views :>> ", views);
  title = list.Title;

  let listColumns = {};
  for (let i = 0; i < list.Fields.results.length; i++) {
    //@ts-ignore
    listColumns[list.Fields.results[i].InternalName] = {
      Title: list.Fields.results[i].Title,
      FieldTypeKind: list.Fields.results[i].FieldTypeKind,
    };
  }

  //Table Columns

  columns = list.DefaultView.ViewFields.Items.results.map((field: string) => {
    let fieldObject = {
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
    }

    if (field === "LinkTitle") {
      //@ts-ignore
      fieldObject.render = (rowdata) => {
        return <a href={rowdata.File.ServerRelativeUrl}>{rowdata.Title}</a>;
      };
    }
    return fieldObject;
  });

  return { title, columns, items, views };
};
