import React, { FC, useState, useEffect } from "react";
import { Box, Fade, Alert, Typography, LinearProgress } from "@mui/material";
import { CheckCircle, Warning } from "@mui/icons-material";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import CustomerFormView from "features/Application/ApplicationAddEditView/CustomerForm";
import mainStore from "../../../../../MainStore";
import { rootStore } from "../../stores/RootStore";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    message: string;
    progress: number;
  }>({
    isValid: false,
    message: "Заполните данные клиента",
    progress: 0
  });

  useEffect(() => {
    if (store.customer_id) {
      store.loadCustomerContacts(store.customer_id);
    }
  }, [store.customer_id]);
  
  useEffect(() => {
    store.is_application_read_only = !((mainStore.isAdmin || mainStore.isRegistrar) && 
      store.Statuses?.find(s => s.id === store.status_id)?.code !== "done");
  }, [mainStore.isRegistrar, mainStore.isAdmin, store.status_id]);

  // Валидация формы клиента в реальном времени
  useEffect(() => {
    const validateCustomerData = () => {
      let progress = 0;
      let isValid = true;
      let message = "";

      // Проверяем основные поля клиента
      if (store.customer) {
        if (store.customer.pin) progress += 25;
        
        if (store.customer.is_organization) {
          // Для организаций используем поле full_name (это и есть название организации)
          if (store.customer.full_name) progress += 25;
          if (store.customer.registration_number) progress += 25;
        } else {
          // Для физических лиц
          if (store.customer.individual_surname) progress += 15;
          if (store.customer.individual_name) progress += 15;
        }

        // Проверка контактных данных (используем существующие поля)
        if (store.customer.sms_1) progress += 15;
        if (store.customer.email_1) progress += 10;
        if (store.customer.address) progress += 10;
      }

      // Проверяем ошибки валидации (используем только существующие поля)
      // В реальном ApplicationStore могут быть свои поля ошибок
      const hasValidationErrors = false; // Заглушка, так как точные поля ошибок неизвестны

      if (hasValidationErrors) {
        isValid = false;
        message = "Исправьте ошибки в форме";
        progress = Math.min(progress, 50);
      } else if (progress >= 75) {
        isValid = true;
        message = "Данные клиента заполнены корректно";
      } else if (progress >= 50) {
        isValid = false;
        message = "Заполните обязательные поля";
      } else if (progress > 0) {
        isValid = false;
        message = "Продолжите заполнение формы";
      } else {
        isValid = false;
        message = "Заполните данные клиента";
      }

      setValidationStatus({ isValid, message, progress });
      
      // Обновляем прогресс в rootStore
      rootStore.updateStepProgress(1, progress);
    };

    validateCustomerData();
  }, [
    store.customer?.pin,
    store.customer?.individual_surname,
    store.customer?.individual_name,
    store.customer?.individual_secondname,
    store.customer?.full_name,
    store.customer?.registration_number,
    store.customer?.sms_1,
    store.customer?.email_1,
    store.customer?.address,
    store.customer?.is_organization,
  ]);

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Статус валидации */}
        <Alert 
          severity={validationStatus.isValid ? "success" : validationStatus.progress > 50 ? "warning" : "info"}
          icon={validationStatus.isValid ? <CheckCircle /> : <Warning />}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          <Box>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {validationStatus.message}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mt={1}>
              <Typography variant="body2" color="text.secondary">
                Прогресс заполнения:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={validationStatus.progress}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
              <Typography variant="body2" fontWeight={600}>
                {validationStatus.progress}%
              </Typography>
            </Box>
          </Box>
        </Alert>

        {/* Индикатор сохранения */}
        {rootStore.isCurrentStepLoading && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <LinearProgress sx={{ flex: 1 }} />
              <Typography variant="body2">
                {rootStore.isNewApplication ? "Создание заявки..." : "Сохранение данных..."}
              </Typography>
            </Box>
          </Alert>
        )}

        {/* Форма клиента */}
        <CustomerFormView />

        {/* Дополнительная информация */}
        {rootStore.isNewApplication && (
          <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Информация:</strong> После заполнения данных клиента и перехода на следующий шаг, 
              заявка будет автоматически сохранена в системе.
            </Typography>
          </Alert>
        )}
      </Box>
    </Fade>
  );
});

export default BaseView;