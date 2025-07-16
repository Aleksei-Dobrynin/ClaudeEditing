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
import HrmsEventTypePopupForm from './../HrmsEventTypeAddEditView/popupForm';

type HrmsEventTypeListViewProps = {};


const HrmsEventTypeListView: FC<HrmsEventTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadHrmsEventTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:HrmsEventTypeListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:HrmsEventTypeListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:HrmsEventTypeListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:HrmsEventTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteHrmsEventType(id)}
        columns={columns}
        data={store.data}
        tableName="HrmsEventType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:HrmsEventTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteHrmsEventType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="HrmsEventType" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <HrmsEventTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadHrmsEventTypes()
        }}
      />

    </Container>
  );
})




export default HrmsEventTypeListView
