import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../application_subtask_assigneeListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";
import AutocompleteCustom from "components/Autocomplete";
import subTaskstore from "../../application_subtask/application_subtaskAddEditView/store"
import dayjs from "dayjs";

type application_subtask_assigneeProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputapplication_subtask_assigneeView: FC<application_subtask_assigneeProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadapplication_subtask_assignees();
    }
    if (subTaskstore.structure_id !== 0 && subTaskstore.structure_id !== null) {
      store.structure_id = subTaskstore.structure_id
      store.loadEmployeeInStructure(store.structure_id)
    }
  }, [props.idMain, subTaskstore.structure_id]);

 
  const columns = [
    {
      field: 'employee_name',
      width: null, //or number from 1 to 12
      headerName: translate("label:application_subtask_assigneeListView.structure_employee_id"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:application_subtask_assigneeListView.created_at"),
      render: (field: any) => {
        return field.created_at ? dayjs(field.created_at).format("DD.MM.YYYY") : "";
      }
    },
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="application_subtask_assignee_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:application_subtask_assigneeAddEditView.entityTitle")}</h3>
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
                    let res = entity[col.field]
                    if(col.render){
                      res = col.render(entity)
                    }
                    const id = "id_EmployeeContact_" + col.field + "_value";
                    if (col.width == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {res}
                        </Grid>
                      );
                    } else
                      return (
                        <Grid item xs={col.width} id={id} sx={{ m: 1 }}>
                          {res}
                        </Grid>
                      );
                  })}
                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    {storeList.isEdit === false && (
                      <>
                        {/* <IconButton
                          id="id_EmployeeContactEditButton"
                          name="edit_button"
                          style={{ margin: 0, marginRight: 5, padding: 0 }}
                          onClick={() => {
                            storeList.setFastInputIsEdit(true);
                            store.doLoad(entity.id);
                          }}
                        >
                          <CreateIcon />
                        </IconButton> */}
                        <IconButton
                          id="id_EmployeeContactDeleteButton"
                          name="delete_button"
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deleteapplication_subtask_assignee(entity.id)}
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
                <AutocompleteCustom
                  value={store.structure_employee_id}
                  onChange={(event) => store.handleChange(event)}
                  name="structure_employee_id"
                  data={store.employeesInStructure} 
                  fieldNameDisplay={(field) => field.employee_name + " - " + field.post_name}
                  id='id_f_application_subtask_assignee_structure_employee_id'
                  label={translate('label:application_subtask_assigneeAddEditView.structure_employee_id')}
                  helperText={store.errors.structure_employee_id}
                  error={!!store.errors.structure_employee_id}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_application_subtask_assigneeSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadapplication_subtask_assignees();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  color={"secondary"}
                  sx={{ color: "white", backgroundColor: "#DE350B !important" }}
                  size="small"
                  id="id_application_subtask_assigneeCancelButton"
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
                id="id_application_subtask_assigneeAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                  store.application_subtask_id = props.idMain;
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

export default FastInputapplication_subtask_assigneeView;
