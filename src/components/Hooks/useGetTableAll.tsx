import React, { useEffect, useState } from "react";
import { GetList, GetListItems } from "citz-imb-sp-utilities";
import Moment from "react-moment";

export const useGetTableAll = (listName: any) => {
  const [allViewsColumns, setAllViewsColumns] = useState<any>([]);
  const [currentView, setCurrentView] = useState<any>([]);
  const [tableItems, setTableItems] = useState<any>([]);
  const [allTableColumns, setAllTableColumns] = useState<any>([]);

  const getList = async () => {
    const returnedList = await GetList({
      listName,
      expand: "DefaultView,DefaultView/ViewFields,Fields,Items,Views,Views/ViewFields,Forms",
    });
    const allTableColumnsViews: any = returnedList.Views.results.map((view: any) => {
      let tempViews: any = {};
      // tempViews["sortBy"] = view.DefaultView
      tempViews["viewName"] = view.Title;
      tempViews["defaultView"] = view.DefaultView;
      tempViews["viewColumns"] = view.ViewFields.Items.results.map((column: any) => {
        let viewQuery: any = [];
        let parser: any = new DOMParser().parseFromString(view.ViewQuery, "text/xml").getElementsByTagName("FieldRef");
        for (let i = 0; i < parser.length; i++) {
          viewQuery.push({ sortTitle: parser[i].getAttribute("Name"), ascending: parser[i].getAttribute("Ascending") });
        }
        let getSort = () => {
          if (viewQuery[0]) {
            if (viewQuery[0].sortTitle === column) {
              if (viewQuery[0].ascending === "FALSE") {
                return "asc";
              } else {
                return "desc";
              }
            } else {
              return null;
            }
          }
        };
        let tempColumn: any = {};
        tempColumn.title = column;
        tempColumn.field = column;
        tempColumn.defaultSort = getSort();
        return tempColumn;
      });

      return tempViews;
    });
    // add the sorting function to the veiw fields
    setAllTableColumns(returnedList.Fields.results);
    setAllViewsColumns(allTableColumnsViews);
    // setTableItems(returnedList.Items.results);
    return;
  };

  const getListItems = async () => {
    let userFieldNamesSelect: never[] = [];
    let userFieldNamesExpand = [];
    //@ts-ignore
    for (let i = 0; i < allTableColumns.length; i++) {
      // @ts-ignore
      if (
        !allTableColumns[i].StaticName.startsWith("_") &&
        allTableColumns[i].StaticName !== "HTML_x0020_File_x0020_Type" &&
        // allTableColumns[i].StaticName !== "Editor" &&
        // allTableColumns[i].StaticName !== "Author" &&
        allTableColumns[i].StaticName !== "Edit" &&
        allTableColumns[i].StaticName !== "ProgId" &&
        allTableColumns[i].StaticName !== "SyncClientId" &&
        allTableColumns[i].StaticName !== "MetaInfo" &&
        allTableColumns[i].StaticName !== "Restricted" &&
        allTableColumns[i].StaticName !== "ContentVersion" &&
        allTableColumns[i].StaticName !== "AppAuthor" &&
        allTableColumns[i].StaticName !== "AppEditor" &&
        // allTableColumns[i].StaticName !== "ProjectManager" &&
        // allTableColumns[i].StaticName !== "BusinessLead" &&
        // allTableColumns[i].StaticName !== "ExecutiveSponsor" &&
        allTableColumns[i].StaticName !== "SortBehavior" &&
        allTableColumns[i].StaticName !== "ScopeId" &&
        allTableColumns[i].StaticName !== "ItemChildCount" &&
        allTableColumns[i].StaticName !== "FolderChildCount"
      ) {
        //@ts-ignore
        userFieldNamesSelect.push(allTableColumns[i].StaticName);
      }
    }
    //@ts-ignore
    for (let i = 0; i < allTableColumns.length; i++) {
      //@ts-ignore
      if (allTableColumns[i].FieldTypeKind === 20) {
        //@ts-ignore
        userFieldNamesSelect.push(allTableColumns[i].StaticName + "/Title");
        //@ts-ignore
        userFieldNamesExpand.push(allTableColumns[i].StaticName);
      }
    }

    let items = await GetListItems({
      listName: listName,
      expand: userFieldNamesExpand,
      select: userFieldNamesSelect,
    });

    let formattedItems = () => {
      let itemsFormatted: any = [];
      for (let i = 0; i < items.length; i++) {
        let itemFormatted: any = {};
        for (const [key, value] of Object.entries(items[i])) {
          //@ts-ignore
          if (value != null) {
            //@ts-ignore
            if (value.Title) {
              //@ts-ignore
              itemFormatted[key] = value.Title;
            } else {
              itemFormatted[key] = value;
            }
          }
        }
        itemsFormatted.push(itemFormatted);
      }
      return itemsFormatted;
    };
    return formattedItems;
  };

  const handleChangeView = (event: any) => {
    setCurrentView(() => {
      for (let i = 0; i < allViewsColumns.length; i++) {
        if (allViewsColumns[i].viewName === event.target.value) {
          return allViewsColumns[i];
        }
      }
    });
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    for (let i = 0; i < allViewsColumns.length; i++) {
      if (allViewsColumns[i].defaultView) {
        setCurrentView(allViewsColumns[i]);
      }
    }
  }, [allViewsColumns]);

  useEffect(() => {
    getListItems();
  }, [allTableColumns]);

  return [currentView, tableItems, handleChangeView, allViewsColumns];
};
