import React, { FC, useEffect } from "react";
import { useLocation } from "react-router";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper, Select,
  Tooltip,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import EditIcon from "@mui/icons-material/Create";
import LayoutStore from "layouts/MainLayout/store";
import styled from "styled-components";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomButton from "components/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import FastInputapplication_paymentView from "features/ApplicationPayment/application_paymentTask/fastInput";
import FastInputapplication_paid_invoiceView
  from "features/ApplicationPaidInvoice/application_paid_invoiceAddEditView/fastInput";
import HistoryIcon from "@mui/icons-material/History";
import MtmLookup from "components/mtmLookup";
import MainStore from "MainStore";
import ObjectMapPopupView from "./MapPopupForm";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import FileField from "../../../components/FileField";
import PopupApplicationListView from "../../Application/PopupAplicationListView/PopupAplicationListView";
import PopupApplicationStore from "../../Application/PopupAplicationListView/store";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import BadgeButton from "../../../components/BadgeButton";
import TechCouncilForm from './TechCouncilForm'
import TechCouncilStore from "../../TechCouncil/TechCouncilAddEditView/store";

import TaskTabs from "./Tabs";
import SearchTask from "./searchField";


type SearchTasksProps = {
};

const SearchTasks: FC<SearchTasksProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <>
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
    </>
  );
})

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

export default SearchTasks