// Путь: frontend/src/components/RoleSelectionDialog.tsx
// НОВЫЙ ФАЙЛ - создать этот файл

import React, { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { AvailableSigningRole } from 'constants/SigningRole';
import { useTranslation } from 'react-i18next';

interface RoleSelectionDialogProps {
  open: boolean;
  roles: AvailableSigningRole[];
  selectedRole: AvailableSigningRole | null;
  onRoleSelect: (role: AvailableSigningRole) => void;
  onConfirm: () => void;
  onCancel: () => void;
  mode?: 'sign' | 'revoke'; // Режим: подписание или отзыв
}

const RoleSelectionDialog: FC<RoleSelectionDialogProps> = ({
  open,
  roles,
  selectedRole,
  onRoleSelect,
  onConfirm,
  onCancel,
  mode = 'sign',
}) => {
  const { t } = useTranslation();

  // Фильтруем роли в зависимости от режима
  const filteredRoles = mode === 'sign'
    ? roles // Для подписания показываем все активные роли
    : roles.filter(r => r.alreadySigned); // Для отзыва - только подписанные

  const allRolesSigned = mode === 'sign' && roles.length > 0 && roles.every(r => r.alreadySigned);

  const handleConfirm = () => {
    if (selectedRole) {
      onConfirm();
    }
  };

  const getTitle = () => {
    if (mode === 'revoke') {
      return 'Выберите подпись для отзыва';
    }
    return 'Выберите роль для подписания';
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        {allRolesSigned && mode === 'sign' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Вы уже подписали этот документ всеми доступными ролями
          </Alert>
        )}

        {filteredRoles.length === 0 && mode === 'revoke' && (
          <Alert severity="warning">
            У вас нет подписей для отзыва
          </Alert>
        )}

        {filteredRoles.length > 0 && (
          <RadioGroup
            value={selectedRole?.structureEmployeeId?.toString() || ''}
            onChange={(e) => {
              const role = filteredRoles.find(
                r => r.structureEmployeeId.toString() === e.target.value
              );
              if (role) {
                onRoleSelect(role);
              }
            }}
          >
            {filteredRoles.map((role) => (
              <Box
                key={role.structureEmployeeId}
                sx={{
                  border: '1px solid',
                  borderColor: selectedRole?.structureEmployeeId === role.structureEmployeeId
                    ? 'primary.main'
                    : 'grey.300',
                  borderRadius: 1,
                  p: 2,
                  mb: 1.5,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => onRoleSelect(role)}
              >
                <FormControlLabel
                  value={role.structureEmployeeId.toString()}
                  control={<Radio />}
                  label={
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {role.positionName}
                        </Typography>
                        
                        {role.alreadySigned && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Подписано"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                        
                        {role.isRequired && !role.alreadySigned && (
                          <Chip
                            icon={<WarningAmberIcon />}
                            label="Требуется"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {role.departmentName}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Box>
            ))}
          </RadioGroup>
        )}

        {mode === 'sign' && selectedRole?.alreadySigned && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Внимание! Вы уже подписали этот документ как {selectedRole.positionName}.
            Подтвердите, что хотите подписать его повторно в другой роли.
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Отмена
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={mode === 'revoke' ? 'error' : 'primary'}
          disabled={!selectedRole || (allRolesSigned && mode === 'sign')}
        >
          {mode === 'revoke' ? 'Отозвать' : 'Подписать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleSelectionDialog;