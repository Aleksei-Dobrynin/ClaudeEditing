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
import SystemSettingPopupForm from './../SystemSettingAddEditView/popupForm';

type SystemSettingListViewProps = {};

const SystemSettingListView: FC<SystemSettingListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadSystemSettings()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:SystemSettingListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:SystemSettingListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:SystemSettingListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:SystemSettingListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteSystemSetting(id)}
        columns={columns}
        data={store.data}
        tableName="SystemSetting" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:SystemSettingListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteSystemSetting(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="SystemSetting" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <SystemSettingPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadSystemSettings()
        }}
      />

    </Container>
  );
})




export default SystemSettingListView
