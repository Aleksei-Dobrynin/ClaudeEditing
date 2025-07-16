
// ===================================
// AddSignerDialog.tsx
import React, { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { observer } from 'mobx-react';
import documentFormsStore from './documentFormsStore';
import AutocompleteCustom from 'components/Autocomplete';
import { useTranslation } from 'react-i18next';

interface AddSignerDialogProps {
  stepId: number;
  onSuccess: () => void;
}

const AddSignerDialog: FC<AddSignerDialogProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const store = documentFormsStore;

  return (
    <Dialog
      open={store.signerDialogOpen}
      onClose={() => store.closeSignerDialog()}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Добавить подписанта
        <IconButton
          aria-label="close"
          onClick={() => store.closeSignerDialog()}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <AutocompleteCustom
            helperText={""}
            id="id_f_ApplicationFilter_structure_id"
            label={translate("Выберите структуру")}
            fieldNameDisplay={(f) => f.name}
            value={store.signerForm.departmentId}
            onChange={(e) => store.setSignerFormField('departmentId', e.target.value)}
            name="post_id"
            data={store.departments}
          />
          <AutocompleteCustom
            helperText={""}
            id="id_f_ApplicationFilter_positionId"
            label={translate("Выберите должность")}
            fieldNameDisplay={(f) => f.name}
            value={store.signerForm.positionId}
            onChange={(e) => store.setSignerFormField('positionId', e.target.value)}
            name="post_id"
            data={store.positions}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => store.closeSignerDialog()} color="inherit">
          Отмена
        </Button>
        <Button
          onClick={() => store.addSigner(props.stepId, props.onSuccess)}
          variant="contained"
          disabled={!store.isSignerFormValid}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default AddSignerDialog;