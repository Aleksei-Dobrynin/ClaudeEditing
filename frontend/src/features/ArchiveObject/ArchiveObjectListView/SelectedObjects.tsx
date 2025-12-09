import React, { FC } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Alert,
  Collapse
} from "@mui/material";
import { 
  Close as CloseIcon,
  Merge as MergeIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import { observer } from "mobx-react";
import store from "./store";
import CustomButton from "components/Button";

interface SelectedObjectsPanelProps {}

const SelectedObjectsPanel: FC<SelectedObjectsPanelProps> = observer(() => {
  if (!store.combineObjectsMode) {
    return null;
  }

  return (
    <Collapse in={store.combineObjectsMode}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mb: 2, 
          border: '2px solid #1976d2',
          bgcolor: '#f8f9ff'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="primary">
            🔗 Режим объединения объектов
          </Typography>
          <IconButton 
            onClick={store.cancelCombineMode}
            size="small"
            color="error"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {store.selectedObjects.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Выберите объекты для объединения. Минимум 2 объекта.
          </Alert>
        ) : (
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Выбрано объектов: {store.selectedObjects.length}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {store.selectedObjects.map((obj) => (
                <Chip
                  key={obj.id}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {obj.doc_number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {obj.address?.length > 30 ? obj.address?.substring(0, 30) + '...' : obj.address}
                      </Typography>
                    </Box>
                  }
                  onDelete={() => store.removeSelectedObject(obj.id)}
                  deleteIcon={<CloseIcon />}
                  color="primary"
                  variant="outlined"
                  sx={{ 
                    height: 'auto',
                    '& .MuiChip-label': {
                      display: 'block',
                      whiteSpace: 'normal',
                      padding: '8px 12px'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Box display="flex" gap={2} justifyContent="flex-end">
          <CustomButton
            variant="outlined"
            onClick={store.cancelCombineMode}
            startIcon={<CancelIcon />}
          >
            Отмена
          </CustomButton>
          
          <CustomButton
            variant="contained"
            color="primary"
            disabled={!store.canCombineObjects()}
            onClick={store.openCombinePopup}
            startIcon={<MergeIcon />}
          >
            Объединить ({store.selectedObjects.length})
          </CustomButton>
        </Box>

        {store.selectedObjects.length > 0 && store.selectedObjects.length < 2 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Для объединения необходимо выбрать минимум 2 объекта
          </Alert>
        )}
      </Paper>
    </Collapse>
  );
});

export default SelectedObjectsPanel;