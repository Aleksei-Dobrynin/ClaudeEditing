import React, { FC } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import styled from "styled-components";
import CustomButton from "components/Button";
import MainStore from "MainStore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LayoutStore from "layouts/MainLayout/store";
import HistoryIcon from "@mui/icons-material/History";
import DoneIcon from '@mui/icons-material/Done';
import dayjs from "dayjs";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NavigationBreadcrumbs from "./NavigationBreadcrumbs"; // Импортируем новый компонент

type MainInformationProps = {
};

const MainInformation: FC<MainInformationProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
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

  let filteredStatuses = store.Statuses.reduce((acc, s) => {
    let matchingRoad = store.ApplicationRoads.find(ar =>
      ar.from_status_id === store.Application.status_id &&
      ar.to_status_id === s.id &&
      ar.is_active === true
    );
    if (matchingRoad) {
      acc.push({
        ...s,
        is_allowed: matchingRoad.is_allowed
      });
    }
    return acc;
  }, []);

  const calculateBackUrl = () => {
    if (store.backUrl === "all") {
      return `/user/all_tasks`
    } else if (store.backUrl === "my") {
      return `/user/my_tasks`
    } else if (store.backUrl === "structure") {
      return `/user/structure_tasks`
    } else {
      return `/user/structure_tasks`
    }
  }

  const hasTechDecision = ((store.tech_decision_id > 0 && store.tech_decision_id != null) && (store.tech_decision_id != store.tech_decisions.find(x => x.code == "reject").id && (store.tech_decision_id != store.tech_decisions.find(x => x.code == "reject_nocouncil").id)))
  const hasTypeObject = store.object_tag_id != null && store.object_tag_id != 0
  const hasCalculation = store.hasCalculation
  const showTypeService = store.StructureTags.filter(x => x.structure_id === store.structure_id).length !== 0
  const hasTypeService = store.structure_tag_id !== null && store.structure_tag_id !== 0
  const hasCoords = store.object_xcoord != 0 && store.object_ycoord != 0
  const isDone = store.is_done;

  const checks = [
    hasTechDecision,
    hasTypeObject,
    hasCalculation,
    showTypeService ? hasTypeService : null,
    hasCoords,
    isDone,
  ].filter(c => c !== null);

  const doneCount = checks.filter(Boolean).length;
  const totalCount = checks.length;

  const progressString = `${doneCount}/${totalCount}`;

  const deadline = dayjs(store.Application.deadline);
  const today = dayjs();
  const diff = deadline.diff(today, 'day');
  const isOverdue = diff < 0;

  // Формируем breadcrumbs на основе backUrl
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      { label: translate("common:home", "Главная"), path: "/user" }
    ];

    if (store.backUrl === "all") {
      breadcrumbs.push({ 
        label: translate("label:ApplicationTaskListView.AllTasks", "Все задачи"), 
        path: "/user/all_tasks" 
      });
    } else if (store.backUrl === "my") {
      breadcrumbs.push({ 
        label: translate("label:ApplicationTaskListView.MyTasks", "Мои задачи"), 
        path: "/user/my_tasks" 
      });
    } else {
      breadcrumbs.push({ 
        label: translate("label:ApplicationTaskListView.StructureTasks", "Задачи отдела"), 
        path: "/user/structure_tasks" 
      });
    }

    // Добавляем текущую заявку
    if (store.application_number) {
      breadcrumbs.push({ 
        label: `${translate("label:ApplicationAddEditView.entityTitle", "Заявка")} #${store.application_number}`,
        path: `/user/application/addedit?id=${store.application_id}`
      });
    }

    // Добавляем текущую задачу (последний элемент без path)
    // if (store.id) {
    //   breadcrumbs.push({ 
    //     label: `${translate("label:application_taskListView.entityTitleOne", "Задача")} #${store.id}`,
    //     path: `/user/task/${store.id}`
    //   });
    // }

    return breadcrumbs;
  };

  return (
    <MainContent>
      <Paper elevation={7} variant="outlined">
        <Card>
          <CardContent>
            {/* Заменяем кнопку "Назад" на NavigationBreadcrumbs */}
            <NavigationBreadcrumbs 
              items={generateBreadcrumbs()}
              onBack={() => navigate(calculateBackUrl())}
              showBackButton={true}
            />

            <Box display={"flex"} justifyContent={"space-between"}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: '24px', fontWeight: 'bold', mt: 1, mb: 1 }}>
                    {store.Customer?.full_name}, {store.Customer?.pin}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>
                    {translate("label:ApplicationAddEditView.registration_date")} {dayjs(store.Application.registration_date).format("DD.MM.YYYY HH:mm")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>
                    Услуга {store.Application.service_name}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  <StyledRouterLink to={`/user/application/addedit?id=${store.application_id}`}>
                    Заявка # {store.application_number}
                  </StyledRouterLink>
                </Typography>
              </Box>
              
              <Box sx={{ mt: 1, mb: 1 }}>
                <Typography
                  sx={{ display: 'flex', alignItems: 'center', color: isOverdue ? "red" : "blue" }}
                >
                  {isOverdue ? (
                    <>
                      <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      Просрочено на {Math.abs(diff)} {declineDays(diff)}
                    </>
                  ) : (
                    <>
                      <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      Осталось {diff} {declineDays(diff)}
                    </>
                  )}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {translate("label:ApplicationAddEditView.deadline")} {dayjs(store.Application.deadline).format("DD.MM.YYYY")}
                </Typography>
              </Box>

              <Box>
                <CustomButton
                  size="small"
                  customColor={"#acb962"}
                  variant="contained"
                  sx={{ mb: "5px", mr: 1, color: "#000000" }}
                  onClick={(event) => {store.isCheckList = true}}
                  endIcon={<DoneIcon />}
                >
                  {progressString}
                </CustomButton>

                <CustomButton
                  customColor={"#718fb8"}
                  size="small"
                  variant="contained"
                  sx={{ mb: "5px", mr: 1 }}
                  onClick={(event) => {
                    if (!store.isAssigned && !MainStore.isAdmin) {
                      MainStore.openErrorDialog("Вы не назначены на задачу")
                      return;
                    }
                    setAnchorEl(event.currentTarget);
                  }}
                  endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                >
                  {`${translate("label:ApplicationAddEditView.status")}${store.Statuses.find(s => s.id === store.Application.status_id)?.name}`}
                </CustomButton>
                
                {filteredStatuses?.length > 0 &&
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    <Typography variant="h5" sx={{ textAlign: "center", width: "100%" }}>
                      {translate("common:Select_status")}
                    </Typography>
                    {store.id > 0 && store.Application.status_id > 0 && filteredStatuses.map(x => {
                      return <MenuItem
                        key={x.id}
                        onClick={() => {
                          store.changeToStatus(x.id, x.code)
                          handleClose()
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#718fb8",
                            color: "#FFFFFF"
                          },
                          "&:hover .MuiListItemText-root": {
                            color: "#FFFFFF"
                          }
                        }}
                        disabled={!x.is_allowed}
                      >
                        {x.name}
                      </MenuItem>;
                    })}
                  </Menu>
                }
                
                <Tooltip title={`${translate("label:HistoryTableListView.entityTitle")} `} arrow>
                  <IconButton
                    id="EmployeeList_Search_Btn"
                    onClick={() => { store.changeApplicationHistoryPanel(true) }}
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </MainContent>
  );
})

const MainContent = styled.div`
`

const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`

export default MainInformation