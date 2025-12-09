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
import Archive_folderPopupForm from './../archive_folderAddEditView/popupForm'
import styled from 'styled-components';
import { Link } from "react-router-dom";


type archive_folderListViewProps = {
  idArchiveObject?: number,
  is_popup?: boolean
};


const archive_folderListView: FC<archive_folderListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadarchive_folders()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    {
      field: 'dutyplan_object_id',
      headerName: translate("label:archive_folderListView.dutyplan_object_id"),
      flex: 1,
      // renderCell: (param) => (<div data-testid="table_archive_folder_column_dutyplan_object_id"> {param.row.dutyplan_object_id} </div>),
      renderCell: (params) => {
        return <Link
          style={{ textDecoration: "underline", marginLeft: 5 }}
          to={`/user/ArchiveObject/addedit?id=${params.row.dutyplan_object_id}`}>
          {params.row.object_number + " ("+params.row.object_address+")"}
        </Link>;
      },
      renderHeader: (param) => (<div data-testid="table_archive_folder_header_dutyplan_object_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'archive_folder_name',
      headerName: translate("label:archive_folderListView.archive_folder_name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_folder_column_archive_folder_name"> {param.row.archive_folder_name} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_folder_header_archive_folder_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'folder_location',
      headerName: translate("label:archive_folderListView.folder_location"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_folder_column_folder_location"> {param.row.folder_location} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_folder_header_folder_location">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'created_at',
    //   headerName: translate("label:archive_folderListView.created_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_archive_folder_column_created_at"> {param.row.created_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_archive_folder_header_created_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_at',
    //   headerName: translate("label:archive_folderListView.updated_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_archive_folder_column_updated_at"> {param.row.updated_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_archive_folder_header_updated_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'created_by',
    //   headerName: translate("label:archive_folderListView.created_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_archive_folder_column_created_by"> {param.row.created_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_archive_folder_header_created_by">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_by',
    //   headerName: translate("label:archive_folderListView.updated_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_archive_folder_column_updated_by"> {param.row.updated_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_archive_folder_header_updated_by">{param.colDef.headerName}</div>)
    // },
  ];

  let type1: string = 'form';
  if (props.is_popup) {
    type1 = 'popup'
  }
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:archive_folderListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchive_folder(id)}
        columns={columns}
        data={store.data}
        tableName="archive_folder" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:archive_folderListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchive_folder(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="archive_folder" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      {/* <Archive_folderPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadarchive_folders()
        }}
      /> */}

    </Container>
  );
})



export default archive_folderListView
