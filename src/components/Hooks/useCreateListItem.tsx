import React from "react";
import axios from "axios";
import { GetUserId } from "Components";

export const useCreateListItem = (formValues: any, listName: any) => {
  let GetItemTypeForListName = (listName: any) => {
    return "SP.Data." + listName.charAt(0).toUpperCase() + listName.split(" ").join("").slice(1) + "ListItem";
  };
};

export default useCreateListItem;
//! In progress
