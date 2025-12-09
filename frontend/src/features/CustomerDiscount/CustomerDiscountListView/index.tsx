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
import CustomerDiscountPopupForm from './../CustomerDiscountAddEditView/popupForm';

type CustomerDiscountListViewProps = {};


const CustomerDiscountListView: FC<CustomerDiscountListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadCustomerDiscounts()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'pin_customer',
      headerName: translate("label:CustomerDiscountListView.pin_customer"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:CustomerDiscountListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:CustomerDiscountListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomerDiscount(id)}
        columns={columns}
        data={store.data}
        tableName="CustomerDiscount" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:CustomerDiscountListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomerDiscount(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="CustomerDiscount" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <CustomerDiscountPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadCustomerDiscounts()
        }}
      />

    </Container>
  );
})




export default CustomerDiscountListView
