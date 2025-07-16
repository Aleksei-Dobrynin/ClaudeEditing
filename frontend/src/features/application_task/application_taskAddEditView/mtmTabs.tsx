import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import store from './store';
import { useTranslation } from 'react-i18next';
import Application_task_assigneeListView from 'features/application_task_assignee/application_task_assigneeListView';
import Application_subtaskListView from 'features/application_subtask/application_subtaskListView';




const application_taskMtmTabs = observer(() => {
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
          <Tab data-testid={"application_task_assignee_tab_title"} label={translate("label:application_task_assigneeListView.entityTitle")} {...a11yProps(0)} />
          <Tab data-testid={"application_subtask_tab_title"} label={translate("label:application_subtaskListView.entityTitle")} {...a11yProps(1)} />

        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Application_task_assigneeListView idMain={store.id} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Application_subtaskListView idMain={store.id} />
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


export default application_taskMtmTabs