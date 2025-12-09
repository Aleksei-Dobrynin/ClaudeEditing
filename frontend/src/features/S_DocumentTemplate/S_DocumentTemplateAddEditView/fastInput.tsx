import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../S_DocumentTemplateListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type S_DocumentTemplateProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<S_DocumentTemplateProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadS_DocumentTemplates();
    }
  }, [props.idMain]);

  const columns = [
    {
                    field: 'name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.name"),
                },
                {
                    field: 'description',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.description"),
                },
                {
                    field: 'code',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.code"),
                },
                {
                    field: 'idCustomSvgIconNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.idCustomSvgIcon"),
                },
                {
                    field: 'iconColor',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.iconColor"),
                },
                {
                    field: 'idDocumentTypeNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:SmProjectTagListView.idDocumentType"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="S_DocumentTemplate_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:S_DocumentTemplateAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteS_DocumentTemplate(entity.id)}
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
                      data-testid="id_f_S_DocumentTemplate_name"
                      id='id_f_S_DocumentTemplate_name'
                      label={translate('label:S_DocumentTemplateAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_S_DocumentTemplate_description"
                      id='id_f_S_DocumentTemplate_description'
                      label={translate('label:S_DocumentTemplateAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_S_DocumentTemplate_code"
                      id='id_f_S_DocumentTemplate_code'
                      label={translate('label:S_DocumentTemplateAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idCustomSvgIcon}
                      onChange={(event) => store.handleChange(event)}
                      name="idCustomSvgIcon"
                      data={store.CustomSvgIcons}
                      id='id_f_S_DocumentTemplate_idCustomSvgIcon'
                      label={translate('label:S_DocumentTemplateAddEditView.idCustomSvgIcon')}
                      helperText={store.errors.idCustomSvgIcon}
                      error={!!store.errors.idCustomSvgIcon}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.iconColor}
                      onChange={(event) => store.handleChange(event)}
                      name="iconColor"
                      data-testid="id_f_S_DocumentTemplate_iconColor"
                      id='id_f_S_DocumentTemplate_iconColor'
                      label={translate('label:S_DocumentTemplateAddEditView.iconColor')}
                      helperText={store.errors.iconColor}
                      error={!!store.errors.iconColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idDocumentType}
                      onChange={(event) => store.handleChange(event)}
                      name="idDocumentType"
                      data={store.S_DocumentTemplateTypes}
                      id='id_f_S_DocumentTemplate_idDocumentType'
                      label={translate('label:S_DocumentTemplateAddEditView.idDocumentType')}
                      helperText={store.errors.idDocumentType}
                      error={!!store.errors.idDocumentType}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_S_DocumentTemplateSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadS_DocumentTemplates();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_S_DocumentTemplateCancelButton"
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
                id="id_S_DocumentTemplateAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
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
