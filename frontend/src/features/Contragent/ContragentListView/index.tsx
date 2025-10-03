import { FC, useEffect } from 'react';
import { Container } from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import ContragentPopupForm from './../ContragentAddEditView/popupForm';

type ContragentListViewProps = {};

const ContragentListView: FC<ContragentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadContragents();
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: translate('label:ContragentListView.name'), 
      flex: 1.5 
    },
    {
      field: 'code',
      headerName: translate('label:ContragentListView.code'),
      flex: 1
    },
    {
      field: 'address',
      headerName: translate('label:ContragentListView.address'),
      flex: 1.5
    },
    {
      field: 'contacts',
      headerName: translate('label:ContragentListView.contacts'),
      flex: 1.5
    },
    // {
    //   field: 'user_id',
    //   headerName: translate('label:ContragentListView.user_id'),
    //   flex: 1
    // },
    {
      field: 'date_start',
      headerName: translate('label:ContragentListView.date_start'),
      flex: 1,
      // valueFormatter: (params) => {
      //   if (!params.value) return '';
      //   return new Date(params.value).toLocaleDateString();
      // }
    },
    {
      field: 'date_end',
      headerName: translate('label:ContragentListView.date_end'),
      flex: 1,
      // valueFormatter: (params) => {
      //   if (!params.value) return '';
      //   return new Date(params.value).toLocaleDateString();
      // }
    },
  ];

  let type1: string = 'form';
  let component = null;
  
  switch (type1) {
    case 'form':
      component = (
        <PageGrid
          title={translate("label:ContragentListView.entityTitle")}
          onDeleteClicked={(id: number) => store.deleteContragent(id)}
          columns={columns}
          data={store.data}
          tableName="Contragent"
        />
      );
      break;
    case 'popup':
      component = (
        <PopupGrid
          title={translate("label:ContragentListView.entityTitle")}
          onDeleteClicked={(id: number) => store.deleteContragent(id)}
          onEditClicked={(id: number) => store.onEditClicked(id)}
          columns={columns}
          data={store.data}
          tableName="Contragent"
        />
      );
      break;
  }

  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ContragentPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadContragents();
        }}
      />
    </Container>
  );
});

export default ContragentListView;