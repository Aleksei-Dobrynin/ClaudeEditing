import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react";
import { Paper, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../components/Button";
import store from "./store";

type GridProps = {
  columns: GridColDef[];
  data: any;
  onDeleteClicked?: (id) => void;
  onEditClicked?: (id, name) => void;
  title?: string;
  tableName: string;
  hideAddButton?: boolean;
  hideActions?: boolean;
  getRowHeight?: any;
  customBottom?: React.ReactNode;
}

const PageGridTelegram = observer((props: GridProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation();
  const translate = t;


  const actions: GridColDef[] = [{
    field: 'actions',
    type: 'actions',
    headerName: translate('actions'),
    width: 150,
    cellClassName: 'actions',
    getActions: ({ id }) => {

      return [
        <GridActionsCellItem
          icon={<Tooltip title={translate('edit')}><EditIcon /></Tooltip>}
          label={translate('Actions')}
          className="textPrimary"
          data-testid={`${props.tableName}EditButton`}
          onClick={() =>{
            props.onEditClicked(Number(id), props.tableName);
          }}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<Tooltip title={translate('delete')}><DeleteIcon /></Tooltip>}
          label={translate('Actions')}
          data-testid={`${props.tableName}DeleteButton`}
          onClick={() => props.onDeleteClicked(id)}
          color="inherit"
        />,
      ];
    },
  }]

  let res = props.columns
  if (!props.hideActions) {
    res = actions.concat(props.columns)
  }

  return (
    <Paper elevation={5} style={{ width: '100%', padding: 20, marginBottom: 30 }}>
      <h1 data-testid={`${props.tableName}HeaderTitle`}>{props.title}</h1>
      {!props.hideAddButton && <CustomButton
        variant='contained'
        sx={{ m: 1 }}
        id={`${props.tableName}AddButton`}
        onClick={() => store.onCreateClicked()}
        endIcon={<AddIcon />}
      >
        {translate('add')}
      </CustomButton>}
      <DataGrid
        rows={props.data}
        columns={res}
        data-testid={`${props.tableName}Table`}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        slotProps={{
          pagination: {
            labelRowsPerPage: translate("rowsPerPage"),
          }
        }}
        pageSizeOptions={[10, 25, 100]}
        editMode="row"
        rowSelection={false}
        getRowHeight={props.getRowHeight}
      />
      {props.customBottom}
    </Paper>
  );
})
export default PageGridTelegram