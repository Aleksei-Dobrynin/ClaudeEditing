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
import ApplicationDashboard from './applications'
import TasksDashboard from './Tasks';
import UserApplicationsDashboard from './UserApplications';
import FinanceDashboard from './finance';
import FinancePaidDashboard from './finance_paid';
import ObjectsDashboard from './objects';
import MapView from './map';
import ApplicationCountHourDashboard from './application_count_hour';
import ApplicationCountWeekDashboard from './application_count_week';
import PivotDashboard from './pivot/index';
import PivotTaskDashboard from './pivotTask';
import PivotArchiveDashboard from './pivotArchive';
import AppCountDashboard from './app_count';
import FinanceInvoiceDashboard from './finance_inoice';
import ArchiveDashboard from './archive_status';
import ApplicationsCategoryCountListView from "./serviceCount";
import IssuedAppsDashboard from './issuedApps/issued_apps';
import TaskCountByStructureDashboard from './new/issued_apps';
import TaskCountBySelectedStructureDashboard from './new_selected/issued_apps';
import LateCountByStructureDashboard from './new_late/issued_apps';
import LateCountBySelectedStructureDashboard from './new_late_selected/issued_apps';
import RefusalCountByStructureDashboard from './new_refusal/issued_apps';
import RefusalCountBySelectedStructureDashboard from './new_refusal_selected/issued_apps';
import EmployeesToDutyPlanDashboard from './EmployeesToDutyPlan/employee_to_dutyplan';
import AppsFromRegistersDashboard from './AppsFromRegisters/AppsFromRegisters';
import { useSearchParams } from 'react-router-dom';



const DashboardView = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab_id = Number(searchParams.get("tab_id"));
  const [value, setValue] = React.useState(tab_id || 0);
  const { t } = useTranslation();
  const translate = t;

  React.useEffect(() => {
    store.doLoad();
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchParams(params => {
      params.set("tab_id", newValue);
      return params;
    });

  };

  return (
    <Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab data-testid={"EmployeeContact_tab_title"} label={"Карта"} {...a11yProps(0)} />
          <Tab data-testid={"EmployeeStructure_tab_title"} label={"Статистика"} {...a11yProps(1)} />
          <Tab data-testid={"EmployeeStructure_tab_title"} label={"Инфографика"} {...a11yProps(2)} />
          <Tab data-testid={"EmployeeStructure_tab_title"} label={"Финансовые"} {...a11yProps(3)} />
          {/* <Tab data-testid={"EmployeeStructure_tab_title"} label={"Архив"} {...a11yProps(4)} /> */}
          <Tab data-testid={"EmployeeStructure_tab_title"} label={"Единое окно"} {...a11yProps(4)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <MapView />
          </Grid>
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>

        <Grid container spacing={2}>
          {store.selected_count_structure_id === 0 &&
            <Grid item xs={12} md={6}>
              <TaskCountByStructureDashboard />
            </Grid>
          }
          {store.selected_count_structure_id !== 0 &&
            <Grid item xs={12} md={6}>
              <TaskCountBySelectedStructureDashboard />
            </Grid>
          }

          {store.selected_refusal_count_structure_id === 0 &&
            <Grid item xs={12} md={6}>
              <RefusalCountByStructureDashboard />
            </Grid>
          }
          {store.selected_refusal_count_structure_id !== 0 &&
            <Grid item xs={12} md={6}>
              <RefusalCountBySelectedStructureDashboard />
            </Grid>
          }

          {store.selected_late_count_structure_id === 0 &&
            <Grid item xs={12} md={12}>
              <LateCountByStructureDashboard />
            </Grid>
          }
          {store.selected_late_count_structure_id !== 0 &&
            <Grid item xs={12} md={12}>
              <LateCountBySelectedStructureDashboard />
            </Grid>
          }
          <Grid item xs={12} md={12}>
            <ApplicationsCategoryCountListView />
          </Grid>


        </Grid>
      </CustomTabPanel>


      <CustomTabPanel value={value} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} maxHeight={true}>
            <ApplicationDashboard />
          </Grid>

          <Grid item xs={12} md={6}>
            <TasksDashboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <ObjectsDashboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <UserApplicationsDashboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApplicationCountHourDashboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApplicationCountWeekDashboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <AppCountDashboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <ArchiveDashboard />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <IssuedAppsDashboard />
          </Grid> */}
          {/* <Grid item xs={12} md={6}>
            <EmployeesToDutyPlanDashboard />
          </Grid> */}
          <Grid item xs={12} md={12}>
            <PivotDashboard />
          </Grid>
          <Grid item xs={12} md={12}>
            <PivotTaskDashboard />
          </Grid>
          <Grid item xs={12} md={12}>
            <PivotArchiveDashboard />
          </Grid>
        </Grid>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FinanceDashboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <FinancePaidDashboard />
          </Grid>
        </Grid>
      </CustomTabPanel>
      {/* 
      <CustomTabPanel value={value} index={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ArchiveDashboard />
          </Grid>

        </Grid>
      </CustomTabPanel> */}
      <CustomTabPanel value={value} index={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <IssuedAppsDashboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <AppsFromRegistersDashboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <EmployeesToDutyPlanDashboard />
          </Grid>
        </Grid>
      </CustomTabPanel>

    </Box>
  );

})


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default DashboardView