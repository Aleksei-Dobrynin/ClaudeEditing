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
import DistrictPopupForm from './../DistrictAddEditView/popupForm';

type DistrictListViewProps = {};


const DistrictListView: FC<DistrictListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadDistricts()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:DistrictListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:DistrictListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:DistrictListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:DistrictListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDistrict(id)}
        columns={columns}
        data={store.data}
        tableName="District" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:DistrictListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDistrict(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="District" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <DistrictPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadDistricts()
        }}
      />

    </Container>
  );
})




export default DistrictListView
