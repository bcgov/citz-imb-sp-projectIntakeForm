import React, { FC, useState, useEffect, Fragment } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { GetListAndItems, FormDialog, ProgressIndicator } from "Components";
import { Icons } from "Components";
import { ListSubheader } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

interface TableProps {
  listName: string;
  tableTitle?: string;
  options?: Object;
  changeItemPermission?: boolean;
  actions?: any;
  icons?: any;
}

export const Table: FC<TableProps> = ({ listName, options, tableTitle, actions }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [components, setComponents] = useState();
  const [view, setView] = useState();
  const [sortColumns, setSortColumns] = useState();

  const populateTable = async () => {
    setIsLoading(true);

    const list: any = await GetListAndItems(listName);

    // console.log("list.columns :>> ", list.columns);

    const handleViewChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setView(event.target.value);
      for (let i = 0; i < list.views.length; i++) {
        if (event.target.value === list.viewColumns[i].viewTitle) {
          setColumns(list.viewColumns[i].fields);
          setSortColumns(list.views[i].sort);
        }
      }
    };

    if (tableTitle) {
      setTitle(tableTitle);
    } else {
      setTitle(list.title);
    }

    setColumns(list.columns);
    setData(list.items());

    setIsLoading(false);

    // console.log("listFromPopTable :>> ", list);
    // console.log("items", list.items);
    const x = {
      Toolbar: (props: any) => (
        <div>
          <Select id="demo-simple-select-outlined" value={view} onChange={handleViewChange} label="Views">
            {list.views.map((view: any) => {
              return <MenuItem value={view.title}>{view.title}</MenuItem>;
            })}
          </Select>
          <MTableToolbar {...props} />
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
      <MaterialTable
        // @ts-ignore
        columns={columns}
        data={data}
        title={title}
        options={options}
        actions={actions}
        isLoading={isLoading}
        components={components}
      />
    </>
  );
};

// import React, { FC, useState, useEffect, Fragment } from "react";
// import { useGetTableAll } from "../Hooks/useGetTableAll";
// import MaterialTable, { MTableToolbar } from "material-table";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";

// interface TableProps {
//   listName: string;
//   tableTitle?: string;
//   options?: Object;
//   changeItemPermission?: boolean;
//   actions?: any;
//   icons?: any;
// }
// export const Table: FC<TableProps> = ({ listName, options, tableTitle, actions }) => {
//   const [currentView, tableItems, handleChangeView, allViewsColumns] = useGetTableAll("Submitted Projects");
//   const [isLoading, setIsLoading] = useState(false);
//   const components = {
//     Toolbar: (props: any) => (
//       <div>
//         <Select id="demo-simple-select-outlined" value={currentView.viewName} onChange={handleChangeView} label="Views">
//           {allViewsColumns.map((view: any) => {
//             return <MenuItem value={view.viewName}>{view.viewName}</MenuItem>;
//           })}
//         </Select>
//         <MTableToolbar {...props} />
//       </div>
//     ),
//   };
//   console.log("tableItems :>> ", tableItems);
//   return (
//     <>
//       <MaterialTable
//         // @ts-ignore
//         columns={currentView.viewColumns}
//         data={tableItems}
//         title={"Submitted Projects"}
//         options={options}
//         actions={actions}
//         isLoading={isLoading}
//         components={components}
//       />
//     </>
//   );
// };
