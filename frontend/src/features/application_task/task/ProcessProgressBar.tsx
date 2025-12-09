import React, { useEffect, FC } from "react";
import { observer } from "mobx-react";
import { Box, Stack, Typography, Divider, Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import stepStore from "features/application_task/task/Documents/store";
import taskStore from "./store";

const ProcessProgressBar: FC = observer(() => {
  const nav = useNavigate();

  useEffect(() => {
    if (taskStore.application_id) {
      stepStore.application_id = taskStore.application_id;
      stepStore.loadApplication(taskStore.application_id);
    }
  }, [taskStore.application_id]);

  const openStep = (stepId: number) => {
    taskStore.tab_id = 2;
    taskStore.expandedStepId = stepId;
    nav(
      `/user/application_task/addedit?id=${taskStore.id}&tab_id=1&app_step_id=${stepId}&back=${taskStore.backUrl}`
    );
  };

  const declineDays = (number) => {

    if (!number) return null;
    // Получаем последнюю цифру и последние две цифры числа
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    // Особые случаи для чисел от 11 до 19
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "дней";
    }

    // Для остальных чисел проверяем последнюю цифру
    switch (lastDigit) {
      case 1:
        return "день";
      case 2:
      case 3:
      case 4:
        return "дня";
      default:
        return "дней";
    }
  }

  return (
    <Box sx={{ width: "100%", py: 2, overflowX: "auto" }}>
      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{
        display: "grid",
        gridAutoFlow: "column",
        gridAutoColumns: "minmax(280px, auto)",
        gap: 1,
        width: "100%",
        overflowX: "auto",
        alignItems: "stretch"
      }}>
        {stepStore.data.map((step, idx) => (
          <Stack key={step.id} sx={cardStyle} spacing={2} direction="row">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                bgcolor: "success.main",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {step.order_number}
            </Box>

            <Box>
              <Typography variant="caption" color="black" fontWeight="bold">
                {step.name}
              </Typography>
              <br />
              <Typography variant="caption" color="black">
                {stepStore.departments[step.responsible_department_id]?.name}
              </Typography>
              <br />
              <Typography variant="caption">
                Дата начала {dayjs(step.start_date).format("DD.MM")}
              </Typography>
              <br />
              <Typography variant="caption">
                Дата завершения {step.completion_date ? dayjs(step.completion_date).format("DD.MM") : ""}
              </Typography>
              <br />
              <Typography variant="caption">
                Срок выполнения {dayjs(step.due_date).format("DD.MM")}
              </Typography>
              <br />
              {step.completion_date && step.due_date && (
                dayjs(step.completion_date).isAfter(dayjs(step.due_date)) ? (() => {
                  const delayDays = dayjs(step.completion_date).startOf('day').diff(dayjs(step.due_date).startOf('day'), 'day');
                  return (
                    <Typography variant="caption" color="error" fontWeight="bold">
                      Завершено с опозданием - {delayDays} {declineDays(delayDays)}
                    </Typography>
                  );
                })() : (
                  <Typography variant="caption" color="success.main" fontWeight="bold">
                    Завершено вовремя
                  </Typography>
                )
              )}
              <br />
              {step.documents?.some(d => d.approvals?.some(a => a.status === "signed")) && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ textAlign: "left", mt: 0.5 }}
                >
                  {step.documents
                    .filter(d => d.approvals?.some(a => a.status === "signed"))
                    .map(d => d.upl?.app_doc_name || d.upl?.app_doc_name || "Документ")
                    .join(", ")}
                </Typography>
              )}
              <Button
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => openStep(step.id)}
              >
                Перейти
              </Button>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
});

export default ProcessProgressBar;


const cardStyle = {
  border: "1px solid #e0e0e0",
  p: 1.5,
  borderRadius: 2,
  minHeight: 150,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  minWidth: 280,
  height: "100%"
};