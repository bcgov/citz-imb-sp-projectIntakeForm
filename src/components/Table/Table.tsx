import React, { FC, useState, useEffect, useContext } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import {
  GetListAndItems,
  FormDialog,
  ProgressIndicator,
  RefreshDataContext,
  HandleFormTypeContext,
  CurrentItemContext,
  DialogToggleContext,
} from "Components";
import { Icons } from "Components";
import { ListSubheader, Typography } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import "./Table.css";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

interface TableProps {
  listName: string;
  tableTitle?: string;
  options?: Object;
  changeItemPermission?: boolean;
  actions?: any;
  icons?: any;
}
const useStyles = makeStyles((theme: any) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const Table: FC<TableProps> = ({ listName, options, tableTitle, actions }) => {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [components, setComponents] = useState();
  const [view, setView] = useState();
  const [sortColumns, setSortColumns] = useState();

  const refreshDataContext: any = useContext(RefreshDataContext);
  const handleFormTypeContext: any = useContext(HandleFormTypeContext);
  const currentItemContext: any = useContext(CurrentItemContext);
  const dialogToggleContext: any = useContext(DialogToggleContext);

  const populateTable = async () => {
    setIsLoading(true);

    const list: any = await GetListAndItems(listName, handleFormTypeContext, currentItemContext, dialogToggleContext);
    console.log("list :>> ", list);

    const handleViewChange = (event: React.ChangeEvent<{ value: any }>) => {
      setView(event.target.value);
      for (let i = 0; i < list.views.length; i++) {
        if (event.target.value === list.viewColumns[i]?.viewTitle) {
          setColumns(list.viewColumns[i]?.fields);
          // setSortColumns(list.views[i]?.sort);
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
          <MTableToolbar {...props} />
          <FormControl className={classes.formControl}>
            <InputLabel id="viewsDropDownLabel">Views</InputLabel>

            <Select labelId="viewsDropDownLabel" defaultValue={list.defaultViewName.Title} value={view} onChange={handleViewChange} label="Views">
              {list.views.map((view: any) => {
                if (view?.title !== "RssView") return <MenuItem value={view?.title}>{view?.title}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </div>
      ),
    };
    //@ts-ignore
    setComponents(x);
  };

  useEffect(() => {
    populateTable();
  }, [refreshDataContext.refresh]);

  useEffect(() => {}, [isLoading]);
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
