import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../work_schedule_exceptionListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type work_schedule_exceptionProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<work_schedule_exceptionProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadwork_schedule_exceptions();
    }
  }, [props.idMain]);

  const columns = [
    {
                    field: 'date_start',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.date_start"),
                },
                {
                    field: 'date_end',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.date_end"),
                },
                {
                    field: 'name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.name"),
                },
                {
                    field: 'schedule_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.schedule_id"),
                },
                {
                    field: 'is_holiday',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.is_holiday"),
                },
                {
                    field: 'time_start',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.time_start"),
                },
                {
                    field: 'time_end',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.time_end"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="work_schedule_exception_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:work_schedule_exceptionAddEditView.entityTitle")}</h3>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_EmployeeContact_" + col.field;
              if (col.width == null) {
                return (
                  <Grid id={id} item xs sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
              } else
                return (
                  <Grid id={id} item xs={null} sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
            })}
            <Grid item xs={1}></Grid>
          </Grid>
          <Divider />

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
                  {columns.map((col) => {
                    const id = "id_EmployeeContact_" + col.field + "_value";
                    if (col.width == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else
                      return (
                        <Grid item xs={col.width} id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                  })}
                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    {storeList.isEdit === false && (
                      <>
                        <IconButton
                          id="id_EmployeeContactEditButton"
                          name="edit_button"
                          style={{ margin: 0, marginRight: 5, padding: 0 }}
                          onClick={() => {
                            storeList.setFastInputIsEdit(true);
                            store.doLoad(entity.id);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          id="id_EmployeeContactDeleteButton"
                          name="delete_button"
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deletework_schedule_exception(entity.id)}
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
              
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date_start}
                      onChange={(event) => store.handleChange(event)}
                      name="date_start"
                      id='id_f_work_schedule_exception_date_start'
                      label={translate('label:work_schedule_exceptionAddEditView.date_start')}
                      helperText={store.errors.date_start}
                      error={!!store.errors.date_start}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date_end}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                      id='id_f_work_schedule_exception_date_end'
                      label={translate('label:work_schedule_exceptionAddEditView.date_end')}
                      helperText={store.errors.date_end}
                      error={!!store.errors.date_end}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_work_schedule_exception_name"
                      id='id_f_work_schedule_exception_name'
                      label={translate('label:work_schedule_exceptionAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_holiday}
                      onChange={(event) => store.handleChange(event)}
                      name="is_holiday"
                      label={translate('label:work_schedule_exceptionAddEditView.is_holiday')}
                      id='id_f_work_schedule_exception_is_holiday'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.time_start}
                      onChange={(event) => store.handleChange(event)}
                      name="time_start"
                      id='id_f_work_schedule_exception_time_start'
                      label={translate('label:work_schedule_exceptionAddEditView.time_start')}
                      helperText={store.errors.time_start}
                      error={!!store.errors.time_start}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.time_end}
                      onChange={(event) => store.handleChange(event)}
                      name="time_end"
                      id='id_f_work_schedule_exception_time_end'
                      label={translate('label:work_schedule_exceptionAddEditView.time_end')}
                      helperText={store.errors.time_end}
                      error={!!store.errors.time_end}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_work_schedule_exceptionSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadwork_schedule_exceptions();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_work_schedule_exceptionCancelButton"
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
                id="id_work_schedule_exceptionAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                  store.schedule_id = props.idMain;
                }}
              >
                {translate("common:add")}
              </CustomButton>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
});

export default FastInputView;
