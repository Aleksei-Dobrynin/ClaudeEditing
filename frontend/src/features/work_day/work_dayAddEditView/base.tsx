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
import CustomTextField from "components/TextField";
import TimeField from "components/TimeField";
import LookUp from "components/LookUp";

type work_dayTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basework_dayView: FC<work_dayTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="work_dayForm" id="work_dayForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="work_day_TitleName">
                  {translate('label:work_dayAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.week_number}
                      onChange={(event) => store.handleChange(event)}
                      name="week_number"
                      data={store.Days}
                      id='id_f_SmProject_week_number'
                      label={translate('label:work_dayAddEditView.week_number')}
                      helperText={store.errors.week_number}
                      error={!!store.errors.week_number}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TimeField
                      value={store.time_start}
                      onChange={(event) => store.handleChange(event)}
                      name="time_start"
                      id='id_f_work_day_time_start'
                      label={translate('label:work_dayAddEditView.time_start')}
                      helperText={store.errors.time_start}
                      error={!!store.errors.time_start}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TimeField
                      value={store.time_end}
                      onChange={(event) => store.handleChange(event)}
                      name="time_end"
                      id='id_f_work_day_time_end'
                      label={translate('label:work_dayAddEditView.time_end')}
                      helperText={store.errors.time_end}
                      error={!!store.errors.time_end}
                    />
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

export default Basework_dayView;
