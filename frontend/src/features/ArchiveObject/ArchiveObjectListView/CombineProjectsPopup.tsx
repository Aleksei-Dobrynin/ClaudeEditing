import React, { FC, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Grid
} from '@mui/material';
import { observer } from "mobx-react";
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import CustomTextField from 'components/TextField';
import store from "./store";
import { 
  Merge as MergeIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface CombineObjectsPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newDocNumber: string, newAddress: string) => void;
}

const CombineObjectsPopup: FC<CombineObjectsPopupProps> = observer(({ 
  open, 
  onClose, 
  onConfirm 
}) => {
  const { t } = useTranslation();
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [errors, setErrors] = useState({ docNumber: '', address: '' });

  // Сброс полей при открытии
  useEffect(() => {
    if (open) {
      setNewDocNumber('');
      setNewAddress('');
      setErrors({ docNumber: '', address: '' });
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors = { docNumber: '', address: '' };
    let isValid = true;

    if (!newDocNumber.trim()) {
      newErrors.docNumber = 'Номер документа обязателен';
      isValid = false;
    }

    if (!newAddress.trim()) {
      newErrors.address = 'Адрес обязателен';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(newDocNumber.trim(), newAddress.trim());
    }
  };

  const handleClose = () => {
    setNewDocNumber('');
    setNewAddress('');
    setErrors({ docNumber: '', address: '' });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <MergeIcon color="primary" />
          <Typography variant="h6">
            Подтверждение объединения объектов
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Предупреждение */}
        {/* <Alert severity="warning" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon />
            <Typography variant="body2">
              <strong>Внимание!</strong> После объединения выбранные объекты будут объединены в один. 
              Это действие нельзя отменить.
            </Typography>
          </Box>
        </Alert> */}

        {/* Список объектов для объединения */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Объекты для объединения ({store.selectedObjects.length}):
            </Typography>
            <List dense>
              {store.selectedObjects.map((obj, index) => (
                <React.Fragment key={obj.id}>
                  <ListItem sx={{ px: 0 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" fontWeight="medium">
                          #{index + 1}: {obj.doc_number}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {obj.id}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {obj.address}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < store.selectedObjects.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Поля для нового объекта */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Параметры нового объединенного объекта:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  value={newDocNumber}
                  id=""
                  name=""
                  onChange={(e) => {
                    setNewDocNumber(e.target.value);
                    if (errors.docNumber) {
                      setErrors(prev => ({ ...prev, docNumber: '' }));
                    }
                  }}
                  error={!!errors.docNumber}
                  helperText={errors.docNumber}
                  label="Введите номер документа для нового объекта"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <CustomTextField
                  // label="Адрес"
                  value={newAddress}
                  id=""
                  name=""
                  onChange={(e) => {
                    setNewAddress(e.target.value);
                    if (errors.address) {
                      setErrors(prev => ({ ...prev, address: '' }));
                    }
                  }}
                  error={!!errors.address}
                  helperText={errors.address}
                  label="Введите адрес для нового объекта"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Дополнительная информация */}
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Что произойдет:</strong>
          </Typography>
          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
            <li>Будет создан новый объект с указанными данными</li>
            <li>Выбранные объекты будут помечены как объединенные</li>
            {/* <li>Все связанные данные будут перенесены в новый объект</li> */}
          </ul>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <CustomButton
          variant="outlined"
          onClick={handleClose}
          startIcon={<CancelIcon />}
        >
          Отмена
        </CustomButton>
        
        <CustomButton
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          startIcon={<MergeIcon />}
          disabled={!newDocNumber.trim() || !newAddress.trim()}
        >
          Объединить объекты
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
});

export default CombineObjectsPopup;