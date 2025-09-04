import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridSortModel,
  GridColDef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { observer } from 'mobx-react';
import { Grid, IconButton, InputAdornment, Paper, TextField, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from './Button';
import { useTranslation } from 'react-i18next';
import CustomTextField from './TextField';
import { useState } from 'react';
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from './useDebounse';


type GridProps = {
  columns: GridColDef[];
  data: any;
  onDeleteClicked?: (id) => void;
  title?: string;
  showCount?: boolean;
  tableName: string;
  page: number;
  pageSize: number;
  totalCount: number;
  searchText: string;
  changeSort: (sortModel: GridSortModel) => void;
  changePagination: (page: number, pageSize: number) => void;
  onChangeTextField?: (searchText: string) => void; // не передавать если не нет поиска
  customHeader?: React.ReactNode;
  hideActions?: boolean;
  hideAddButton?: boolean;
  getRowHeight?: any;
}

const PageGridPagination = observer((props: GridProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation();
  const translate = t;

  const [searchText, setSearchText] = useState(props.searchText)


  const actions: GridColDef[] = [{
    field: 'actions',
    type: 'actions',
    headerName: translate('actions'),
    width: 150,
    cellClassName: 'actions',
    getActions: ({ id }) => {

      const actionItems = [
        <GridActionsCellItem
          icon={<Tooltip title={translate('edit')}><EditIcon /></Tooltip>}
          label={translate('Actions')}
          className="textPrimary"
          data-testid={`${props.tableName}EditButton`}
          onClick={() => navigate(`/user/${props.tableName}/addedit?id=${id}`)}
          color="inherit"
        />
      ];
      if(props.onDeleteClicked){
        actionItems.push(
          <GridActionsCellItem
            icon={<Tooltip title={translate('delete')}><DeleteIcon /></Tooltip>}
            label={translate('Actions')}
            data-testid={`${props.tableName}DeleteButton`}
            onClick={() => props.onDeleteClicked(id)}
            color="inherit"
          />
        )
      }
      return actionItems;
    },
  }]

  let res = props.columns
  if (!props.hideActions) {
    res = actions.concat(props.columns)
  }

  return (
    <Paper elevation={5} style={{ width: '100%', padding: 20, marginBottom: 30 }}>
      {props.customHeader ? props.customHeader : <><h1 data-testid={`${props.tableName}HeaderTitle`}>{props.title}</h1>
      {props.showCount && <h4 data-testid={`${props.tableName}itemCount`}>{ translate('foundTotal') +":"+props.totalCount}</h4>}

        <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ mb: 1 }}>
          {!props.hideAddButton && <CustomButton
            variant='contained'
            sx={{ m: 1 }}
            id={`${props.tableName}AddButton`}
            onClick={() => navigate(`/user/${props.tableName}/addedit?id=0`)}
            endIcon={<AddIcon />}
          >
            {translate('add')}
          </CustomButton>}
          {props.onChangeTextField && <CustomTextField
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            name={"textFieldSearc"}
            label={translate("search")}
            onKeyDown={(e) => e.keyCode === 13 && props.onChangeTextField(searchText)}
            // onBlur={(e) => props.onChangeTextField(searchText)}
            id={"fds"}
            noFullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    id="EmployeeList_Search_Btn"
                    onClick={() => props.onChangeTextField(searchText)}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />}
        </Grid>
      </>}

      <DataGrid
        rows={props.data}
        columns={res}
        pageSizeOptions={[10, 25, 100]}
        editMode="row"
        paginationMode="server"
        data-testid={`${props.tableName}Table`}
        sortingMode="server"
        disableColumnFilter
        rowCount={props.totalCount}
        initialState={{
          pagination: {
            paginationModel: { pageSize: props.pageSize, page: props.page },
          },
        }}
        slotProps={{
          pagination: {
            labelRowsPerPage: translate("rowsPerPage"),
          }
        }}
        onSortModelChange={(sortModel: GridSortModel) => props.changeSort(sortModel)}
        onPaginationModelChange={(model) => props.changePagination(model.page, model.pageSize)}
        rowSelection={false}
        getRowHeight={props.getRowHeight}
      />
    </Paper>
  );
})



export default PageGridPagination