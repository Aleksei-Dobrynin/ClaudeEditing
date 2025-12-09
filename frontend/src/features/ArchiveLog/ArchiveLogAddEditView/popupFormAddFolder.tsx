import { FC, useEffect } from 'react';
import ArchiveLogAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import MainStore from "../../../MainStore";
import CustomTextField from "components/TextField";

type PopupFormAddFolderProps = {
  openPanel: boolean;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const PopupFormAddFolder: FC<PopupFormAddFolderProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      // store.doLoad(props.id)
    } else {
      // store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog maxWidth={'xl'} open={props.openPanel} onClose={props.onBtnCancelClick}>
      <DialogTitle>{translate('Добавить новую запись')}</DialogTitle>
      <DialogContent>

        <Box m={2}>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <CustomTextField
                id="id_f_ArchiveLog_popupDocNumber"
                label={translate("Номер")}
                value={store.popupDocNumber}
                onChange={(event) => store.handleChange(event)}
                name="popupDocNumber"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <CustomTextField
                id="id_f_ArchiveLog_popupAddress"
                label={translate("Адрес")}
                value={store.popupAddress}
                onChange={(event) => store.handleChange(event)}
                name="popupAddress"
              />
            </Grid>
          </Grid>
        </Box>

      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_ArchiveLogSaveButton"
            disabled={!MainStore.isArchive}
            onClick={() => {
              store.onSaveClickObject((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_ArchiveLogCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default PopupFormAddFolder
