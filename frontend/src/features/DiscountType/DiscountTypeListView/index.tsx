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
import DiscountTypePopupForm from './../DiscountTypeAddEditView/popupForm';

type DiscountTypeListViewProps = {};


const DiscountTypeListView: FC<DiscountTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadDiscountTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:DiscountTypeListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:DiscountTypeListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:DiscountTypeListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:DiscountTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDiscountType(id)}
        columns={columns}
        data={store.data}
        tableName="DiscountType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:DiscountTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteDiscountType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="DiscountType" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <DiscountTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadDiscountTypes()
        }}
      />

    </Container>
  );
})




export default DiscountTypeListView
