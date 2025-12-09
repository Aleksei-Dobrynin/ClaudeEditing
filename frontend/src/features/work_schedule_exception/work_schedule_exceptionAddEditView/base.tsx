import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import DateField from "components/DateField";
import TimeField from "components/TimeField";

type work_schedule_exceptionTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basework_schedule_exceptionView: FC<work_schedule_exceptionTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="work_schedule_exceptionForm" id="work_schedule_exceptionForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="work_schedule_exception_TitleName">
                  {translate('label:work_schedule_exceptionAddEditView.entityTitle')}
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
                    <DateField
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
                    <DateField
                      value={store.date_end}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                      id='id_f_work_schedule_exception_date_end'
                      label={translate('label:work_schedule_exceptionAddEditView.date_end')}
                      helperText={store.errors.date_end}
                      error={!!store.errors.date_end}
                    />
                  </Grid>
                  {!store.is_holiday && <>
                    <Grid item md={12} xs={12}>
                      <TimeField
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
                      <TimeField
                        value={store.time_end}
                        onChange={(event) => store.handleChange(event)}
                        name="time_end"
                        id='id_f_work_schedule_exception_time_end'
                        label={translate('label:work_schedule_exceptionAddEditView.time_end')}
                        helperText={store.errors.time_end}
                        error={!!store.errors.time_end}
                      />
                    </Grid>
                  </>}
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

export default Basework_schedule_exceptionView;
