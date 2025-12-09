import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../uploaded_application_documentListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type uploaded_application_documentProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<uploaded_application_documentProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loaduploaded_application_documents();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'is_outcome',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.is_outcome"),
    },
    {
      field: 'document_number',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.document_number"),
    },
    {
      field: 'file_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.file_id"),
    },
    {
      field: 'application_document_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.application_document_id"),
    },
    {
      field: 'name',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.name"),
    },
    {
      field: 'service_document_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.service_document_id"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.created_at"),
    },
    {
      field: 'updated_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.created_by"),
    },
    {
      field: 'updated_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:uploaded_application_documentListView.updated_by"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="uploaded_application_document_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:uploaded_application_documentAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteuploaded_application_document(entity.id)}
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
                <CustomCheckbox
                  value={store.is_outcome}
                  onChange={(event) => store.handleChange(event)}
                  name="is_outcome"
                  label={translate('label:uploaded_application_documentAddEditView.is_outcome')}
                  id='id_f_uploaded_application_document_is_outcome'
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.document_number}
                  onChange={(event) => store.handleChange(event)}
                  name="document_number"
                  data-testid="id_f_uploaded_application_document_document_number"
                  id='id_f_uploaded_application_document_document_number'
                  label={translate('label:uploaded_application_documentAddEditView.document_number')}
                  helperText={store.errors.document_number}
                  error={!!store.errors.document_number}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.file_id}
                  onChange={(event) => store.handleChange(event)}
                  name="file_id"
                  data={store.files}
                  id='id_f_uploaded_application_document_file_id'
                  label={translate('label:uploaded_application_documentAddEditView.file_id')}
                  helperText={store.errors.file_id}
                  error={!!store.errors.file_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.application_document_id}
                  onChange={(event) => store.handleChange(event)}
                  name="application_document_id"
                  data={store.applications}
                  id='id_f_uploaded_application_document_application_document_id'
                  label={translate('label:uploaded_application_documentAddEditView.application_document_id')}
                  helperText={store.errors.application_document_id}
                  error={!!store.errors.application_document_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.name}
                  onChange={(event) => store.handleChange(event)}
                  name="name"
                  data-testid="id_f_uploaded_application_document_name"
                  id='id_f_uploaded_application_document_name'
                  label={translate('label:uploaded_application_documentAddEditView.name')}
                  helperText={store.errors.name}
                  error={!!store.errors.name}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.service_document_id}
                  onChange={(event) => store.handleChange(event)}
                  name="service_document_id"
                  data={store.service_documents}
                  id='id_f_uploaded_application_document_service_document_id'
                  label={translate('label:uploaded_application_documentAddEditView.service_document_id')}
                  helperText={store.errors.service_document_id}
                  error={!!store.errors.service_document_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.created_at}
                  onChange={(event) => store.handleChange(event)}
                  name="created_at"
                  id='id_f_uploaded_application_document_created_at'
                  label={translate('label:uploaded_application_documentAddEditView.created_at')}
                  helperText={store.errors.created_at}
                  error={!!store.errors.created_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.updated_at}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_at"
                  id='id_f_uploaded_application_document_updated_at'
                  label={translate('label:uploaded_application_documentAddEditView.updated_at')}
                  helperText={store.errors.updated_at}
                  error={!!store.errors.updated_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.created_by}
                  onChange={(event) => store.handleChange(event)}
                  name="created_by"
                  data-testid="id_f_uploaded_application_document_created_by"
                  id='id_f_uploaded_application_document_created_by'
                  label={translate('label:uploaded_application_documentAddEditView.created_by')}
                  helperText={store.errors.created_by}
                  error={!!store.errors.created_by}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.updated_by}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_by"
                  data-testid="id_f_uploaded_application_document_updated_by"
                  id='id_f_uploaded_application_document_updated_by'
                  label={translate('label:uploaded_application_documentAddEditView.updated_by')}
                  helperText={store.errors.updated_by}
                  error={!!store.errors.updated_by}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_uploaded_application_documentSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loaduploaded_application_documents();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_uploaded_application_documentCancelButton"
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
                id="id_uploaded_application_documentAddButton"
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
