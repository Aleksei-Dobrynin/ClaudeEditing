import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Checkbox, FormControlLabel, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Chart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';
import store from './store';
import DateField from 'components/DateField';
import LookUp from 'components/LookUp';
import AutocompleteCustom from 'components/Autocomplete';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import CustomButton from 'components/Button';


const PivotTaskDashboard = observer(() => {
  const { t } = useTranslation();
  const [d, setData] = React.useState(null);
  const translate = t;

  React.useEffect(() => {
    store.doLoad();
  }, [])

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', minHeight: '700px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
          {translate("label:Dashboard.Tasks")}
          </h2>
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.pivot_date_start}
            onChange={(event) => store.changeApplications(event)}
            name="pivot_date_start"
            id="id_f_pivot_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.pivot_date_end}
            onChange={(event) => store.changeApplications(event)}
            name="pivot_date_end"
            id="id_f_pivot_date_end"
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControlLabel
            label={translate("label:Dashboard.Overdue")}
            control={
              <Checkbox
                checked={store.pivot_out_of_date}
                onChange={(event) => store.changeApplications(event)}
                name="pivot_out_of_date"
                id="id_f_pivot_out_of_date"
              />
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <PivotTableUI
          data={store.data}
          rows={["Структура", "Сотрудник"]}
          cols={["Основная", "Статус"]}
          onChange={s => {
            delete s.data

            const uniqueRows = s.rows.filter(function (item, pos, self) {
              return self.indexOf(item) == pos;
            })
            const uniqueCols = s.cols.filter(x => !uniqueRows.includes(x))
              .filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
              })

            s.cols = uniqueCols
            s.rows = uniqueRows
            setData(s)
          }}
          {...d}
        />
      </Box>
    </Paper>
  );

})


export default PivotTaskDashboard