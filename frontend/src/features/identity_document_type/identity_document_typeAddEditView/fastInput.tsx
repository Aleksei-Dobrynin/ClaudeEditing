import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../identity_document_typeListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type identity_document_typeProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<identity_document_typeProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadidentity_document_types();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'name',
      width: null, //or number from 1 to 12
      headerName: translate("label:identity_document_typeListView.name"),
    },
    {
      field: 'code',
      width: null, //or number from 1 to 12
      headerName: translate("label:identity_document_typeListView.code"),
    },
    {
      field: 'description',
      width: null, //or number from 1 to 12
      headerName: translate("label:identity_document_typeListView.description"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="identity_document_type_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:identity_document_typeAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteidentity_document_type(entity.id)}
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
                <CustomTextField
                  value={store.name}
                  onChange={(event) => store.handleChange(event)}
                  name="name"
                  data-testid="id_f_identity_document_type_name"
                  id='id_f_identity_document_type_name'
                  label={translate('label:identity_document_typeAddEditView.name')}
                  helperText={store.errors.name}
                  error={!!store.errors.name}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.code}
                  onChange={(event) => store.handleChange(event)}
                  name="code"
                  data-testid="id_f_identity_document_type_code"
                  id='id_f_identity_document_type_code'
                  label={translate('label:identity_document_typeAddEditView.code')}
                  helperText={store.errors.code}
                  error={!!store.errors.code}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description}
                  onChange={(event) => store.handleChange(event)}
                  name="description"
                  data-testid="id_f_identity_document_type_description"
                  id='id_f_identity_document_type_description'
                  label={translate('label:identity_document_typeAddEditView.description')}
                  helperText={store.errors.description}
                  error={!!store.errors.description}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_identity_document_typeSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadidentity_document_types();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_identity_document_typeCancelButton"
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
                id="id_identity_document_typeAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                  // store.project_id = props.idMain;
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
