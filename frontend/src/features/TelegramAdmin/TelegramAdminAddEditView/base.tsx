import React, { FC, useEffect } from "react";
import { Card, CardContent, CardHeader, Container, Divider, Grid, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import CustomButton from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { toJS } from "mobx";

type task_typeTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseTelegramAdminView: FC<task_typeTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="task_typeForm" id="task_typeForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="task_type_TitleName">
                  {translate('label:TelegramAdminAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_TelegramAdmin_name"
                      id='id_TelegramAdmin_name'
                      label={translate('label:TelegramAdminAddEditView.nameTheme')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="name_kg"
                      data-testid="id_TelegramAdmin_name_kg"
                      id='id_TelegramAdmin_name_kg'
                      label={translate('label:TelegramAdminAddEditView.nameThemeKg')}
                      helperText={store.errors.name}
                      error={!!store.errors.name_kg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Grid container justifyContent="flex-end">
                      <CustomButton
                        variant="contained"
                        id="id_TelegramAdminSaveButton"
                        name={'TelegramAdminAddEditView.save'}
                        onClick={() => {
                          store.onSaveClickSubject((id: number) => {
                            if(store.id === 0) {
                              navigate("/user/TelegramAdmin")
                            }
                          });
                        }}
                      >
                        {translate("common:save")}
                      </CustomButton>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})

export default BaseTelegramAdminView;
