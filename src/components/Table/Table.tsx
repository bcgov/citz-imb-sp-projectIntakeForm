import React, { FC, useState, useEffect, Fragment } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { getListAndItems } from "Components";
import { Icons } from "Components";
import { ListSubheader } from "@material-ui/core";

interface TableProps {
  listName: string;
  tableTitle?: string;
  options?: Object;
  changeItemPermission?: boolean;
  customActions?: Array<Object>;
}

export const Table: FC<TableProps> = ({ listName, options, tableTitle }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [title, setTitle] = useState("");
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [components, setComponents] = useState();

  const populateTable = async () => {
    setIsLoading(true);

    const list = await getListAndItems(listName);

    if (tableTitle) {
      setTitle(tableTitle);
    } else {
      setTitle(list.title);
    }

    setColumns(list.columns);
    setData(list.items);

    setIsLoading(false);

    console.log("listFromPopTable :>> ", list);
    const x = {
      Toolbar: (props: any) => (
        <div>
          <MTableToolbar {...props} />
          {list.views.map((view: any) => {
            return view.title;
          })}
        </div>
      ),
    };
    //@ts-ignore
    setComponents(x);
  };

  useEffect(() => {
    populateTable();
    return () => {};
  }, []);

  return (
    <>
      <MaterialTable columns={columns} data={data} title={title} options={options} actions={actions} isLoading={isLoading} components={components} />
    </>
  );
};
