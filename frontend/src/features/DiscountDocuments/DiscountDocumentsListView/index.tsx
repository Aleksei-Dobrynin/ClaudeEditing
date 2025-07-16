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
import DiscountDocumentsPopupForm from './../DiscountDocumentsAddEditView/popupForm';
import dayjs from "dayjs";

type DiscountDocumentsListViewProps = {};


const DiscountDocumentsListView: FC<DiscountDocumentsListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadDiscountDocumentss()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'file_name',
      headerName: translate("label:DiscountDocumentsListView.file_id"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:DiscountDocumentsListView.description"),
      flex: 1
    },
    {
      field: 'discount',
      headerName: translate("label:DiscountDocumentsListView.discount"),
      flex: 1
    },
    {
      field: 'discount_type_name',
      headerName: translate("label:DiscountDocumentsListView.discount_type_id"),
      flex: 1
    },
    {
      field: 'document_type_name',
      headerName: translate("label:DiscountDocumentsListView.document_type_id"),
      flex: 1
    },
    {
      field: 'start_date',
      headerName: translate("label:DiscountDocumentsListView.start_date"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
        </span>
      )
    },
    {
      field: 'end_date',
      headerName: translate("label:DiscountDocumentsListView.end_date"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
        </span>
      )
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:DiscountDocumentsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDiscountDocuments(id)}
        columns={columns}
        data={store.data}
        tableName="DiscountDocuments" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:DiscountDocumentsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDiscountDocuments(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="DiscountDocuments" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <DiscountDocumentsPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadDiscountDocumentss()
        }}
      />

    </Container>
  );
})




export default DiscountDocumentsListView
