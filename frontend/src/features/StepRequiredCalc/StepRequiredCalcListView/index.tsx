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
import StepRequiredCalcPopupForm from '../StepRequiredCalcAddEditView/popupForm';

type StepRequiredCalcListViewProps = {};

const StepRequiredCalcListView: FC<StepRequiredCalcListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadStepRequiredCalcs()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'step_name',
      headerName: translate("label:StepRequiredCalcListView.step_name"),
      flex: 1
    },
    {
      field: 'structure_name',
      headerName: translate("label:StepRequiredCalcListView.structure_name"),
      flex: 1
    }
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:StepRequiredCalcListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStepRequiredCalc(id)}
        columns={columns}
        data={store.data}
        tableName="StepRequiredCalc" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:StepRequiredCalcListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStepRequiredCalc(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="StepRequiredCalc" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <StepRequiredCalcPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadStepRequiredCalcs()
        }}
      />

    </Container>
  );
})




export default StepRequiredCalcListView
