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
import TechCouncilParticipantsSettingsPopupForm from '../TechCouncilParticipantsSettingsAddEditView/popupForm';

type TechCouncilParticipantsSettingsListViewProps = {
  idService: number;
};

const TechCouncilParticipantsSettingsListView: FC<TechCouncilParticipantsSettingsListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idService !== props.idService) {
      store.idService = props.idService
    }
    store.loadTechCouncilParticipantsSettingss()
    return () => {
      store.clearStore()
    }
  }, [props.idService])

  const columns: GridColDef[] = [
    {
      field: 'structure_name',
      headerName: translate("label:TechCouncilParticipantsSettingsListView.structure_name"),
      flex: 1
    },
    {
      field: 'is_active',
      headerName: translate("label:TechCouncilParticipantsSettingsListView.is_active"),
      flex: 1,
      renderCell: params => {
        return (
          <Checkbox checked={params.row.is_active} disabled />
        )
      }
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:TechCouncilParticipantsSettingsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTechCouncilParticipantsSettings(id)}
        columns={columns}
        data={store.data}
        tableName="TechCouncilParticipantsSettings" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:TechCouncilParticipantsSettingsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTechCouncilParticipantsSettings(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="TechCouncilParticipantsSettings" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <TechCouncilParticipantsSettingsPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idService={store.idService}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadTechCouncilParticipantsSettingss()
        }}
      />

    </Container>
  );
})




export default TechCouncilParticipantsSettingsListView
