import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../faq_questionListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type faq_questionProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<faq_questionProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadfaq_questions();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'title',
      width: null, //or number from 1 to 12
      headerName: translate("label:faq_questionListView.title"),
    },
    {
      field: 'answer',
      width: null, //or number from 1 to 12
      headerName: translate("label:faq_questionListView.answer"),
    },
    {
      field: 'video',
      width: null, //or number from 1 to 12
      headerName: translate("label:faq_questionListView.video"),
    },
    {
      field: 'is_visible',
      width: null, //or number from 1 to 12
      headerName: translate("label:faq_questionListView.is_visible"),
    },
    {
      field: 'settings',
      width: null, //or number from 1 to 12
      headerName: translate("label:faq_questionListView.settings"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="faq_question_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:faq_questionAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletefaq_question(entity.id)}
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
                  value={store.title}
                  onChange={(event) => store.handleChange(event)}
                  name="title"
                  data-testid="id_f_faq_question_title"
                  id='id_f_faq_question_title'
                  label={translate('label:faq_questionAddEditView.title')}
                  helperText={store.errors.title}
                  error={!!store.errors.title}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.answer}
                  onChange={(event) => store.handleChange(event)}
                  name="answer"
                  data-testid="id_f_faq_question_answer"
                  id='id_f_faq_question_answer'
                  label={translate('label:faq_questionAddEditView.answer')}
                  helperText={store.errors.answer}
                  error={!!store.errors.answer}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.video}
                  onChange={(event) => store.handleChange(event)}
                  name="video"
                  data-testid="id_f_faq_question_video"
                  id='id_f_faq_question_video'
                  label={translate('label:faq_questionAddEditView.video')}
                  helperText={store.errors.video}
                  error={!!store.errors.video}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomCheckbox
                  value={store.is_visible}
                  onChange={(event) => store.handleChange(event)}
                  name="is_visible"
                  label={translate('label:faq_questionAddEditView.is_visible')}
                  id='id_f_faq_question_is_visible'
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.settings}
                  onChange={(event) => store.handleChange(event)}
                  name="settings"
                  data-testid="id_f_faq_question_settings"
                  id='id_f_faq_question_settings'
                  label={translate('label:faq_questionAddEditView.settings')}
                  helperText={store.errors.settings}
                  error={!!store.errors.settings}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_faq_questionSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadfaq_questions();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_faq_questionCancelButton"
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
                id="id_faq_questionAddButton"
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
