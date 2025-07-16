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



const TasksDashboard = observer(() => {
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
            Задачи по отделам
          </h2>
        </Grid>
        <Grid item md={6} xs={12}>
          <AutocompleteCustom
            value={store.task_structure_id}
            onChange={(event) => store.changeTasks(event)}
            name="task_structure_id"
            data={store.Structures}
            fieldNameDisplay={(f) => f.name}
            id="task_structure_id"
            label={translate("label:Dashboard.Department")}
            helperText={""}
            error={false}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.task_date_start}
            onChange={(event) => store.changeTasks(event)}
            name="task_date_start"
            id="id_f_task_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.task_date_end}
            onChange={(event) => store.changeTasks(event)}
            name="task_date_end"
            id="id_f_task_date_end"
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>

      <Chart
        options={{
          chart: {
            id: "basic-bar",
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                // console.log(chartContext, opts);
                // console.log(opts.w.globals.series[0][opts.dataPointIndex])
                console.log(opts.w.globals.labels[opts.dataPointIndex])
              }
            }
          },
          xaxis: {
            categories: store.taskStatus
          }
        }}
        series={[
          {
            name: "Задач",
            data: store.taskCounts
          }
        ]}
        type="bar"
      />
    </Paper>
  );

})


export default TasksDashboard