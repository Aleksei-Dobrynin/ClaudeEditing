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
import ApplicationRoadPopupForm from './../ApplicationRoadAddEditView/popupForm';

type ApplicationRoadListViewProps = {};


const ApplicationRoadListView: FC<ApplicationRoadListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadApplicationRoads()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'from_status_name',
      headerName: translate("label:ApplicationRoadListView.from_status_id"),
      flex: 1
    },
    {
      field: 'to_status_name',
      headerName: translate("label:ApplicationRoadListView.to_status_id"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ApplicationRoadListView.description"),
      flex: 1
    },
    {
      field: 'is_active',
      headerName: translate("label:ApplicationRoadListView.is_active"),
      flex: 1,
      renderCell: params => {
        return<span>{params.row.is_active ?
          translate("label:ApplicationRoadListView.active")
          : translate("label:ApplicationRoadListView.inactive")}
        </span>
      }
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ApplicationRoadListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationRoad(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationRoad" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ApplicationRoadListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationRoad(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationRoad" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ApplicationRoadPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadApplicationRoads()
        }}
      />

    </Container>
  );
})




export default ApplicationRoadListView
