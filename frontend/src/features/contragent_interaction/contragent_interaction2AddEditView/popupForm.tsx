import { FC, useEffect } from 'react';
import Contragent_interactionAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import ContragentInteractionFastInputView from 'features/contragent_interaction_doc/contragent_interaction_docAddEditView/fastInput';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  application_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const contragent_interactionPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.handleChange({ target: { value: props.application_id, name: "application_id" } })
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:contragent_interactionAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <Contragent_interactionAddEditBaseView
          isPopup={true}
        >
        </Contragent_interactionAddEditBaseView>
        {store.id > 0 && <ContragentInteractionFastInputView
          idMain={store.id}
        />}
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_contragent_interactionSaveButton"
            name={'contragent_interactionAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number, isNew: boolean) => {
                if (isNew) {
                  store.doLoad(id)
                } else {
                  props.onSaveClick(id)
                }
              })
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            color={"secondary"}
            sx={{ color: "white", backgroundColor: "#DE350B !important" }}
            id="id_contragent_interactionCancelButton"
            name={'contragent_interactionAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default contragent_interactionPopupForm
