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
import LawDocumentTypePopupForm from '../LawDocumentTypeAddEditView/popupForm';

type LawDocumentTypeListViewProps = {};

const LawDocumentTypeListView: FC<LawDocumentTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadLawDocumentTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:LawDocumentTypeListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:LawDocumentTypeListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:LawDocumentTypeListView.description"),
      flex: 1
    },
    {
      field: 'name_kg',
      headerName: translate("label:LawDocumentTypeListView.name_kg"),
      flex: 1
    },
    {
      field: 'description_kg',
      headerName: translate("label:LawDocumentTypeListView.description_kg"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:LawDocumentTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteLawDocumentType(id)}
        columns={columns}
        data={store.data}
        tableName="LawDocumentType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:LawDocumentTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteLawDocumentType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="LawDocumentType" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <LawDocumentTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadLawDocumentTypes()
        }}
      />

    </Container>
  );
})




export default LawDocumentTypeListView
