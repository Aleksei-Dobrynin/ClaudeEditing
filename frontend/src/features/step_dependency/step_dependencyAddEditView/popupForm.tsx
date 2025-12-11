import { FC, useEffect } from 'react';
import Step_dependencyAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  service_path_id?: number;
  dependent_step_id?: number;
  prerequisite_step_id?: number;
  hideCircle?: boolean;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const step_dependencyPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:step_dependencyAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <Step_dependencyAddEditBaseView
          isPopup={true}
          service_path_id={props.service_path_id}
          dependent_step_id={props.dependent_step_id}
          prerequisite_step_id={props.prerequisite_step_id}
          hideCircle={props.hideCircle}
        >
        </Step_dependencyAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_step_dependencySaveButton"
            name={'step_dependencyAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_step_dependencyCancelButton"
            name={'step_dependencyAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default step_dependencyPopupForm
