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
import DateField from "../../../components/DateField";
import dayjs from "dayjs";
import CustomCheckbox from "components/Checkbox";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>
      <Grid container>

        <form id="EmployeeEventForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="EmployeeEvent_TitleName">
                  {translate('label:EmployeeEventAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_start ? dayjs(store.date_start) : null}
                      onChange={(event) => store.handleChange(event)}
                      name="date_start"
                      id="id_f_date_start"
                      label={translate("label:EmployeeEventAddEditView.date_start")}
                      helperText={store.errordate_start}
                      error={!!store.errordate_start}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_end ? dayjs(store.date_end) : null}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                      id="id_f_date_end"
                      label={translate("label:EmployeeEventAddEditView.date_end")}
                      helperText={store.errordate_end}
                      error={!!store.errordate_end}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.event_type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="event_type_id"
                      data={store.HrmsEventType}
                      id='id_f_EmployeeEvent_event_type_id'
                      label={translate('label:EmployeeEventAddEditView.event_type_id')}
                      helperText={store.errorevent_type_id}
                      error={!!store.errorevent_type_id}
                    />
                  </Grid>
                  {store.is_head_structure && <>
                    <Grid item md={12} xs={12}>
                      <CustomCheckbox
                        value={store.need_temporary}
                        onChange={(event) => store.handleChange(event)}
                        name="need_temporary"
                        label={translate('label:EmployeeEventAddEditView.need_temporary')}
                        id='id_f_EmployeeEvent_temporary'
                      />
                    </Grid>
                    {store.need_temporary && <Grid item md={12} xs={12}>
                      <LookUp
                        value={store.temporary_employee_id}
                        onChange={(event) => store.handleChange(event)}
                        name="temporary_employee_id"
                        data={store.Employees}
                        fieldNameDisplay={(field) => `${field.last_name} ${field.first_name}`}
                        id='id_f_EmployeeEvent_temporary_employee_id'
                        label={translate('label:EmployeeEventAddEditView.temporary_employee_id')}
                        helperText={store.errortemporary_employee_id}
                        error={!!store.errortemporary_employee_id}
                      />
                    </Grid>}
                  </>}
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
