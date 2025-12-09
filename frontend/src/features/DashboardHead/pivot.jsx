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
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';

const data = [
  {
    attr1: 'value1_attr1',
    attr2: 'value1_attr2',
    //...
  },
  {
    attr1: 'value2_attr1',
    attr2: 'value2_attr2',
    //...
  },
  //...
];


const PivotDashboard = observer(() => {
  const { t } = useTranslation();
  const [d, setData] = React.useState(null);
  const translate = t;

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', minHeight: '700px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
            Заявки
          </h2>
        </Grid>
        <Grid item md={6} xs={12}>
          <AutocompleteCustom
            value={store.pie_structure_id}
            onChange={(event) => store.changeApplications(event)}
            name="pie_structure_id"
            data={store.Structures}
            fieldNameDisplay={(f) => f.name}
            id="pie_structure_id"
            label={translate("label:Dashboard.Department")}
            helperText={""}
            error={false}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.pie_date_start}
            onChange={(event) => store.changeApplications(event)}
            name="pie_date_start"
            id="id_f_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.pie_date_end}
            onChange={(event) => store.changeApplications(event)}
            name="pie_date_end"
            id="id_f_date_start"
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <PivotTableUI
          data={data}
          onChange={s => setData(s)}
          {...d}
        />
      </Box>
    </Paper>
  );

})


export default PivotDashboard