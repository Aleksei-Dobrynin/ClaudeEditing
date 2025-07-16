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



const ObjectsDashboard = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
          {translate("label:Dashboard.Objects_by_tags")}
          </h2>
        </Grid>
        <Grid item md={6} xs={12}>
          <AutocompleteCustom
            value={store.obj_district_id}
            onChange={(event) => store.changeObjects(event)}
            name="obj_district_id"
            data={store.Districts}
            fieldNameDisplay={(f) => f.name}
            id="obj_district_id"
            label={translate("label:Dashboard.District")}
            helperText={""}
            error={false}
          />
        </Grid>
        {/* <Grid item xs={12} md={3}>
          <DateField
            value={store.pie_date_start}
            onChange={(event) => store.handleChange(event)}
            name="date_start"
            id="id_f_date_start"
            label={"Дата начала"}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.pie_date_end}
            onChange={(event) => store.handleChange(event)}
            name="date_start"
            id="id_f_date_start"
            label={"Дата окончания"}
          />
        </Grid> */}
      </Grid>
      <ReactApexChart options={{
        chart: {
          type: 'bar',
          height: 350,
          events: {
            dataPointSelection: (event, chartContext, opts) => {
              console.log(opts.w.globals.labels[opts.dataPointIndex])
            }
          }
        },
        colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
          '#f48024', '#69d2e7'
        ],
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: store.objTags,
        }
      }} series={[{
        data: store.objCounts
      }]} type="bar" height={350} />

    </Paper>
  );

})


export default ObjectsDashboard