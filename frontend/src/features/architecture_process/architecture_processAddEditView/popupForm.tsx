import { FC, useEffect } from 'react';
import Architecture_processAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  application_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const Architecture_processPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.application_id)
      store.setApplicationId(props.application_id)
      store.getNumber(props.application_id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="md" fullWidth>
      <DialogTitle>Отправка документов на дежурный план</DialogTitle>
      <DialogContent>
        <Architecture_processAddEditBaseView
          isPopup={true}
        >
        </Architecture_processAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_architecture_processSaveButton"
            name={'architecture_processAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("Отправить")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_architecture_processCancelButton"
            name={'architecture_processAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default Architecture_processPopupForm
