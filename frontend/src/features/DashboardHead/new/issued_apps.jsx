import * as React from 'react';
import { observer } from 'mobx-react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Chart from "react-apexcharts";
import store from './store';
import dashboardStore from 'features/DashboardHead/store'
import DateField from 'components/DateField';
import AutocompleteCustom from 'components/Autocomplete';
import ChartTable from 'components/dashboard/ChartTable';
import storeApplication from 'features/Application/ApplicationListView/store'
import { useNavigate } from 'react-router-dom';

const TaskCountByStructureDashboard = observer(() => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  React.useEffect(() => {
    store.doLoad();
  }, [])

  const columns = [
    {
      key: 'structure', label: 'Отдел',
      renderCell: (row) => {

        return <span><a onClick={() => {
          dashboardStore.selected_count_structure_id = row.structure_id - 0;
          dashboardStore.selected_count_structure_name = row.structure;
        }} style={{ color: 'blue' }}>{row.structure}</a></span>;
      }
    },
    { key: "count", label: 'Количество' },
    {
      key: 'percentage',
      label: 'Процент',
      // Можем показать inline-bar:
      renderCell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 100, background: '#eee', height: 8 }}>
            <div
              style={{
                width: `${row.percentage}%`,
                background: '#007bff',
                height: '100%'
              }}
            />
          </div>
          <span>{row.percentage}%</span>
        </div>
      )
    }
  ]

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
            {translate("Заявки по отделам")}
          </h2>
        </Grid>
        <Grid item xs={12} md={6}>
          <DateField
            value={store.date_start}
            onChange={(event) => store.changeArchiveCountWeek(event)}
            name="date_start"
            id="id_f_issued_apps_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateField
            value={store.date_end}
            onChange={(event) => store.changeArchiveCountWeek(event)}
            name="date_end"
            id="id_f_issued_apps_date_end"
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>

      <ChartTable
        columns={columns}
        initialData={store.data}
      />
    </Paper>
  );

})


export default TaskCountByStructureDashboard