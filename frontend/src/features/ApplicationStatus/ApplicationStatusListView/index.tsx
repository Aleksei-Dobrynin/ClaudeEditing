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
import ApplicationStatusPopupForm from './../ApplicationStatusAddEditView/popupForm'


type ApplicationStatusListViewProps = {};


const ApplicationStatusListView: FC<ApplicationStatusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadApplicationStatuss()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'code',
      headerName: 'code',
      flex: 1
    },
    {
      field: 'description',
      headerName: 'description',
      flex: 1
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ApplicationStatusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationStatus(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationStatus" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ApplicationStatusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationStatus(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationStatus" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ApplicationStatusPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadApplicationStatuss()
        }}
      />

    </Container>
  );
})




export default ApplicationStatusListView
