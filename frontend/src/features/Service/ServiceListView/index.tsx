import React, { FC, useEffect } from 'react';
import {
  Box,
  Checkbox,
  Container, IconButton, InputAdornment
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import ServicePopupForm from './../ServiceAddEditView/popupForm';
import dayjs from "dayjs";
import CustomTextField from "../../../components/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import CustomButton from "../../../components/Button";

type ServiceListViewProps = {};


const ServiceListView: FC<ServiceListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadServices()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:ServiceListView.name"),
      flex: 1
    },
    {
      field: 'short_name',
      headerName: translate("label:ServiceListView.short_name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:ServiceListView.code"),
      flex: 1
    },
    {
      field: 'is_active',
      headerName: translate("label:ServiceListView.is_active"),
      flex: 1,
      renderCell: params => {
        return (
          <Checkbox checked={params.row.is_active} disabled />
        )
      }
    },
    {
      field: 'description',
      headerName: translate("label:ServiceListView.description"),
      flex: 1
    },
    {
      field: 'day_count',
      headerName: translate("label:ServiceListView.day_count"),
      flex: 1
    },
    {
      field: 'price',
      headerName: translate("label:ServiceListView.price"),
      flex: 1
    },
    {
      field: 'workflow_name',
      headerName: translate("label:ServiceListView.workflow_name"),
      flex: 1
    },
    {
      field: 'structure_name',
      headerName: translate("label:ServiceListView.structure_name"),
      flex: 1
    },
    {
      field: 'date_start',
      headerName: translate("label:ServiceListView.date_start"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
        </span>
      )
    },
    {
      field: 'date_end',
      headerName: translate("label:ServiceListView.date_end"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
        </span>
      )
    }
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ServiceListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteService(id)}
        columns={columns}
        data={store.data}
        isInLineHeader={true}
        hustomHeader={<Box display={"flex"} alignItems={"center"}>
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
        </Box>}
        tableName="Service" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ServiceListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteService(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="Service" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ServicePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadServices()
        }}
      />

    </Container>
  );
})




export default ServiceListView
