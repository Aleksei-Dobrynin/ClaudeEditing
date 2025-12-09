import { FC, useEffect } from 'react';
import Basestructure_report_field_configView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@mui/material';
import CustomButton from 'components/Button';
// import MtmTabs from "./mtmTabs";


type PopupFormProps = {
  openPanel: boolean;
  id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
  idReportConfig: number;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
    store.structure_report_id = props.idReportConfig
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:structure_report_field_configAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <Basestructure_report_field_configView
          isPopup={true}
        >
        </Basestructure_report_field_configView>
      {/* {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>} */}

      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_structure_report_field_configSaveButton"
            name={'structure_report_field_configAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_structure_report_field_configCancelButton"
            name={'structure_report_field_configAddEditView.cancel'}
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
