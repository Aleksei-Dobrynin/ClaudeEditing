import React, { FC, useEffect } from "react";
import { useLocation } from "react-router";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import storeOtherTasks from "./../other_tasks/store"
import LayoutStore from 'layouts/MainLayout/store'
import CreateIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Create";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import styled from "styled-components";
import dayjs from "dayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomButton from "components/Button";
import AutocompleteCustom from "components/Autocomplete";
import TaskTabs from "./Tabs";
import Application_taskPopupForm from './../application_taskAddEditView/popupForm'
import MainStore from "MainStore";
import CheckList from "./CheckList";
import Architecture_processPopupForm from "features/architecture_process/architecture_processAddEditView/popupForm";
import { APPLICATION_STATUSES } from "constants/constant";
import { IconPrinter } from "@tabler/icons-react";
import StructureTemplatesPrintView from 'features/org_structure_templates/structures_templates';
import OtherTasksFastInputView from "../other_tasks/fastInput";
import TasksFastInputView from "../application_taskAddEditView/fastInput";
import TaskListView from "./TaskList";

type CardTaskProps = {};

const CardTask: FC<CardTaskProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const [isDisabled, setIsDisabled] = React.useState<boolean>(false);

  // useEffect(() => {
  //   const result = !(MainStore.isAdmin || MainStore.isHeadStructure || store.task_assigneeIds.includes(LayoutStore.employee_id) || (store.application_resolved && !MainStore.isAdmin));
  //   setIsDisabled(result);
  // }, []);

  let filteredStatuses = store.Statuses.filter(s =>
    store.ApplicationRoads.some(ar => ar.from_status_id === store.Application.status_id && ar.to_status_id === s.id && ar.is_active === true));

  const deadline = () => {

    if (!store.deadline) {
      return (
        <Chip
          size="small"
          label={translate("label:application_taskListView.no_deadline")}
          style={{ background: '#9e9e9e', color: '#ffffff' }}
        />
      );
    }

    const daysLeft = dayjs(store.deadline).diff(dayjs(), 'day');

    let backgroundColor = '';
    if (daysLeft > 5) {
      backgroundColor = '#4caf50'; // больше 5
    } else if (daysLeft >= 0) {
      backgroundColor = '#ffeb3b'; // меньше 5
    } else {
      backgroundColor = '#f44336'; // дедлайн прошёл
    }

    return (
      <Chip
        size="small"
        label={dayjs(store.deadline).format('DD.MM.YYYY')}
        style={{ background: backgroundColor, color: store.status_textcolor }}
      />
    );
  }

  return (
    <MainContent>


      {/* <Paper elevation={7} variant="outlined">
        <Card>
          <CardContent>
            <Grid container>
              <Grid item md={9} xs={8} sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "nowrap",
                justifyContent: "space-between",
              }}>
                <div>
                  <Application_taskPopupForm
                    openPanel={store.openPanelEditTask}
                    id={store.current_id}
                    idMain={store.application_id}
                    onBtnCancelClick={() => store.onEditTaskClicked(false)}
                    onSaveClick={(id) => {
                      if (store.current_id === 0) {
                        store.onAddTaskClicked(false)
                        storeOtherTasks.loadapplication_tasks()
                      } else {
                        store.onEditTaskClicked(false)
                        store.loadapplication_task()
                      }
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                      <span>
                        {translate("label:application_taskListView.entityTitleOne")} {store.name}
                        <Tooltip title={translate("label:application_taskListView.Edit_task")}>
                          <IconButton disabled={store.isDisabled} size="small" onClick={() => store.onEditTaskClicked(true)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </span>
                    </Typography>
                    <Typography sx={{ fontSize: '12px' }}>
                      <span>
                        {store.comment}
                      </span>
                    </Typography>
                  </Box>


                  <Box display="flex" justifyContent={"space-between"} alignItems={"center"} sx={{ mb: 1, mt: 1 }}>

                    <Typography sx={{ fontSize: '14px' }}>
                      {translate("label:application_taskListView.Due_date")} - {deadline()}
                    </Typography>
                    <Box sx={{ minWidth: "225px" }}>
                      <CustomButton
                        customColor={"#718fb8"}
                        size="small"
                        variant="contained"
                        disabled={store.isDisabled}
                        sx={{ mb: "5px", mr: 1 }}
                        onClick={handleClick}
                        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      >
                        {`${translate("Статус задачи: ")}${store.task_statuses.find(s => s.id === store.status_id)?.name}`}
                      </CustomButton>
                    </Box>
                    {store.task_statuses?.length > 0 &&
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                      >
                        <Typography variant="h5" sx={{ textAlign: "center", width: "100%", p: 1 }}>
                          {translate("label:application_taskListView.Select_status")}
                        </Typography>
                        {store.task_statuses.map(x => {
                          return <MenuItem
                            key={x.id}
                            onClick={() => {
                              store.changeTaskStatus(x.id, store.id)
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
                          >
                            {x.name}
                          </MenuItem>
                            ;
                        })}
                      </Menu>
                    }

                  </Box>

                  <Divider /><br />

                  <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '14px' }}>
                      <span>
                        {store.structure_idNavName}
                      </span>
                    </Typography>
                  </Box>

                  <Box display={"flex"} alignItems={"center"}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {`${translate("Исполнители")}: `}
                    </Typography>
                    <Box>
                      {store.task_assignees.map(x =>
                        <Tooltip key={x.id} title={<Box>
                          {x.employee_ocupation}<br />
                          {translate("label:application_taskListView.Appointed_to")} {x.created_at && dayjs(x.created_at).format('DD.MM.YYYY HH:mm')}
                        </Box>}>
                          <Chip disabled={!(MainStore.isAdmin || MainStore.isHeadStructure || store.task_assigneeIds.includes(LayoutStore.employee_id))} label={x.employee_name} sx={{ ml: 1, mb: 1 }} onDelete={() => store.deleteapplication_task_assignee(x.id)} />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  {store.addAssigneePanel ? <Box display={"flex"} alignItems={"center"} sx={{ m: 2 }}>
                    <Box sx={{ width: "500px" }}>
                      <AutocompleteCustom
                        value={store.structure_employee_id}
                        onChange={(event) => store.handleChange(event)}
                        name="structure_employee_id"
                        data={store.employeeInStructure}
                        fieldNameDisplay={(field) => field.employee_name + " - " + field.post_name}
                        data-testid="id_f_application_task_assignee_structure_employee_id"
                        id='id_f_application_task_assignee_structure_employee_id'
                        label={translate('label:application_task_assigneeAddEditView.structure_employee_id')}
                        helperText={store.errors.structure_employee_id}
                        error={!!store.errors.structure_employee_id}
                      />
                    </Box>
                    <Tooltip title="Сохранить">
                      <IconButton disabled={store.isDisabled} onClick={() => store.onAddAssigneeDoneClick()}>
                        <DoneIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Отменить">
                      <IconButton onClick={() => store.onAddAssigneeCancelClick()}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                    :
                    <Tooltip title="Добавить исполнителья">
                      <IconButton disabled={store.isDisabled} onClick={() => store.onAddAssigneeClick()}>
                        <CreateIcon />
                      </IconButton>
                    </Tooltip>}
                </div>
                <div>
                  <CustomButton variant="contained" style={{ width: "150px" }} onClick={() => store.onOpenStructureTemplates()}>
                  {translate("common:print")} <IconPrinter style={{ marginLeft: "20px" }} stroke={2} />
                </CustomButton>
                  <StructureTemplatesPrintView
                    openPanel={store.isOpenStructureTemplates}
                    onBtnCancelClick={() => store.onCloseStructureTemplates()}
                    application_id={store.application_id}
                    structure_id={store.structure_id} />
                </div>
              </Grid>
              <Grid item md={3} xs={4}>
                {(store.Application.status_code === APPLICATION_STATUSES.document_issued ||
                  store.Application.status_code === APPLICATION_STATUSES.refusal_issued) &&
                  (store.Application.arch_process_id === null ? <CustomButton variant="contained" onClick={() => store.onProcessClick(true)}>
                    Передать в ЦиДП
                  </CustomButton> :
                    <Typography sx={{ fontSize: '14px', ml: 2 }}>
                      Передан в ЦиДП
                    </Typography>)
                }
              </Grid>
            </Grid>
          </CardContent>

          <Architecture_processPopupForm
            application_id={store.application_id}
            openPanel={store.openPanelProcess}
            onBtnCancelClick={() => store.onProcessClick(false)}
            onSaveClick={() => {
              store.onProcessClick(false)
              store.loadAppication(store.application_id);
            }}
          />
        </Card>
      </Paper> */}

      {store.id > 0 && <TaskListView />}
      {/* 
      <Paper elevation={7} variant="outlined" sx={{ mt: 2 }}>
        <Card>
          <CardContent>
            <TaskTabs />
          </CardContent>
        </Card>
      </Paper> */}

    </MainContent>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`

const MainContent = styled.div`
`


export default CardTask