import { FC, useEffect } from 'react';
import {
  Container,
  Paper,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Org_structurePopupForm from './../org_structureAddEditView/popupForm'
import styled from 'styled-components';
import BorderedTreeView from './tree-view';
import CustomButton from 'components/Button';
import AddIcon from '@mui/icons-material/Add';
import MainStore from 'MainStore';


type org_structureListViewProps = {
};


const org_structureListView: FC<org_structureListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadorg_structures()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:org_structureListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_column_name"> {param.row.name} ({param.row.short_name}) </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'parent_id',
      headerName: translate("label:org_structureListView.parent_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_column_parent_id"> {param.row.parent_id} </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_header_parent_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'version',
      headerName: translate("label:org_structureListView.version"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_column_version"> {param.row.version} </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_header_version">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_active',
      headerName: translate("label:org_structureListView.is_active"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_column_is_active"> {param.row.is_active} </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_header_is_active">{param.colDef.headerName}</div>)
    },
    {
      field: 'date_start',
      headerName: translate("label:org_structureListView.date_start"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_column_date_start"> {param.row.date_start} </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_header_date_start">{param.colDef.headerName}</div>)
    },
    {
      field: 'date_end',
      headerName: translate("label:org_structureListView.date_end"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_column_date_end"> {param.row.date_end} </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_header_date_end">{param.colDef.headerName}</div>)
    },
    {
      field: 'remote_id',
      headerName: translate("label:org_structureListView.remote_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_column_remote_id"> {param.row.remote_id} </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_header_remote_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'unique_id',
      headerName: translate("label:org_structureListView.unique_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_column_unique_id"> {param.row.unique_id} </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_header_unique_id">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:org_structureListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteorg_structure(id)}
        columns={columns}
        data={store.data}
        tableName="org_structure" />
      break
    // case 'popup':
    //   component = <PopupGrid
    //     title={translate("label:org_structureListView.entityTitle")}
    //     onDeleteClicked={(id: number) => store.deleteorg_structure(id)}
    //     onEditClicked={(id: number) => store.onEditClicked(id)}
    //     columns={columns}
    //     data={store.data}
    //     tableName="org_structure" />
    //   break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>

      {/* <Paper sx={{ p: 2, mt: 2 }}>
      </Paper> */}
      <Paper elevation={5} style={{ width: '100%', padding: 20, }}>
        <h1 data-testid={`OrgStructureHeaderTitle`}>{translate("label:org_structureListView.entityTitle")}</h1>
        <CustomButton
          variant='contained'
          sx={{ mb: 1 }}
          id={`OrgStructureAddButton`}
          onClick={() => store.onEditClicked(0, 0)}
          endIcon={<AddIcon />}
        >
          {translate('add')}
        </CustomButton>
        <BorderedTreeView />

        <CustomButton
          variant='contained'
          sx={{ mb: 1 }}
          onClick={() => {
            store.printDocument(16, {
              structure_id: 15,
            })
          }}
        >
          {translate("common:Download_structure")}
        </CustomButton>
        <br />
        <CustomButton
          variant='contained'
          sx={{ mb: 1 }}
          onClick={() => {
            store.printDocument(6, {
            })
          }}
        >
          {translate("common:Download_current_work_schedule")}
        </CustomButton>
      </Paper>

      <Org_structurePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        idParent={store.idParent}
        onSaveClick={() => {
          store.closePanel()
          store.loadorg_structures()
        }}
      />

    </Container>
  );
})



export default org_structureListView
