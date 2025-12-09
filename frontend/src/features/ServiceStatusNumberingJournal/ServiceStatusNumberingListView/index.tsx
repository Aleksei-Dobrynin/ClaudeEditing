import React, { FC, useEffect } from 'react';
import {
  Checkbox,
  Container
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import ServiceStatusNumberingPopupForm from '../ServiceStatusNumberingAddEditView/popupForm';
import dayjs from "dayjs";

type ServiceStatusNumberingListViewProps = {
  idJournal: number;
};

const ServiceStatusNumberingListView: FC<ServiceStatusNumberingListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idJournal !== props.idJournal) {
      store.idJournal = props.idJournal
    }
    store.loadServiceStatusNumberings()
    return () => {
      store.clearStore()
    }
  }, [props.idJournal])

  const columns: GridColDef[] = [
    {
      field: 'date_start',
      headerName: translate("label:ServiceStatusNumberingListView.date_start"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}
        </span>
      )
    },
    {
      field: 'date_end',
      headerName: translate("label:ServiceStatusNumberingListView.date_end"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}
        </span>
      )
    },
    {
      field: 'is_active',
      headerName: translate("label:ServiceStatusNumberingListView.is_active"),
      flex: 1,
      renderCell: params => {
        return (
          <Checkbox checked={params.row.is_active} disabled />
        )
      }
    },
    {
      field: 'service_name',
      headerName: translate("label:ServiceStatusNumberingListView.service_id"),
      flex: 1
    },
    // {
    //   field: 'number_template',
    //   headerName: translate("label:ServiceStatusNumberingListView.number_template"),
    //   flex: 1
    // },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ServiceStatusNumberingListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteServiceStatusNumbering(id)}
        columns={columns}
        data={store.data}
        tableName="ServiceStatusNumbering" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("Настройка услуг")}
        onDeleteClicked={(id: number) => store.deleteServiceStatusNumbering(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ServiceStatusNumbering" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ServiceStatusNumberingPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idJournal={store.idJournal}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadServiceStatusNumberings()
        }}
      />

    </Container>
  );
})




export default ServiceStatusNumberingListView
