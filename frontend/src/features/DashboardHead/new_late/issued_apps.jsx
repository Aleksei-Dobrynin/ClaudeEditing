import * as React from 'react';
import { observer } from 'mobx-react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Chart from "react-apexcharts";
import store from './store';
import DateField from 'components/DateField';
import AutocompleteCustom from 'components/Autocomplete';
import ChartTable from 'components/dashboard/ChartTable';
import storeApplication from 'features/Application/ApplicationListView/store'
import dashboardStore from 'features/DashboardHead/store'
import { useNavigate } from 'react-router-dom';

const LateCountByStructureDashboard = observer(() => {
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
          dashboardStore.selected_late_count_structure_id = row.structure_id - 0;
          dashboardStore.selected_late_count_structure_name = row.structure;
          console.log(dashboardStore.selected_late_count_structure_id)
          // const json = `{}`
          // const json = `{"pin": "", "number": "", "tag_id": 0, "address": "", "sort_by": null, "date_end": null, "pageSize": 100, "isExpired": false, "sort_type": null, "useCommon": true, "date_start": null, "pageNumber": 0, "status_ids": [], "district_id": 0, "employee_id": 0, "service_ids": [], "customerName": "", "deadline_day": 0, "common_filter": "", "structure_ids": [], "isMyOrgApplication": false, "withoutAssignedEmployee": false}`
          // let filterData = JSON.parse(json);
          // let filter = storeApplication.filter;
          // filterData.issued_employee_id = row.employee_id;
          // filterData.dashboard_date_start = store.date_start?.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
          // filterData.dashboard_date_end = store.date_end?.endOf('day').format('YYYY-MM-DDTHH:mm:ss');
          // storeApplication.filter = filterData;
          // storeApplication.setFilterToLocalStorage();
          // navigate('/user/Application')
        }} style={{ color: 'blue' }}>{row.structure}</a></span>;
      }
    },
    { key: "days3", label: 'до 3 дней' },
    { key: "days7", label: 'до 7 дней' },
    { key: "days_more", label: 'более 7 дней' },
    { key: "count", label: 'Всего' },
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
            {translate("Просроченные заявки за период")}
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


export default LateCountByStructureDashboard