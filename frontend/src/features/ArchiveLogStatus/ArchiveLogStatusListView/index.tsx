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
import ArchiveLogStatusPopupForm from './../ArchiveLogStatusAddEditView/popupForm';

type ArchiveLogStatusListViewProps = {};


const ArchiveLogStatusListView: FC<ArchiveLogStatusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadArchiveLogStatuss()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:ArchiveLogStatusListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:ArchiveLogStatusListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ArchiveLogStatusListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ArchiveLogStatusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteArchiveLogStatus(id)}
        columns={columns}
        data={store.data}
        tableName="ArchiveLogStatus" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ArchiveLogStatusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteArchiveLogStatus(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ArchiveLogStatus" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ArchiveLogStatusPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadArchiveLogStatuss()
        }}
      />

    </Container>
  );
})




export default ArchiveLogStatusListView
