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
import ArchObjectPopupForm from './../ArchObjectAddEditView/popupForm';

type ArchObjectListViewProps = {};


const ArchObjectListView: FC<ArchObjectListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadArchObjects()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'address',
      headerName: translate("label:ArchObjectListView.address"),
      flex: 1
    },
    {
      field: 'name',
      headerName: translate("label:ArchObjectListView.name"),
      flex: 1
    },
    {
      field: 'identifier',
      headerName: translate("label:ArchObjectListView.identifier"),
      flex: 1
    },
    {
      field: 'district_name',
      headerName: translate("label:ArchObjectListView.district_id"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ArchObjectListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ArchObjectListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteArchObject(id)}
        columns={columns}
        data={store.data}
        tableName="ArchObject" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ArchObjectListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteArchObject(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ArchObject" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ArchObjectPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadArchObjects()
        }}
      />

    </Container>
  );
})




export default ArchObjectListView
