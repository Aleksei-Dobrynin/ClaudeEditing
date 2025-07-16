import { FC, useEffect } from 'react';
import Application_subtaskAddEditBaseView from './basePopup';
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
  application_id: number;
  task_id: number;
  structure_id: number;
}

const Application_subtaskPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (props.openPanel) {
      store.application_task_structure_id = props.structure_id
      store.doLoad(props.id)
      store.application_task_id = props.task_id
      store.application_id = props.application_id
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogContent>
        <Application_subtaskAddEditBaseView
          isPopup={true}
        >
        </Application_subtaskAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_application_subtaskSaveButton"
            name={'application_subtaskAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_application_subtaskCancelButton"
            name={'application_subtaskAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default Application_subtaskPopupForm
