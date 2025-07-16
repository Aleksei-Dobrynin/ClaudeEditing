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
import ApplcationDashboardHeadDepartment from './applications'
// import MapViewHeadDepartment from './map';
import MapDashboard from './../Dashboard/map';
// import ApplicationCountWeekDashboard from './application_count_week';
import PivotDashboardHeadDepartment from './pivot/index';
import PivotTaskHeadDepartment from './pivotTask/index';
import AppCountDashboard from './app_counts';
import CalculcationReport from './calculations_report';
import CalculcationReportGrouped from './calculations_report_grouped';
import Reports from './reports';
// import PivotTaskDashboard from './pivotTask';
// import PivotArchiveDashboard from './pivotArchive';
// import AppCountDashboard from './app_count';
// import ArchiveDashboard from './archive_status';

const DashboarHeadDepartmentdView = observer(() => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;

  React.useEffect(() => {
    store.doLoad();
  }, [])


  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      <Grid item xs={12} md={6} maxHeight={true}>
        <ApplcationDashboardHeadDepartment />
      </Grid>
      <Grid item xs={12} md={6} maxHeight={true}>
        <AppCountDashboard />
      </Grid>
      <Grid item xs={12} md={6} maxHeight={true}>
        <Reports />
      </Grid>
      <Grid item xs={12} md={12}>
        <PivotDashboardHeadDepartment />
      </Grid>
      <Grid item xs={12} md={12}>
        <PivotTaskHeadDepartment />
      </Grid>
      <Grid item xs={12} md={6}>
        <CalculcationReport />
      </Grid>
      <Grid item xs={12} md={6}>
        <CalculcationReportGrouped />
      </Grid>
      <Grid item xs={12} md={12}>
        <MapDashboard headStructure={true} />
      </Grid>

    </Grid>
  );

})


export default DashboarHeadDepartmentdView