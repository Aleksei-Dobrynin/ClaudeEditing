import { FC, useEffect } from 'react';
import TechCouncilParticipantsSettingsAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
  idService: number;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.service_id = props.idService;
    } else {
      store.clearStore()
    }
  }, [props.openPanel, props.idService])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick}>
      <DialogTitle>{translate('label:TechCouncilParticipantsSettingsAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <TechCouncilParticipantsSettingsAddEditBaseView
          isPopup={true}
        >
        </TechCouncilParticipantsSettingsAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_TechCouncilParticipantsSettingsSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_TechCouncilParticipantsSettingsCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default PopupForm
