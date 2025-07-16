import { FC, useEffect } from 'react';
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import EmployeePopupForm from './../EmployeeAddEditView/popupForm';
import CustomTextField from 'components/TextField';
import CustomButton from 'components/Button';
import ClearIcon from "@mui/icons-material/Clear";


type EmployeeListViewProps = {};


const EmployeeListView: FC<EmployeeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadEmployees()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'last_name',
      headerName: translate("label:EmployeeListView.last_name"),
      flex: 1
    },
    {
      field: 'first_name',
      headerName: translate("label:EmployeeListView.first_name"),
      flex: 1
    },
    {
      field: 'second_name',
      headerName: translate("label:EmployeeListView.second_name"),
      flex: 1
    },
    {
      field: 'pin',
      headerName: translate("label:EmployeeListView.pin"),
      flex: 1
    },
    {
      field: 'structure_name',
      headerName: translate("label:EmployeeListView.structure_name"),
      flex: 2,
    },
    {
      field: 'post_name',
      headerName: translate("label:EmployeeListView.post_name"),
      flex: 2
    },
    {
      field: 'user_id',
      headerName: translate("label:EmployeeListView.account"),
      flex: 1,
      renderCell: (params) => {
        return params.value ? "Создан" : "Не создан";
      }
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:EmployeeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteEmployee(id)}
        columns={columns}
        data={store.data}
        tableName="Employee" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:EmployeeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteEmployee(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="Employee" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ margin: 30 }}>
      <Box sx={{ maxWidth: 500, minWidth: 300, mb: 2, ml: 1 }} display={"flex"} alignItems={"center"}>

        <CustomTextField
          value={store.searchField}
          onChange={(e) => store.changeSearch(e.target.value)}
          label={translate("common:search")}
          onKeyDown={(e) => e.keyCode === 13 && store.onSearchClicked()}
          name="TaskSearchField"
          id="TaskSearchField"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  id="employee_clear_Btn"
                  onClick={() => store.clearSearch()}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <CustomButton sx={{ ml: 1 }} variant='contained' size="small" onClick={() => { store.onSearchClicked() }}>
          {translate("common:Find")} 
        </CustomButton>
      </Box>
      {component}


      <EmployeePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadEmployees()
        }}
      />

    </Container>
  );
})




export default EmployeeListView
