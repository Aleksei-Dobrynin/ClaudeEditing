import React, { FC } from "react";
import { Card, CardContent, Paper, Grid, IconButton, Box, Typography, Chip, Menu, MenuItem, Tooltip, Dialog, DialogContent, DialogActions } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer, useObserver } from "mobx-react";
import CreateIcon from "@mui/icons-material/Add";
import CustomButton from "components/Button";
import dayjs from "dayjs";
import LayoutStore from 'layouts/MainLayout/store'
import MainStore from "MainStore";
import AutocompleteCustom from "components/Autocomplete";
import EditIcon from "@mui/icons-material/Create";
import Application_taskPopupForm from './../application_taskAddEditView/popupForm'
import { TreeTable } from "primereact/treetable";
import { Column } from 'primereact/column';
import mainStore from "MainStore";
import { APPLICATION_STATUSES } from "constants/constant";

type application_taskProps = {
};

const TaskListView: FC<application_taskProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [taskId, setTaskId] = React.useState<number>(0);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setTaskId(0)
  };

  const deadline = (deadline, status_textcolor: string) => {
    if (!deadline) {
      return (
        <Chip
          size="small"
          label={translate("label:application_taskListView.no_deadline")}
          style={{ background: '#9e9e9e', color: '#ffffff' }}
        />
      );
    }
    const daysLeft = dayjs(deadline).diff(dayjs(), 'day');
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
        label={dayjs(deadline).format('DD.MM.YYYY')}
        style={{ background: backgroundColor, color: store.status_textcolor }}
      />
    );
  }


  const hasAccessAdd = MainStore.isAdmin
    // || MainStore.isHeadStructure
    || store.task_assigneeIds.includes(LayoutStore.employee_id)

  const hasAccess = (data) => {
    return true;
    return MainStore.isAdmin || MainStore.isDeputyChief || MainStore.isHeadStructure
      || (data.employees?.find(x => x.employee_id === LayoutStore.employee_id) != null ? true : false)
      || LayoutStore.user_id === data.created_by
      || (LayoutStore.head_of_structures.find(x => x.id === data.structure_id) != null ? true : false)
  }


  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ mb: 1 }}>
        <Typography sx={{ fontSize: '22px', fontWeight: 500 }}>
          Исполнители:
        </Typography>

        <CustomButton
          variant="contained"
          size="small"
          // disabled={!hasAccessAdd}
          id="id_application_taskAddButton"
          onClick={() => {
            if (!store.isAssigned && !MainStore.isAdmin) { // если не назначены
              MainStore.openErrorDialog("Только начальник отдела может добавлять задачу")
              return;
            }
            store.onAddTaskClicked(true)
          }}
        >
          {translate("common:add")}
        </CustomButton>
      </Box>

      <TreeTable value={store.tasks} resizableColumns >
        <Column body={(data) =>
          useObserver(() => (
            <>
              {data.structure_idNavName} <Tooltip title={translate("label:application_taskListView.Edit_task")}>
                <IconButton size="small" onClick={() => {
                  if (!hasAccess(data)) { // если не назначены
                    MainStore.openErrorDialog("Только начальник отдела может редактировать задачу")
                    return;
                  }
                  store.onEditTaskClicked(data.id)
                }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ))} field="structure_idNavName" header={translate("Отдел")}></Column>

        <Column body={(data) =>
          useObserver(() => {
            const hasAcc = hasAccess(data)
            return <div>
              {data.employees?.map(x => {
                const is_head_str = x?.post_code === "head_structure"
                return <Tooltip key={x.id} title={<Box>
                  {x.employee_ocupation}<br />
                  {translate("label:application_taskListView.Appointed_to")} {x.created_at && dayjs(x.created_at).format('DD.MM.YYYY HH:mm')}
                </Box>}>
                  <Chip size="small" label={x.employee_name} sx={{ ml: 1, mb: 1, color: is_head_str && "blue" }} onDelete={hasAcc ? () => store.deleteapplication_task_assignee(x.id) : null} />
                </Tooltip>
              })}
              <Tooltip title="Добавить исполнителья">
                <IconButton onClick={() => {
                  if (!hasAccess(data)) { // если не назначены
                    MainStore.openErrorDialog("Только начальник отдела может добавить исполнителья")
                    return;
                  }
                  store.onAddAssigneeClick(data.id, data.structure_id)
                }}>
                  <CreateIcon />
                </IconButton>
              </Tooltip>
            </div>
          })} field="employees" header={"Сотрудники"}></Column>

        <Column style={{ width: 100 }} body={(data) =>
          useObserver(() => {
            if (!hasAccess(data)) {
              return <Chip size="small" label={data.status_idNavName}
                style={{ background: data.status_back_color, color: data.status_text_color }} />
            }
            return <span onClick={() => setTaskId(data.id)}><span onClick={handleClick}>
              <Chip size="small" label={data.status_idNavName}
                style={{ background: data.status_back_color, color: data.status_text_color, cursor: "pointer" }} />
            </span></span>
          })} field="status_idNavName" header={translate("label:application_taskListView.status_id")}></Column>

        <Column style={{ width: 120 }} body={(data) => {
          return <>{deadline(data.task_deadline, data.status_textcolor)}</>
        }} field="status_idNavName" header={translate("Срок выполнения")}></Column>
      </TreeTable>


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
                store.changeTaskStatus(x.id, taskId)
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

      <Dialog open={store.addAssigneePanelTaskId !== 0} onClose={() => store.onAddAssigneeCancelClick()} maxWidth="sm" fullWidth>
        <DialogContent>

          <Box display={"flex"} alignItems={"center"} sx={{ m: 2 }}>
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

        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_application_taskSaveButton"
            name={'application_taskAddEditView.save'}
            onClick={() => {
              store.onAddAssigneeDoneClick()
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_application_taskCancelButton"
            name={'application_taskAddEditView.cancel'}
            onClick={() => store.onAddAssigneeCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions >
      </Dialog >

      <Application_taskPopupForm
        openPanel={store.openPanelEditTask}
        id={store.current_id}
        idMain={store.application_id}
        onBtnCancelClick={() => store.onAddTaskClicked(false)}
        onSaveClick={(id) => {
          store.onAddTaskClicked(false)
          store.loadTasks()
        }}
      />
    </>
  );
});

export default TaskListView;
