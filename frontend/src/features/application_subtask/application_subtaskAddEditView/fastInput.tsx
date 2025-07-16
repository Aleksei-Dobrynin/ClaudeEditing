import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box, Chip, Typography, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../application_subtaskListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";
import { useNavigate } from "react-router-dom";
import Application_subtaskPopupForm from "./popupForm";

type application_subtaskProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
  application_id: number;
  structure_id?: number
  task_id?: number;
  onSaved?: (id: number) => void;
  disabled?: boolean;
};

const FastInputapplication_subtaskView: FC<application_subtaskProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      store.application_task_id = props.idMain
      storeList.loadapplication_subtasks();
      store.loadtask_statuses();
    }
  }, [props.idMain]);


  useEffect(() => {
    return () => storeList.clearStore()
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [selectedId, setSelectId] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Application_subtaskPopupForm
        openPanel={store.openPanelPopup}
        id={store.id}
        application_id={props.application_id}
        task_id={props.idMain}
        structure_id={props.structure_id}
        onBtnCancelClick={() => store.closePopup()}
        onSaveClick={(id) => {
          store.closePopup()
          if (props.onSaved) {
            props.onSaved(id)
          }
          storeList.loadapplication_subtasks()
        }}
      />
      {/* <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
        <Grid item xs={6} >
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
            Название
          </Typography>
        </Grid>
        <Grid item xs={2} >
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
            Статус
          </Typography>

        </Grid>
        <Grid item xs={3} >
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
            Исполнители
          </Typography>

        </Grid>
        <Grid item xs={1}></Grid>
      </Grid> */}
      <Divider />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Typography variant="h5" sx={{ textAlign: "center", width: "100%", p: 1 }}>
          Выберите статус:
        </Typography>
        {store.task_statuses.map(x => {
          return <MenuItem
            onClick={() => {
              store.changeStatus(selectedId, x.id)
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

      {storeList.data.length === 0 && <Box>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 2 }}>
          Нет подзадач
        </Typography>
      </Box>}
      {storeList.data.map((entity) => {
        const style = { backgroundColor: entity.id === store.id && "#F0F0F0" };
        return (
          <>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={style}
              spacing={1}
              id="id_EmployeeContact_row"
            >
              <Grid item xs={4} sx={{ mt: 1, mb: 1 }}>
                {entity.name}
              </Grid>
              <Grid item xs={2} sx={{ mt: 1, mb: 1 }} >
                <span onClick={() => setSelectId(entity.id)}>
                  <span onClick={handleClick}>
                    <Chip
                      size="small" label={entity.status_name}
                      style={{ background: entity.status_back_color, color: entity.status_text_color, cursor: "pointer" }}
                    />
                  </span>
                </span>

              </Grid>
              <Grid item xs={5} sx={{ mt: 1, mb: 1 }} >
                {entity.employees}
              </Grid>
              <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                {storeList.isEdit === false && (
                  <>
                    <IconButton
                      id="id_EmployeeContactEditButton"
                      name="edit_button"
                      style={{ margin: 0, marginRight: 5, padding: 0 }}
                      disabled={props.disabled}
                      onClick={() => {
                        store.onEditClicked(entity.id)
                        // navigate(`/user/application_subtask/addedit?id=${entity.id}`)
                      }}
                    >
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      id="id_EmployeeContactDeleteButton"
                      disabled={props.disabled}
                      name="delete_button"
                      style={{ margin: 0, padding: 0 }}
                      onClick={() => storeList.deleteapplication_subtask(entity.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Grid>
            </Grid>
            <Divider />
          </>
        );
      })}

      {storeList.isEdit ? (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item md={4} xs={12}>
            <CustomTextField
              value={store.name}
              onChange={(event) => store.handleChange(event)}
              name="name"
              data-testid="id_f_application_subtask_name"
              id='id_f_application_subtask_name'
              label={translate('label:application_subtaskAddEditView.name')}
              helperText={store.errors.name}
              error={!!store.errors.name}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <CustomTextField
              value={store.description}
              onChange={(event) => store.handleChange(event)}
              name="description"
              data-testid="id_f_application_subtask_description"
              id='id_f_application_subtask_description'
              label={translate('label:application_subtaskAddEditView.description')}
              helperText={store.errors.description}
              error={!!store.errors.description}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <LookUp
              value={store.type_id}
              onChange={(event) => store.handleChange(event)}
              name="type_id"
              data={store.task_types}
              id='id_f_application_task_type_id'
              label={translate('label:application_taskAddEditView.type_id')}
            />
          </Grid>
          <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
            <CustomButton
              variant="contained"
              size="small"
              disabled={props.disabled}
              id="id_application_subtaskSaveButton"
              sx={{ mr: 1 }}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  storeList.setFastInputIsEdit(false);
                  storeList.loadapplication_subtasks();
                  store.clearStore();
                });
              }}
            >
              {translate("common:save")}
            </CustomButton>
            <CustomButton
              variant="contained"
              size="small"
              id="id_application_subtaskCancelButton"
              onClick={() => {
                storeList.setFastInputIsEdit(false);
                store.clearStore();
              }}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Grid>
        </Grid>
      ) : (
        <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
          <CustomButton
            variant="contained"
            size="small"
            id="id_application_subtaskAddButton"
            disabled={props.disabled}
            onClick={() => {
              store.onEditClicked(0)
              // navigate(`/user/application_subtask/addedit?id=${0}&task_id=${props.idMain}`)
            }}
          >
            {translate("common:add")}
          </CustomButton>
        </Grid>
      )}
    </Box>
  );
});

export default FastInputapplication_subtaskView;
