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



const FinanceDashboard = observer(() => {
  const { t } = useTranslation();
  const translate = t;


  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
            {translate("Поступления")}
          </h2>
        </Grid>
        {/* <Grid item md={6} xs={12}>
          <AutocompleteCustom
            value={store.finance_structure_id}
            onChange={(event) => store.changeFinance(event)}
            name="finance_structure_id"
            data={store.Structures}
            fieldNameDisplay={(f) => f.name}
            id="finance_structure_id"
            label={translate("label:Dashboard.Department")}
            helperText={""}
            error={false}
          />
        </Grid> */}
        <Grid item xs={12} md={3}>
          <DateField
            value={store.finance_paid_date_start}
            onChange={(event) => store.changeFinance(event)}
            name="finance_paid_date_start"
            id="id_f_finance_paid_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.finance_paid_date_end}
            onChange={(event) => store.changeFinance(event)}
            name="finance_paid_date_end"
            id="id_f_finance_paid_date_end"
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>
      <Chart
        options={{
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: store.financeMonth
          }
        }}
        series={[
          {
            name: "Поступления",
            data: store.paymentCount
          }
        ]}
        type="area"
      />
    </Paper>
  );

})


export default FinanceDashboard