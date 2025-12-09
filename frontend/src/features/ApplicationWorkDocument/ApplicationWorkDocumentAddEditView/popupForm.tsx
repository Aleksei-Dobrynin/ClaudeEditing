import { FC, useEffect } from 'react';
import ApplicationWorkDocumentAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  idMain: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
  isShowDocumentType?: boolean;
}

const ApplicationWorkDocumentPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.task_id = props.idMain
      store.isShowDocumentType = props.isShowDocumentType ?? false;
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="md" fullWidth>
      <DialogTitle>{translate('label:ApplicationWorkDocumentAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <ApplicationWorkDocumentAddEditBaseView
          isPopup={true}
        >
        </ApplicationWorkDocumentAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_ApplicationWorkDocumentSaveButton"
            name={'ApplicationWorkDocumentAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_ApplicationWorkDocumentCancelButton"
            color={"secondary"}
            sx={{ color: "white", backgroundColor: "#DE350B !important" }}
            name={'ApplicationWorkDocumentAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default ApplicationWorkDocumentPopupForm
