import { FC, useEffect } from 'react';
import Org_structure_templatesAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  structure_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const org_structure_templatesPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.handleChange({ target: { value: props.structure_id, name: "structure_id" } })
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:org_structure_templatesAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <Org_structure_templatesAddEditBaseView
          isPopup={true}
        >
        </Org_structure_templatesAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <CustomButton
          variant="contained"
          id="id_org_structure_templatesSaveButton"
          name={'org_structure_templatesAddEditView.save'}
          onClick={() => {
            store.onSaveClick((id: number) => props.onSaveClick(id))
          }}
        >
          {translate("common:save")}
        </CustomButton>
        <CustomButton
          variant="contained"
          id="id_org_structure_templatesCancelButton"
          name={'org_structure_templatesAddEditView.cancel'}
          onClick={() => props.onBtnCancelClick()}
        >
          {translate("common:cancel")}
        </CustomButton>
      </DialogActions >
    </Dialog >
  );
})

export default org_structure_templatesPopupForm
