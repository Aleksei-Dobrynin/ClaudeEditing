import React, { FC, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Box,
  Button,
  makeStyles,
  FormControlLabel,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import MainStore from "MainStore";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }} style={{ marginTop: 20, marginBottom: 20 }}>
      <Grid container>

        <form id="EmployeeForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="Employee_TitleName">
                  {translate('label:EmployeeAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorlast_name}
                      error={store.errorlast_name != ''}
                      id='id_f_Employee_last_name'
                      label={translate('label:EmployeeAddEditView.last_name')}
                      value={store.last_name}
                      onChange={(event) => store.handleChange(event)}
                      name="last_name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorfirst_name}
                      error={store.errorfirst_name != ''}
                      id='id_f_Employee_first_name'
                      label={translate('label:EmployeeAddEditView.first_name')}
                      value={store.first_name}
                      onChange={(event) => store.handleChange(event)}
                      name="first_name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorsecond_name}
                      error={store.errorsecond_name != ''}
                      id='id_f_Employee_second_name'
                      label={translate('label:EmployeeAddEditView.second_name')}
                      value={store.second_name}
                      onChange={(event) => store.handleChange(event)}
                      name="second_name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorpin}
                      error={store.errorpin != ''}
                      id='id_f_Employee_pin'
                      label={translate('label:EmployeeAddEditView.pin')}
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorremote_id}
                      error={store.errorremote_id != ''}
                      id='id_f_Employee_remote_id'
                      label={translate('label:EmployeeAddEditView.remote_id')}
                      value={store.remote_id}
                      onChange={(event) => store.handleChange(event)}
                      name="remote_id"
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      // helperText={store.errorfirst_name}
                      // error={store.errorfirst_name != ''}
                      id='id_f_Employee_first_name'
                      label={translate('label:EmployeeAddEditView.email')}
                      value={store.email}
                      onChange={(event) => store.handleChange(event)}
                      name="email"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      disabled
                      helperText={store.erroruser_id}
                      error={store.erroruser_id != ''}
                      id='id_f_Employee_user_id'
                      label={translate('label:EmployeeAddEditView.user_id')}
                      value={store.user_id}
                      onChange={(event) => store.handleChange(event)}
                      name="user_id"
                    />
                  </Grid>



                  {(store.id > 0 && (store.user_id == null || store.user_id == "")) && <Box m={2}>
                    <Button
                      variant="contained"
                      disabled={store.email == ""}
                      id="id_EmployeeCancelButton"
                      onClick={() => store.registerEmployee()}
                    >
                      {translate("Создать аккаунт")}
                    </Button>
                  </Box>}
                  {store.id > 0 && <Box m={2}>
                    <Button
                      variant="contained"
                      id="id_EmployeeCancelButton"
                      onClick={() => {
                        store.printDocument(7, {
                          id: store.id,
                        })
                      }}
                    >
                      {translate("Скачать анкету")}
                    </Button>
                  </Box>}



                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
})


export default BaseView;
