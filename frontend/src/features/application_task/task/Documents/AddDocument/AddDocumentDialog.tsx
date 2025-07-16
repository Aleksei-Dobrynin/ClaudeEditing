

// ===================================
// AddDocumentDialog.tsx
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
import LookUp from 'components/LookUp';
import { useTranslation } from 'react-i18next';
import AutocompleteCustom from 'components/Autocomplete';

interface AddDocumentDialogProps {
  stepId: number;
  onSuccess: () => void;
}

const AddDocumentDialog: FC<AddDocumentDialogProps> = observer(({ stepId, onSuccess }) => {
  const { t } = useTranslation();
  const translate = t;
  const store = documentFormsStore;

  return (
    <Dialog
      open={store.documentDialogOpen}
      onClose={() => store.closeDocumentDialog()}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Добавить документ
        <IconButton
          aria-label="close"
          onClick={() => store.closeDocumentDialog()}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <AutocompleteCustom
            helperText={""}
            id="id_f_ApplicationFilter_post_id"
            label={translate("Выберите документ")}
            fieldNameDisplay={(f) => f.name}
            value={store.documentForm.documentTypeId}
            onChange={(e) => store.setDocumentFormField('documentTypeId', e.target.value)}
            name="post_id"
            data={store.documentTypes}
          />
          <AutocompleteCustom
            helperText={""}
            id="id_f_ApplicationFilter_structure_id"
            label={translate("Выберите структуру")}
            fieldNameDisplay={(f) => f.name}
            value={store.documentForm.departmentId}
            onChange={(e) => store.setDocumentFormField('departmentId', e.target.value)}
            name="post_id"
            data={store.departments}
          />
          <AutocompleteCustom
            helperText={""}
            id="id_f_ApplicationFilter_positionId"
            label={translate("Выберите должность")}
            fieldNameDisplay={(f) => f.name}
            value={store.documentForm.positionId}
            onChange={(e) => store.setDocumentFormField('positionId', e.target.value)}
            name="post_id"
            data={store.positions}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => store.closeDocumentDialog()} color="inherit">
          Отмена
        </Button>
        <Button
          onClick={() => store.addDocument(stepId, onSuccess)}
          variant="contained"
          disabled={!store.isDocumentFormValid}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default AddDocumentDialog;
