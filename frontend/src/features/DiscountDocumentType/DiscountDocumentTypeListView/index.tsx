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
import DiscountDocumentTypePopupForm from './../DiscountDocumentTypeAddEditView/popupForm';

type DiscountDocumentTypeListViewProps = {};


const DiscountDocumentTypeListView: FC<DiscountDocumentTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadDiscountDocumentTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:DiscountDocumentTypeListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:DiscountDocumentTypeListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:DiscountDocumentTypeListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:DiscountDocumentTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDiscountDocumentType(id)}
        columns={columns}
        data={store.data}
        tableName="DiscountDocumentType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:DiscountDocumentTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDiscountDocumentType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="DiscountDocumentType" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <DiscountDocumentTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadDiscountDocumentTypes()
        }}
      />

    </Container>
  );
})




export default DiscountDocumentTypeListView
