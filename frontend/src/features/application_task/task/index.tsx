import React, { FC, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import {
  Box,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent, Typography
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CustomButton from 'components/Button';
import styled from "styled-components";
import SearchTask from "./searchField";
import dayjs from "dayjs";
import ApplicationStatusHistoryListView from "features/HistoryTable/StatusHistoryTableListView"
import { Select, } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import TaskTabs from "./Tabs";
import PopupApplicationListView from "features/Application/PopupAplicationListView/PopupAplicationListView";
import MainInformation from "./MainInformation";
import DocumentsView from "./Documents";
import CheckList from "./CheckList";
import TaskListView from "./TaskList";
import MainStore from "MainStore";
import LayoutStore from "layouts/MainLayout/store";
import RejectCabinetForm from "features/Application/ApplicationAddEditView/rejectCabinetForm";
import ApplicationInfoCards from "./ApplicationInfoCards";
import ProcessProgressBar from './ProcessProgressBar';
import LinearProgress from "@mui/material/LinearProgress";
import SearchTasks from "./SearchTasks";

type application_taskProps = {};

const application_taskAddEditView: FC<application_taskProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")
  const back = query.get("back")
  const tab_id = query.get("tab_id")
  const app_step_id = query.get("app_step_id")

  const startDate = dayjs(store.Application.registration_date);
  const endDate = dayjs(store.Application.deadline);
  const today = dayjs();

  const totalDays = endDate.diff(startDate, "day") + 1;
  const passedDays = today.diff(startDate, "day") + 1;
  const remainingDays = Math.max(totalDays - passedDays, 0);

  const progressPercent = Math.min((passedDays / totalDays) * 100, 100);

  let progressColor = "#2196f3";
  if (remainingDays <= 0) {
    progressColor = "#f44336";
  } else if (remainingDays / totalDays <= 0.3) {
    progressColor = "#ff9800";
  }

  useEffect(() => {
    if(tab_id && !isNaN(Number(tab_id))){
      store.tab_id = Number(tab_id)
    }
    if(app_step_id && !isNaN(Number(app_step_id))){
      store.expandedStepId = Number(app_step_id)
    }
    if ((id != null) &&
      (id !== '') &&
      !isNaN(Number(id.toString())) &&
      Number(id.toString()) !== 0) {
      store.doLoad(Number(id))
      store.backUrl = back
    } else {
      navigate('/error-404')
    }
    return () => {
      store.clearStore()
    }
  }, [])

  useEffect(() => {
    store.setMyPermissions()
  }, [store.task_assigneeIds, LayoutStore.employee_id])

  const hasAccess = MainStore.isAdmin
    // || MainStore.isHeadStructure
    || store.task_assigneeIds.includes(LayoutStore.employee_id)

  return (
    <MainWrapper>
      <PopupApplicationListView />
      <Dialog
        open={store.openStatusHistoryPanel}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <ApplicationStatusHistoryListView
            ApplicationID={store.application_id}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_application_subtask_assigneeCancelButton"
            name={'application_subtask_assigneeAddEditView.cancel'}
            onClick={() => store.changeApplicationHistoryPanel(false)}
          >
            {translate("common:close")}
          </CustomButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={store.isCheckList}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <CheckList />
        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_application_subtask_assigneeCancelButton"
            name={'application_subtask_assigneeAddEditView.cancel'}
            onClick={() => store.isCheckList = false}
          >
            {translate("common:close")}
          </CustomButton>
        </DialogActions>
      </Dialog>
      <LeftSide>
        <SearchTasks />
      </LeftSide>

      <TaskPage>
        <Grid container spacing={2}>
          <Grid item md={12} lg={12}>
            <MainInformation />
            <ProcessProgressBar />
          </Grid>
          {/*<Grid item md={12} lg={12}>*/}
          {/*  <Box>*/}
          {/*    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>*/}
          {/*      <Typography variant="body2" fontWeight="medium">*/}
          {/*        Прогресс*/}
          {/*      </Typography>*/}
          {/*      <Typography variant="body2" color="text.secondary">*/}
          {/*        {`${passedDays} из ${totalDays} дней`}*/}
          {/*      </Typography>*/}
          {/*    </Box>*/}

          {/*    <LinearProgress*/}
          {/*      variant="determinate"*/}
          {/*      value={progressPercent}*/}
          {/*      sx={{*/}
          {/*        height: 8,*/}
          {/*        borderRadius: 5,*/}
          {/*        "& .MuiLinearProgress-bar": {*/}
          {/*          borderRadius: 5,*/}
          {/*          backgroundColor: progressColor,*/}
          {/*        },*/}
          {/*        backgroundColor: "#e0e0e0",*/}
          {/*      }}*/}
          {/*    />*/}

          {/*    <Typography variant="caption" color="text.secondary">*/}
          {/*      Осталось {remainingDays} дней*/}
          {/*    </Typography>*/}
          {/*  </Box>*/}
          {/*</Grid>*/}
          <Grid item md={12} lg={12}>
            <TaskTabs />
          </Grid>
          <Grid item md={12} lg={12}>
            {/*<CheckList />*/}
            {/*{store.id > 0 && <TaskListView />}*/}
            {/* {store.application_id > 0 && <DocumentsView hasAccess={hasAccess} appId={store.application_id} service_id={store.Application?.service_id} />} */}
          </Grid>

        </Grid>
      </TaskPage>



      <RejectCabinetForm
        number={store.application_number}
        appId={store.application_id}
        openPanel={store.openCabinetReject}
        onBtnCancelClick={() => { store.openCabinetReject = false; }}
        onBtnOkClick={() => { store.openCabinetReject = false; }}
      />


    </MainWrapper>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const LeftSide = styled.div`
  width: 300px;
  position: fixed;
  margin-top: 15px;
  margin-bottom: 20px;
`;


const TaskPage = styled.div`
  margin-left: 310px;
  margin-top: 10px;
`;

const MainWrapper = styled.div`
`;

export default application_taskAddEditView