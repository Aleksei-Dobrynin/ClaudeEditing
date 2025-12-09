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
import ServicePricePopupForm from './../ServicePriceAddEditView/popupForm';
import MainStore from "../../../MainStore";
import LayoutStore from "../../../layouts/MainLayout/store";

type ServicePriceListViewProps = {};


const ServicePriceListView: FC<ServicePriceListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadServicePrices()
    return () => {
      store.clearStore()
    }
  }, [LayoutStore.head_of_structures])

  const columns: GridColDef[] = [
    {
      field: 'service_name',
      headerName: translate("label:ServicePriceListView.service_id"),
      flex: 1
    },
    {
      field: 'structure_name',
      headerName: translate("label:ServicePriceListView.structure_id"),
      flex: 1
    },
    {
      field: 'price',
      headerName: translate("label:ServicePriceListView.price"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ServicePriceListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteServicePrice(id)}
        columns={columns}
        data={store.data}
        tableName="ServicePrice" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ServicePriceListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteServicePrice(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ServicePrice" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ServicePricePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadServicePrices()
        }}
      />

    </Container>
  );
})




export default ServicePriceListView
