import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../step_partnerListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type step_partnerProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<step_partnerProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadstep_partners();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'step_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:step_partnerListView.step_id"),
    },
    {
      field: 'partner_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:step_partnerListView.partner_id"),
    },
    {
      field: 'role',
      width: null, //or number from 1 to 12
      headerName: translate("label:step_partnerListView.role"),
    },
    {
      field: 'is_required',
      width: null, //or number from 1 to 12
      headerName: translate("label:step_partnerListView.is_required"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:step_partnerListView.created_at"),
    },
    {
      field: 'updated_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:step_partnerListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:step_partnerListView.created_by"),
    },
    {
      field: 'updated_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:step_partnerListView.updated_by"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="step_partner_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:step_partnerAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletestep_partner(entity.id)}
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
                <LookUp
                  value={store.partner_id}
                  onChange={(event) => store.handleChange(event)}
                  name="partner_id"
                  data={store.contragents}
                  id='id_f_step_partner_partner_id'
                  label={translate('label:step_partnerAddEditView.partner_id')}
                  helperText={store.errors.partner_id}
                  error={!!store.errors.partner_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.role}
                  onChange={(event) => store.handleChange(event)}
                  name="role"
                  data-testid="id_f_step_partner_role"
                  id='id_f_step_partner_role'
                  label={translate('label:step_partnerAddEditView.role')}
                  helperText={store.errors.role}
                  error={!!store.errors.role}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomCheckbox
                  value={store.is_required}
                  onChange={(event) => store.handleChange(event)}
                  name="is_required"
                  label={translate('label:step_partnerAddEditView.is_required')}
                  id='id_f_step_partner_is_required'
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_step_partnerSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadstep_partners();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_step_partnerCancelButton"
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
                id="id_step_partnerAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                  // The step_id is now set automatically in the doLoad method
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