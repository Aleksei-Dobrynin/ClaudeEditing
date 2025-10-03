import React, { FC, useMemo, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box, Dialog, DialogActions, DialogContent,
  Tab,
  Tabs,
  Badge,
  styled as muiStyled
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
import HistoryTableListView from "features/HistoryTable/HistoryTableListView";
import HistoryCardsView from "features/HistoryTable/HistoryTableListView/HistoryCardsView";
import SearchTasks from "./SearchTasks";
import dayjs from "dayjs";
import TaskListView from "./TaskList";
import ApplicationInfoCards from "./ApplicationInfoCards";

type TaskTabsProps = {};

// Styled component for activity indicator
const ActivityIndicator = muiStyled('div')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  position: 'relative',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${theme.palette.success.main}80`,
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: `0 0 0 6px ${theme.palette.success.main}00`,
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${theme.palette.success.main}00`,
    },
  },
}));

const TaskTabs: FC<TaskTabsProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  // Загружаем комментарии при монтировании компонента и при изменении application_id
  useEffect(() => {
    if (store.application_id && store.application_id > 0) {
      store.loadAllComments(store.application_id);
    }
  }, [store.application_id]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    store.tab_id = newValue
    navigate(`/user/application_task/addedit?id=${store.id}&tab_id=${newValue}&app_step_id=${store.expandedStepId}&back=${store.backUrl}`);
  };

  const hasAccess = (store.task_assigneeIds.includes(LayoutStore.employee_id)
    && store.Application.status_code === APPLICATION_STATUSES.preparation)
    || MainStore.isAdmin

  // Вычисляем показатели комментариев
  const commentStats = useMemo(() => {
    if (!store.applicationComments || !Array.isArray(store.applicationComments) || store.applicationComments.length === 0) {
      return { hasRecentActivity: false, totalCount: 0 };
    }

    const now = dayjs();
    const threeDaysAgo = now.subtract(3, 'day');

    const hasRecentActivity = store.applicationComments.some(comment => {
      // Проверяем дату создания
      if (comment.created_at) {
        const createdAt = dayjs(comment.created_at);
        if (createdAt.isValid() && createdAt.isAfter(threeDaysAgo)) {
          return true;
        }
      }
      
      // Проверяем дату обновления
      if (comment.updated_at) {
        const updatedAt = dayjs(comment.updated_at);
        if (updatedAt.isValid() && updatedAt.isAfter(threeDaysAgo)) {
          return true;
        }
      }
      
      return false;
    });

    return {
      hasRecentActivity,
      totalCount: store.applicationComments.length
    };
  }, [store.applicationComments]);

  // Кастомный компонент для вкладки комментариев
  const CommentsTabLabel = () => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      position: 'relative'
    }}>
      {/* Индикатор активности слева */}
      {commentStats.hasRecentActivity && (
        <ActivityIndicator title="Есть новые комментарии (за последние 3 дня)" />
      )}
      
      {/* Название вкладки */}
      <span>{translate("label:ApplicationTaskListView.TabName_comments")}</span>
      
      {/* Badge с количеством справа */}
      {commentStats.totalCount > 0 && (
        <Badge 
          badgeContent={commentStats.totalCount} 
          color="primary"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.7rem',
              minWidth: 18,
              height: 18,
              padding: '0 4px',
              fontWeight: 600,
              position: 'static',
              transform: 'none',
              marginLeft: 0.5
            }
          }}
        />
      )}
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs scrollButtons={"auto"} variant="scrollable" value={store.tab_id} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={translate("Общая информация")} {...a11yProps(0)} />
          <Tab label={translate("Исполнители")} {...a11yProps(1)} />

          <Tab label={translate("Этапы процесса")} {...a11yProps(2)} />
          <Tab label={translate("label:ApplicationTaskListView.TabName_docs")} {...a11yProps(3)} />
          <Tab label={translate("Калькуляции")} {...a11yProps(4)} />
          <Tab 
            label={<CommentsTabLabel />}
            {...a11yProps(5)} 
          />
          <Tab label={translate("label:ApplicationTaskListView.TabName_history")} {...a11yProps(6)} />
        </Tabs>
      </Box>
      
      <CustomTabPanel value={store.tab_id} index={0}>
        {store.id > 0 && <ApplicationInfoCards hasAccess={hasAccess} />}
      </CustomTabPanel>

      <CustomTabPanel value={store.tab_id} index={1}>
        {store.id > 0 && <TaskListView />}
      </CustomTabPanel>
      
      <CustomTabPanel value={store.tab_id} index={2}>
        {store.application_id && <DocumentsView
          taskId={store.id}
          expandedStepId={store.expandedStepId}
          hasAccess={true}
          appId={store.application_id}
          service_id={store.Application?.service_id}
          onPaymentDialogOpen={() => {
            store.isPaymentDialogOpen = true;
          }}
          accessPaymentDialog={hasAccess && store.Statuses?.find(s => s.id == store.Application.status_id)?.code !== 'ready_for_eo'}
        />}
      </CustomTabPanel>

      <CustomTabPanel value={store.tab_id} index={3}>
        {store.id > 0 && <DocumentList idTask={store.id} idApplication={store.application_id} />}
      </CustomTabPanel>

      <CustomTabPanel value={store.tab_id} index={4}>
        <FastInputapplication_paymentView
          disabled={!hasAccess}
          idStructure={store.structure_id}
          idService={store.Application.service_id}
          idMain={store.application_id}
          isAssigned={store.isAssigned}
          onCalculationAdded={() => store.checkCalculations()}
          idTask={store.id}
          statusCode={store.Application.status_code}
        />
        <FastInputapplication_paid_invoiceView idMain={store.application_id} disabled={!hasAccess} />
      </CustomTabPanel>
      
      <CustomTabPanel value={store.tab_id} index={5}>
        {store.id > 0 && <ApplicationCommentsListView />}
        {store.id > 0 && <FastInputapplication_subtaskView
          idMain={store.id}
          disabled={!(MainStore.isAdmin || store.task_assigneeIds.includes(LayoutStore.employee_id))}
          application_id={store.application_id}
          structure_id={store.structure_id}
        />}
      </CustomTabPanel>
      
      <CustomTabPanel value={store.tab_id} index={6}>
        {store.application_id > 0 && <HistoryCardsView ApplicationID={store.application_id} />}
      </CustomTabPanel>

  
      
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