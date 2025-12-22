import React from "react";
import { observer } from "mobx-react-lite";
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
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import addServiceDialogStore from "./addServiceDialogStore";

const AddServiceDialog: React.FC = observer(() => {
  const store = addServiceDialogStore;

  return (
    <Dialog
      open={store.isOpen}
      onClose={store.closeDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Добавить шаги из другой услуги</DialogTitle>

      <DialogContent dividers>
        {/* Выбор услуги */}
        <Box mb={3}>
          <FormControl fullWidth error={!!store.errors.service}>
            <InputLabel>Выберите услугу</InputLabel>
            <Select
              value={store.selectedServiceId || ""}
              onChange={(e) => store.selectService(Number(e.target.value))}
              disabled={store.isLoading || store.isSubmitting}
            >
              <MenuItem value="">
                <em>Выберите услугу</em>
              </MenuItem>
              {store.availableServices.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
            {store.errors.service && (
              <Typography color="error" variant="caption">
                {store.errors.service}
              </Typography>
            )}
          </FormControl>
        </Box>

        {/* Предварительный просмотр шагов */}
        {store.selectedService && (
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Будут добавлены следующие шаги:
            </Typography>

            {store.isLoading ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : store.serviceSteps.length > 0 ? (
              <List dense>
                {store.serviceSteps.map((step, index) => (
                  <ListItem key={step.id} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={600}>
                          {index + 1}. {step.name}
                        </Typography>
                      }
                      secondary={
                        <Box mt={0.5}>
                          {/* Организация */}
                          <Typography variant="body2" color="text.secondary">
                            {step.responsible_org_name}
                          </Typography>

                          {/* Документы, которые требуются */}
                          {step.required_documents?.length > 0 && (
                            <Box mt={1}>
                              {step.required_documents.map((doc) => (
                                <Box key={doc.id} mb={1}>
                                  {/* Название документа */}
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    Документ: {doc.document_type_name}
                                  </Typography>

                                  {/* Подписанты */}
                                  {doc.approvers?.length > 0 && (
                                    <List dense disablePadding sx={{ pl: 2 }}>
                                      {doc.approvers.map((appr) => (
                                        <ListItem key={appr.id} disablePadding>
                                          <ListItemText
                                            primary={
                                              <Typography variant="body2">
                                                • {appr.position_name} ({appr.department_name})
                                              </Typography>
                                            }
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="warning">В выбранной услуге нет шагов</Alert>
            )}

            <Typography variant="caption" color="textSecondary" mt={1}>
              Всего шагов: {store.serviceSteps.length}
            </Typography>
          </Box>
        )}

        {/* Информация о вставке */}
        {store.selectedService && (
          <Box mb={3}>
            <Alert severity="info">
              Шаги будут вставлены после текущего шага (шаг №
              {store.currentStepOrderNumber})
            </Alert>
          </Box>
        )}

        {/* Причина добавления */}
        <Box mb={2}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Причина добавления (обязательно)"
            placeholder="Укажите почему необходимо добавить эти шаги..."
            value={store.addReason}
            onChange={(e) => store.setAddReason(e.target.value)}
            error={!!store.errors.reason}
            helperText={
              store.errors.reason ||
              `Минимум 10 символов (введено: ${store.addReason.length})`
            }
            disabled={store.isSubmitting}
            required
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={store.closeDialog}
          disabled={store.isSubmitting}
        >
          Отмена
        </Button>
        <Button
          onClick={store.submitForm}
          variant="contained"
          color="primary"
          disabled={!store.canSubmit}
        >
          {store.isSubmitting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Добавление...
            </>
          ) : (
            "Добавить шаги"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default AddServiceDialog;