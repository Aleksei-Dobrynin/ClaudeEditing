import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import store from './store';
import { useTranslation } from 'react-i18next';
import EmployeeContactListView from 'features/employee_contact/employee_contactListView/index';
import EmployeeStructuresListView from 'features/EmployeeStructures/EmployeeStructuresListView';
import EmployeeEventListView from 'features/EmployeeEvent/EmployeeEventListView';


const S_QueryMtmTabs = observer(() => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component={Paper} elevation={5}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab data-testid={"EmployeeContact_tab_title"} label={translate("label:employee_contactAddEditView.entityTitle")} {...a11yProps(0)} />
          <Tab data-testid={"EmployeeStructure_tab_title"} label={translate("label:EmployeeAddEditView.Place_of_work")} {...a11yProps(1)} />
          <Tab data-testid={"EmployeeEvent_tab_title"} label={translate("label:EmployeeEventListView.entityTitle")} {...a11yProps(2)} />
        </Tabs>
      </Box>
      
      <CustomTabPanel value={value} index={0}>
        <EmployeeContactListView idMain={store.id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <EmployeeStructuresListView idEmployee={store.id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <EmployeeEventListView idEmployee={store.id} />
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


export default S_QueryMtmTabs