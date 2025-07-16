import React, { FC } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box, Dialog, DialogActions, DialogContent,
  Tab,
  Tabs
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import FastInputapplication_subtaskView from 'features/application_subtask/application_subtaskAddEditView/fastInput';
import store from "./store"
import styled from "styled-components";
import LayoutStore from 'layouts/MainLayout/store'
import ApplicationCommentsListView from "features/ApplicationComments/ApplicationCommentsListView";
import MainStore from "MainStore";
import DocumentList from "./DocumentList";
import CardApplication from "./CardApplication";
import FastInputapplication_paymentView from "features/ApplicationPayment/application_paymentTask/fastInput";
import FastInputapplication_paid_invoiceView
  from "features/ApplicationPaidInvoice/application_paid_invoiceAddEditView/fastInput";
import DocumentsView from "./Documents";
import { APPLICATION_STATUSES } from "constants/constant";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


type TaskTabsProps = {};

const TaskTabs: FC<TaskTabsProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // setValue(newValue);
    store.tab_id = newValue
    navigate(`/user/application_task/addedit?id=${store.id}&tab_id=${newValue}&app_step_id=${store.expandedStepId}&back=${store.backUrl}`);
  };

  const hasAccess = (store.task_assigneeIds.includes(LayoutStore.employee_id)
    && store.Application.status_code === APPLICATION_STATUSES.preparation)
    || MainStore.isAdmin



  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs scrollButtons={"auto"} variant="scrollable" value={store.tab_id} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={translate("Общая информация")} {...a11yProps(0)} />
          <Tab label={translate("Этапы процесса")} {...a11yProps(1)} />
          <Tab label={translate("label:ApplicationTaskListView.TabName_docs")} {...a11yProps(2)} />
          <Tab label={translate("Калькуляции")} {...a11yProps(3)} />
          <Tab label={translate("label:ApplicationTaskListView.TabName_comments")} {...a11yProps(4)} />
          {/* <Tab label={translate("label:ApplicationTaskListView.TabName_OtherTasks_app")} {...a11yProps(4)} /> */}
          {/* <Tab label={translate("label:ApplicationTaskListView.TabName_history")} {...a11yProps(5)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={store.tab_id} index={0}>
        {store.id > 0 && <CardApplication hasAccess={hasAccess} />}
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={1}>
        {store.id > 0 && <OtherTasksFastInputView
          task_id={store.id}
          onAddTaskClicked={() => store.onAddTaskClicked(true)}
        />}
      </CustomTabPanel> */}
      <CustomTabPanel value={store.tab_id} index={1}>
        {store.application_id && <DocumentsView
          taskId={store.id}
          expandedStepId={store.expandedStepId}
          hasAccess={hasAccess}
          appId={store.application_id}
          service_id={store.Application?.service_id}
          onPaymentDialogOpen={() => {
            store.isPaymentDialogOpen = true;
          }}
          accessPaymentDialog={hasAccess && store.Statuses?.find(s => s.id == store.Application.status_id)?.code !== 'ready_for_eo'}
        />}
      </CustomTabPanel>

      <CustomTabPanel value={store.tab_id} index={2}>
        {store.id > 0 && <DocumentList idTask={store.id} idApplication={store.application_id} />}
      </CustomTabPanel>
      <CustomTabPanel value={store.tab_id} index={3}>
        <FastInputapplication_paymentView
          disabled={!hasAccess}
          idStructure={store.structure_id}
          idMain={store.application_id}
          isAssigned={store.isAssigned}
          onCalculationAdded={() => store.checkCalculations()}
          idTask={store.id}
          statusCode={store.Application.status_code}
        />
        <FastInputapplication_paid_invoiceView idMain={store.application_id} disabled={!hasAccess} />
      </CustomTabPanel>
      <CustomTabPanel value={store.tab_id} index={4}>
        {store.id > 0 && <ApplicationCommentsListView />}
      </CustomTabPanel>
      <CustomTabPanel value={store.tab_id} index={4}>
        {store.id > 0 && <FastInputapplication_subtaskView
          idMain={store.id}
          disabled={!(MainStore.isAdmin || store.task_assigneeIds.includes(LayoutStore.employee_id))}
          application_id={store.application_id}
          structure_id={store.structure_id}
        />}
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={5}>
        {store.id > 0 && <HistoryTableListView ApplicationID={store.application_id} />}
      </CustomTabPanel> */}
      <Dialog
        open={store.isPaymentDialogOpen}
        onClose={() => { store.isPaymentDialogOpen = false; }}
        maxWidth="md"
        fullWidth
      >
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={() => { store.isPaymentDialogOpen = false; }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <FastInputapplication_paymentView
            disabled={!hasAccess}
            idStructure={store.structure_id}
            idMain={store.application_id}
            onCalculationAdded={() => store.checkCalculations()}
            isAssigned={store.isAssigned}
            idTask={store.id}
            statusCode={store.Statuses?.find(s => s.id == store.Application.status_id)?.code ?? ""}
          />
        </DialogContent>
      </Dialog>
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
      {value === index && <Box sx={{ p: 1, pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const MainContent = styled.div`
  margin-top: 29px;
`


export default TaskTabs