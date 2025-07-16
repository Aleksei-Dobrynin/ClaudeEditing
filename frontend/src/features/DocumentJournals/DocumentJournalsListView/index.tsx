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
import DocumentJournalsPopupForm from '../DocumentJournalsAddEditView/popupForm';
import dayjs from "dayjs";

type DocumentJournalsListViewProps = {};

const DocumentJournalsListView: FC<DocumentJournalsListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadDocumentJournalss()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:DocumentJournalsListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:DocumentJournalsListView.code"),
      flex: 1
    },
    {
      field: 'status_names',
      headerName: translate("Статусы"),
      flex: 1
    },
    // {
    //   field: 'number_template',
    //   headerName: translate("label:DocumentJournalsListView.number_template"),
    //   flex: 1
    // },
    {
      field: 'current_number',
      headerName: translate("label:DocumentJournalsListView.current_number"),
      flex: 1
    },
    {
      field: 'period_type_name',
      headerName: translate("label:DocumentJournalsListView.reset_period"),
      flex: 1
    },
    {
      field: 'last_reset',
      headerName: translate("label:DocumentJournalsListView.last_reset"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}
        </span>
      )
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:DocumentJournalsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDocumentJournals(id)}
        columns={columns}
        data={store.data}
        tableName="DocumentJournals" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:DocumentJournalsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDocumentJournals(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="DocumentJournals" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <DocumentJournalsPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadDocumentJournalss()
        }}
      />

    </Container>
  );
})




export default DocumentJournalsListView
