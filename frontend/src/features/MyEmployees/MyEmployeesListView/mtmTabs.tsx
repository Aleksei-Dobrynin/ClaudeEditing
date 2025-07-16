import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import store from './store';
import { useTranslation } from 'react-i18next';
import WorkflowTaskTemplateListView from 'features/WorkflowTaskTemplate/WorkflowTaskTemplateListView';
import MyEmployeeList from "./ActiveEmployeeList";
import { useEffect } from "react";
import InactiveEmployeeList from "./InactiveEmployeeList";

const MyEmployeeMtmTabs = observer(() => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if(value === 1) {
      (async () => await store.loadEmployeeInStructuresByStructureHistory())();
    } else {
      (async () => await store.loadEmployeeInStructuresByStructure())();
    }
    return () => store.clearStore();
  }, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component={Paper} elevation={5}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab data-testid={"WorkflowTaskTemplate_tab_title"} label={translate("label:EmployeeInStructureListView.ActiveEmployees")} {...a11yProps(0)} />
          <Tab data-testid={"WorkflowTaskTemplate_tab_title"} label={translate("label:EmployeeInStructureListView.MyEmployeesHistory")} {...a11yProps(1)} />
        </Tabs>
      </Box>
      
      <CustomTabPanel value={value} index={0}>
        <MyEmployeeList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <InactiveEmployeeList />
      </CustomTabPanel>
            
    </Box>
  );

})


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default MyEmployeeMtmTabs;