import { FC, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import {
  Box,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
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
      <LeftSide>

        <FilterTasks>
          <SearchTask />
        </FilterTasks>

        <Select
          displayEmpty
          fullWidth={true}
          sx={{ mb: 1 }}
        >
          {store.AppTaskFilters?.map((item, index) => {
            return <MenuItem
              id={index.toString()}
              value={item?.code}
              onClick={() => {
                store.codeFilter = item?.code;
                store.getMyAppications(true);
              }}
            >{item?.name}</MenuItem>
          })}
        </Select>

        {translate("common:Count")}: {store.Applications.length ?? 0}

        <Paper >
          <Box sx={{ height: "calc(100vh - 140px)", overflowY: 'auto' }}>
            {store.Applications.map(app => {

              //// TODO deadline check here

              let dealineColor = null;
              let deadlineTooltip = "";
              if (app.deadline) {
                const deadline = dayjs(app.deadline);
                if (deadline < dayjs()) {
                  dealineColor = "red";
                  deadlineTooltip = "Срок выполнения просрочен"
                } else if (deadline < dayjs().add(1, "day")) {
                  dealineColor = "#0000FF";
                  deadlineTooltip = "Срок выполнения просрочен на 1 день"
                } else if (deadline < dayjs().add(3, "day")) {
                  dealineColor = "#FF00FF";
                  deadlineTooltip = "Срок выполнения просрочен на 3 дня"
                } else if (deadline < dayjs().add(7, "day")) {
                  dealineColor = "#9105fc";
                  deadlineTooltip = "Срок выполнения просрочен на 7 дней"
                }
              }

              return <>
                <Link key={app.id + "_" + app.task_id} to={`/user/application_task/addedit?id=${app.task_id}`}
                  onClick={() => {
                    store.clearStore();
                    store.loadTaskInformation(app.task_id)
                  }}>
                  <ApplicationMenu key={app.task_id} $active={store.id === app.task_id}>
                    <Box display={"flex"} justifyContent={"space-between"}><span># {app.number}</span>
                      <Tooltip title={deadlineTooltip} placement="bottom">
                        <span style={{ color: dealineColor, fontWeight: 700 }}>
                          {app.deadline ? dayjs(app.deadline).format("DD.MM.YYYY") : ""}
                        </span>
                      </Tooltip>
                    </Box>
                    {app.service_name?.length > 33 ? app.service_name?.slice(0, 30) + "..." : app.service_name}
                  </ApplicationMenu>
                </Link>
                <Divider />
              </>
            })}
            {store.Applications.length > 0 && <ApplicationMenuLoadMore>
              <CustomButton disabled={store.noMoreItems} onClick={() => store.loadMoreApplicationsClicked()}>
                {translate("common:Load_more")}
              </CustomButton>
            </ApplicationMenuLoadMore>}
          </Box>
        </Paper>


      </LeftSide>

      <TaskPage>
        <Grid container spacing={2}>
          <Grid item md={12} lg={12}>
            <MainInformation />
          </Grid>
          <Grid item md={12} lg={6}>
            <TaskTabs />
          </Grid>
          <Grid item md={12} lg={6}>
            <CheckList />
            {store.id > 0 && <TaskListView />}
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

const FilterTasks = styled.div`
  width: 300px;
  margin-bottom: 10px;
`;

const ApplicationMenu = styled.div <{ $active: boolean }>`
  background-color: ${(props) => (props.$active && "#d5d5d5e3")};
  padding: 5px 10px;
`;
const ApplicationMenuLoadMore = styled.div`
  padding: 5px 10px;
  height: 100px; 
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TaskPage = styled.div`
  margin-left: 310px;
  margin-top: 10px;
`;

const MainWrapper = styled.div`
`;

export default application_taskAddEditView