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
import ContactTypePopupForm from './../ContactTypeAddEditView/popupForm';

type ContactTypeListViewProps = {};


const ContactTypeListView: FC<ContactTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadContactTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:ContactTypeListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:ContactTypeListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ContactTypeListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ContactTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteContactType(id)}
        columns={columns}
        data={store.data}
        tableName="ContactType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ContactTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteContactType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ContactType" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ContactTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadContactTypes()
        }}
      />

    </Container>
  );
})




export default ContactTypeListView
