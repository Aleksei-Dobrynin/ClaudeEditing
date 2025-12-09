import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Chart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';
import store from './store';
import DateField from 'components/DateField';
import LookUp from 'components/LookUp';
import AutocompleteCustom from 'components/Autocomplete';



const userApplicationsDashboard = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  const data = {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
            Заявки по сотрудникам
          </h2>
        </Grid>
        <Grid item xs={12} md={6}>
          <DateField
            value={store.userApplications_date_start}
            onChange={(event) => store.changeUserApplications(event)}
            name="userApplications_date_start"
            id="id_f_userApplications_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateField
            value={store.changeuserApplicationssserTask_date_end}
            onChange={(event) => store.changeUserApplications(event)}
            name="userApplications_date_end"
            id="id_f_userApplications_date_end"
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
            categories: store.userApplicationsStatus
          }
        }}
        series={[
          {
            name: "Заявок",
            data: store.userApplicationsCounts
          }
        ]}
        type="bar"
      />
    </Paper>
  );

})


export default userApplicationsDashboard