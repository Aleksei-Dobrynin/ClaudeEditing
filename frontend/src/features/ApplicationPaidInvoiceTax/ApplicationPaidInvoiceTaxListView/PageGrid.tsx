import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams  } from "@mui/x-data-grid";
import { observer } from "mobx-react";
import { Paper, Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/Button";
import { useTranslation } from "react-i18next";
import DateField from "../../../components/DateField";
import dayjs from "dayjs";
import store from "./store";

type GridProps = {
  columns: GridColDef[];
  data: any;
  onDeleteClicked?: (id) => void;
  title?: string;
  tableName: string;
  hideAddButton?: boolean;
  hideActions?: boolean;
  getRowHeight?: any;
};

const PageGrid = observer((props: GridProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translate = t;

  const actions: GridColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: translate("actions"),
      width: 150,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={
              <Tooltip title={translate("edit")}>
                <EditIcon />
              </Tooltip>
            }
            label={translate("Actions")}
            className="textPrimary"
            data-testid={`${props.tableName}EditButton`}
            onClick={() => navigate(`/user/${props.tableName}/addedit?id=${id}`)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
              <Tooltip title={translate("delete")}>
                <DeleteIcon />
              </Tooltip>
            }
            label={translate("Actions")}
            data-testid={`${props.tableName}DeleteButton`}
            onClick={() => props.onDeleteClicked(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  let res = props.columns;
  if (!props.hideActions) {
    res = actions.concat(props.columns);
  }

  return (
    <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 30 }}>
      <h1 data-testid={`${props.tableName}HeaderTitle`}>{props.title}</h1>

      <Box
        sx={{
          display: "flex",
          m: "30px 0 50px 0",
          justifyContent: "space-between",
          maxWidth: "500px",
          gap: "10px",
        }}
      >
        <Box sx={{ maxWidth: "200px" }}>
          <DateField
            id="startDate"
            name="startDate"
            value={dayjs(new Date(store.startDate))}
            label={translate('common:startDate')}
            helperText={store.errors.startDate}
            error={!!store.errors.startDate}
            onChange={(e) => store.handleChange(e)}
          />
        </Box>
        <Box sx={{ maxWidth: "200px" }}>
          <DateField
            id="endDate"
            name="endDate"
            value={dayjs(new Date(store.endDate))}
            label={translate('common:endDate')}
            helperText={store.errors.endDate}
            error={!!store.errors.endDate}
            onChange={(e) => store.handleChange(e)}
          />
        </Box>
        <CustomButton
          disabled ={ !store.startDate || !store.endDate || !!store.errors?.startDate  || !!store.errors?.endDate }
          variant="contained"
          sx={{ mb: 2 }}
          id={`${props.tableName}SearchButton`}
          onClick={() => store.searchHandler()}
          endIcon={<SearchIcon />}
        >
          {translate("search")}
        </CustomButton>
      </Box>
      {!props.hideAddButton && (
        <CustomButton
          variant="contained"
          sx={{ m: 1 }}
          id={`${props.tableName}AddButton`}
          onClick={() => navigate(`/user/${props.tableName}/addedit?id=0`)}
          endIcon={<AddIcon />}
        >
          {translate("add")}
        </CustomButton>
      )}
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
          },
        }}
        pageSizeOptions={[10, 25, 100]}
        editMode="row"
        rowSelection={false}
        getRowHeight={props.getRowHeight}
        getRowClassName={(params: GridRowParams) => {
          return params.row.id === 'defoultRow' ? 'highlighted-row' : '';
        }}
        sx={{
          '& .highlighted-row': {
            backgroundColor: '#e0f7fa',
            fontWeight: 'bold',
          },
        }}
      />
    </Paper>
  );
});

export default PageGrid;
