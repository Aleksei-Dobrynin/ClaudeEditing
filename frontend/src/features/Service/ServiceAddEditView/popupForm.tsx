import React, { FC, useEffect } from 'react';
import ServiceAddEditBaseView from './base';
import store from "./store";
import { observer } from "mobx-react";
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Button,
  IconButton,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { FormStyles } from 'styles/FormStyles';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id);
    } else {
      store.clearStore();
    }
  }, [props.openPanel]);

  const handleSave = async () => {
    await store.onSaveClick((id: number) => props.onSaveClick(id));
  };

  return (
    <Dialog 
      open={props.openPanel} 
      onClose={props.onBtnCancelClick}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: FormStyles.sizes.borderRadius,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {translate('label:ServiceAddEditView.entityTitle')}
            {store.id > 0 && (
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                ID: {store.id}
              </Typography>
            )}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={props.onBtnCancelClick}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {store.loading && <LinearProgress />}
      
      <DialogContent dividers>
        <ServiceAddEditBaseView isPopup={true} />
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={props.onBtnCancelClick}
          disabled={store.loading}
        >
          {translate("common:cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!store.isValid || store.loading}
        >
          {translate("common:save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default PopupForm;