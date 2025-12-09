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
import ApplicationRequiredCalcPopupForm from '../ApplicationRequiredCalcAddEditView/popupForm';

type ApplicationRequiredCalcListViewProps = {};

const ApplicationRequiredCalcListView: FC<ApplicationRequiredCalcListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadApplicationRequiredCalcs()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'application_number',
      headerName: translate("label:ApplicationRequiredCalcListView.application_number"),
      flex: 1
    },
    {
      field: 'path_step_name',
      headerName: translate("label:ApplicationRequiredCalcListView.path_step_name"),
      flex: 1
    },
    {
      field: 'structure_name',
      headerName: translate("label:ApplicationRequiredCalcListView.structure_name"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ApplicationRequiredCalcListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationRequiredCalc(id)}
        columns={columns}
        data={store.data}
        hideAddButton={true}
        hideEditButton={true}
        tableName="ApplicationRequiredCalc" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ApplicationRequiredCalcListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationRequiredCalc(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationRequiredCalc" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ApplicationRequiredCalcPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadApplicationRequiredCalcs()
        }}
      />

    </Container>
  );
})




export default ApplicationRequiredCalcListView
