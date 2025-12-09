import { FC, useEffect } from 'react';
import Application_taskAddEditBaseView from './popupBase';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";
import Application_subtaskListView from 'features/application_subtask/application_subtaskListView';
import FastInputapplication_task_assigneeView from 'features/application_task_assignee/application_task_assigneeAddEditView/fastInput';
import FastInputapplication_subtaskView from 'features/application_subtask/application_subtaskAddEditView/fastInput';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  idMain: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const Application_taskPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.changeAppliationId(props.idMain)
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="md" fullWidth>
      <DialogContent>
        <Application_taskAddEditBaseView
          isPopup={true}
        >
        </Application_taskAddEditBaseView>


      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_application_taskSaveButton"
            name={'application_taskAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => {
                props.onSaveClick(id)
              })
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_application_taskCancelButton"
            name={'application_taskAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default Application_taskPopupForm
