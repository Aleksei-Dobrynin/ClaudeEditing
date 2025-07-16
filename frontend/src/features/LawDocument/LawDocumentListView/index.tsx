import React, { FC, useEffect } from 'react';
import {
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import LawDocumentPopupForm from '../LawDocumentAddEditView/popupForm';
import dayjs from "dayjs";

type LawDocumentListViewProps = {};

const LawDocumentListView: FC<LawDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadLawDocuments()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:LawDocumentListView.name"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:LawDocumentListView.description"),
      flex: 1
    },
    {
      field: 'data',
      headerName: translate("label:LawDocumentListView.data"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
        </span>
      )
    },
    {
      field: 'type_name',
      headerName: translate("label:LawDocumentListView.type_id"),
      flex: 1
    },
    {
      field: 'link',
      headerName: translate("label:LawDocumentListView.link"),
      flex: 1
    },
    {
      field: 'name_kg',
      headerName: translate("label:LawDocumentListView.name_kg"),
      flex: 1
    },
    {
      field: 'description_kg',
      headerName: translate("label:LawDocumentListView.description_kg"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:LawDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteLawDocument(id)}
        columns={columns}
        data={store.data}
        tableName="LawDocument" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:LawDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteLawDocument(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="LawDocument" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <LawDocumentPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadLawDocuments()
        }}
      />

    </Container>
  );
})




export default LawDocumentListView
