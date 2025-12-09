import React, { FC, useEffect } from 'react';
import {
  Checkbox,
  Container
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import ApplicationOutgoingDocumentPopupForm from '../ApplicationOutgoingDocumentAddEditView/popupForm';
import dayjs from "dayjs";

type ApplicationOutgoingDocumentListViewProps = {};

const ApplicationOutgoingDocumentListView: FC<ApplicationOutgoingDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadApplicationOutgoingDocuments()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'application_number',
      headerName: translate("label:ApplicationOutgoingDocumentListView.application_id"),
      flex: 1
    },
    {
      field: 'outgoing_number',
      headerName: translate("label:ApplicationOutgoingDocumentListView.outgoing_number"),
      flex: 1
    },
    {
      field: 'issued_to_customer',
      headerName: translate("label:ApplicationOutgoingDocumentListView.issued_to_customer"),
      flex: 1,
      renderCell: params => {
        return (
          <Checkbox checked={params.row.issued_to_customer} disabled />
        )
      }
    },
    {
      field: 'issued_at',
      headerName: translate("label:ApplicationOutgoingDocumentListView.issued_at"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}
        </span>
      )
    },
    {
      field: 'signed_ecp',
      headerName: translate("label:ApplicationOutgoingDocumentListView.signed_ecp"),
      flex: 1,
      renderCell: params => {
        return (
          <Checkbox checked={params.row.issued_to_customer} disabled />
        )
      }
    },
    {
      field: 'signature_data',
      headerName: translate("label:ApplicationOutgoingDocumentListView.signature_data"),
      flex: 1
    },
    {
      field: 'journal_name',
      headerName: translate("label:ApplicationOutgoingDocumentListView.journal_id"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ApplicationOutgoingDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationOutgoingDocument(id)}
        columns={columns}
        data={store.data}
        hideActions={true}
        hideAddButton={true}
        tableName="ApplicationOutgoingDocument" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ApplicationOutgoingDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationOutgoingDocument(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationOutgoingDocument" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ApplicationOutgoingDocumentPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadApplicationOutgoingDocuments()
        }}
      />

    </Container>
  );
})




export default ApplicationOutgoingDocumentListView
