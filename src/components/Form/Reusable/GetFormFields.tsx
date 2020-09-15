import { GetList, GetListItems } from "citz-imb-sp-utilities";

import React from "react";

const getList = async (listName: string) => {
  let list = await GetList({
    listName: listName,
    expand: "DefaultView,DefaultView/ViewFields,Fields,Items,Views,Views/ViewFields",
  });
  console.log("list2 :>> ", list);
  return list;
};

export const GetFormFields = async (listName: string) => {
  let list: any;
  list = await getList(listName);
  return list;
};

export default GetFormFields;
