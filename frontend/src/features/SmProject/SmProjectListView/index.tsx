import { FC, useEffect } from 'react';
import { Container } from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import SmProjectPopupForm from './../SmProjectAddEditView/popupForm'
import styled from 'styled-components';
import PageGridPagination from 'components/PageGridPagination';


type SmProjectListViewProps = {};


const SmProjectListView: FC<SmProjectListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadSmProjects()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:SmProjectListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_name"}> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_name"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'projecttype_idNavName',
      headerName: translate("label:SmProjectListView.projecttype_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_projecttype_id"}> {param.row.projecttype_idNavName} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_projecttype_id"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'test',
      headerName: translate("label:SmProjectListView.test"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_test"}> {param.row.test} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_test"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'status_idNavName',
      headerName: translate("label:SmProjectListView.status_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_status_id"}> {param.row.status_idNavName} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_status_id"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'min_responses',
      headerName: translate("label:SmProjectListView.min_responses"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_min_responses"}> {param.row.min_responses} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_min_responses"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'date_end',
      headerName: translate("label:SmProjectListView.date_end"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_date_end"}> {param.row.date_end} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_date_end"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'access_link',
      headerName: translate("label:SmProjectListView.access_link"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_access_link"}> {param.row.access_link} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_access_link"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'entity_idNavName',
      headerName: translate("label:SmProjectListView.entity_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_entity_id"}> {param.row.entity_idNavName} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_entity_id"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'frequency_idNavName',
      headerName: translate("label:SmProjectListView.frequency_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_frequency_id"}> {param.row.frequency_idNavName} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_frequency_id"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'is_triggers_required',
      headerName: translate("label:SmProjectListView.is_triggers_required"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_is_triggers_required"}> {param.row.is_triggers_required} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_is_triggers_required"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'date_attribute_milestone_idNavName',
      headerName: translate("label:SmProjectListView.date_attribute_milestone_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid={"table_SmProject_column_date_attribute_milestone_id"}> {param.row.date_attribute_milestone_idNavName} </div>),
      renderHeader: (param) => (<div data-testid={"table_SmProject_header_date_attribute_milestone_id"}>{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGridPagination
        title={translate("label:SmProjectListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteSmProject(id)}
        columns={columns}
        data={store.data}
        tableName="SmProject"
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
        title={translate("label:SmProjectListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteSmProject(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="SmProject" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }} data-testid="SmProjectListView">
      {store.openPanel ? <>true</> : <>false</>}
      {component}

      <SmProjectPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadSmProjects()
        }}
      />

    </Container>
  );
})



export default SmProjectListView
