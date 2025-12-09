import { FC, useEffect } from 'react';
import S_DocumentTemplateTranslationAddEditBaseView from './base';
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
  idDocumentTemplate: number;
}

const S_DocumentTemplateTranslationPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.handleChange({ target: { value: props.idDocumentTemplate, name: "idDocumentTemplate" } })
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="xl" fullWidth>
      <DialogContent>
        <S_DocumentTemplateTranslationAddEditBaseView
          isPopup={true}
        >
        </S_DocumentTemplateTranslationAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_S_DocumentTemplateTranslationSaveButton"
            name={'S_DocumentTemplateTranslationAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_S_DocumentTemplateTranslationCancelButton"
            name={'S_DocumentTemplateTranslationAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default S_DocumentTemplateTranslationPopupForm
