import { FC, useEffect } from 'react';
import { Container } from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import TemplTemplateCommsPopupForm from './../TemplTemplateCommsAddEditView/popupForm'
import styled from 'styled-components';
import PageGridPagination from 'components/PageGridPagination';


type TemplTemplateCommsListViewProps = {};


const TemplTemplateCommsListView: FC<TemplTemplateCommsListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadTemplTemplateCommss()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:TemplTemplateCommsListView.name"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplTemplateComms_column_name"}> {param.row.name} </div>),
      renderHeader: (param) => (<div id={"table_TemplTemplateComms_header_name"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:TemplTemplateCommsListView.description"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplTemplateComms_column_description"}> {param.row.description} </div>),
      renderHeader: (param) => (<div id={"table_TemplTemplateComms_header_description"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'reminder_days_idNavName',
      headerName: translate("label:TemplTemplateCommsListView.reminder_days_id"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplTemplateComms_column_reminder_days_id"}> {param.row.reminder_days_idNavName} </div>),
      renderHeader: (param) => (<div id={"table_TemplTemplateComms_header_reminder_days_id"}>{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGridPagination
        title={translate("label:TemplTemplateCommsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplTemplateComms(id)}
        columns={columns}
        data={store.data}
        tableName="TemplTemplateComms"
        page={store.page}
        pageSize={store.pageSize}
        totalCount={store.totalCount}
        changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
        changeSort={(sortModel) => store.changeSort(sortModel)}
        searchText={store.searchText}
        onChangeTextField={(searchText) => store.changeSearchText(searchText)}
      />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:TemplTemplateCommsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplTemplateComms(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="TemplTemplateComms" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>

      {component}

      <TemplTemplateCommsPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadTemplTemplateCommss()
        }}
      />

    </Container>
  );
})



export default TemplTemplateCommsListView
