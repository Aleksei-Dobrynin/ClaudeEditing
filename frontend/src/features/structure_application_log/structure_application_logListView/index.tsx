import { FC, useEffect } from 'react';
import {
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Structure_application_logPopupForm from './../structure_application_logAddEditView/popupForm'
import styled from 'styled-components';
import dayjs from 'dayjs';
import CustomButton from 'components/Button';


type structure_application_logListViewProps = {
};


const structure_application_logListView: FC<structure_application_logListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadstructure_application_logs()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    // {
    //   field: 'created_by',
    //   headerName: translate("label:structure_application_logListView.created_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_application_log_column_created_by"> {param.row.created_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_application_log_header_created_by">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_by',
    //   headerName: translate("label:structure_application_logListView.updated_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_application_log_column_updated_by"> {param.row.updated_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_application_log_header_updated_by">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_at',
    //   headerName: translate("label:structure_application_logListView.updated_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_application_log_column_updated_at"> {param.row.updated_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_application_log_header_updated_at">{param.colDef.headerName}</div>)
    // },
    {
      field: 'structure_name',
      headerName: translate("label:structure_application_logListView.structure_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_application_log_column_structure_id"> {param.row.structure_name} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_application_log_header_structure_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'app_number',
      headerName: translate("label:structure_application_logListView.application_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_application_log_column_application_id"> {param.row.app_number} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_application_log_header_application_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'status',
      headerName: translate("label:structure_application_logListView.status"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_application_log_column_status"> {param.row.status} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_application_log_header_status">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:structure_application_logListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_application_log_column_created_at">
        <span>
          {param.value ? dayjs(param.value).format("DD.MM.YYYY HH:mm") : ""}
        </span> </div>),
      renderHeader: (param) => (<div data-testid="table_structure_application_log_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'id',
      headerName: translate("label:structure_application_logListView.choose"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_application_log_column_choose">
        <CustomButton sx={{ marginRight: 1 }} variant='contained' size="small" onClick={() => store.changeStatus("accepted", param.value)}>
          {translate("common:Accept")}
        </CustomButton>
        <CustomButton variant='contained' color={"secondary"} size="small" onClick={() => store.changeStatus("rejected", param.value)}>
        {translate("common:Reject")}
        </CustomButton>
      </div>),
      renderHeader: (param) => (<div data-testid="table_structure_application_log_header_choose">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:structure_application_logListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_application_log(id)}
        columns={columns}
        hideActions
        hideAddButton
        data={store.data}
        tableName="structure_application_log" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:structure_application_logListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_application_log(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="structure_application_log" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Structure_application_logPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadstructure_application_logs()
        }}
      />

    </Container>
  );
})



export default structure_application_logListView
