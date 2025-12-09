import { FC, useEffect } from 'react';
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
import ServiceDocumentPopupForm from './../ServiceDocumentAddEditView/popupForm';

type ServiceDocumentListViewProps = {
  idService: number;
};


const ServiceDocumentListView: FC<ServiceDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idService !== props.idService) {
      store.idService = props.idService
    }
    store.loadServiceDocumentsByService()
    return () => store.clearStore()
  }, [props.idService])


  const columns: GridColDef[] = [
    {
      field: 'application_document_name',
      headerName: translate("label:ServiceDocumentListView.application_document_name"),
      flex: 1
    },
    {
      field: 'is_required',
      headerName: translate("label:ServiceDocumentListView.is_required"),
      flex: 1,
      renderCell: params => {
        return (
          <Checkbox checked={params.row.is_required} disabled />
        )
      }
    },
    {
      field: 'is_outcome',
      headerName: translate("label:ServiceDocumentListView.is_outcome"),
      flex: 1,
      renderCell: params => {
        return (
          <Checkbox checked={params.row.is_outcome == true} disabled />
        )
      }
    }
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ServiceDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteServiceDocument(id)}
        columns={columns}
        data={store.data}
        tableName="ServiceDocument" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ServiceDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteServiceDocument(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ServiceDocument" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ServiceDocumentPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idService={store.idService}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          if (store.idService !== null && store.idService !== 0) {
            (async () => store.loadServiceDocumentsByService())()
            return;
          }
          store.loadServiceDocuments()
        }}
      />

    </Container>
  );
})




export default ServiceDocumentListView
