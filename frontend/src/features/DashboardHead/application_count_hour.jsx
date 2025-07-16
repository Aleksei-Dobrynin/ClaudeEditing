import * as React from 'react';
import { observer } from 'mobx-react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Chart from "react-apexcharts";
import store from './store';
import DateField from 'components/DateField';
import AutocompleteCustom from 'components/Autocomplete';

const ApplicationCountHourDashboard = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
          {translate("label:Dashboard.Number_of_applications_by_hour")}
          </h2>
        </Grid>
        <Grid item xs={12} md={6}>
          <DateField
            value={store.app_count_hour_appcount_date_start}
            onChange={(event) => store.changeApplicationCountHour(event)}
            name="app_count_hour_appcount_date_start"
            id="id_f_app_count_hour_appcount_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateField
            value={store.app_count_hour_appcount_date_end}
            onChange={(event) => store.changeApplicationCountHour(event)}
            name="app_count_hour_appcount_date_end"
            id="id_f_app_count_hour_appcount_date_end"
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>

      <Chart
        options={{
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: store.app_count_hour_appStatus
          }
        }}
        series={[
          {
            name: "Задач",
            data: store.app_count_hour_appCounts
          }
        ]}
        type="bar"
      />
    </Paper>
  );

})


export default ApplicationCountHourDashboard