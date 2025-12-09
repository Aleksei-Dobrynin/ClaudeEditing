import React, { FC, useEffect } from "react";
import { default as ApplicationAddEditBaseView } from "./base";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Typography,
  ListItemText,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip
} from "@mui/material";

import { } from '@mui/material';

import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import CustomButton from "components/Button";
import Uploaded_application_documentAddEditView
  from "features/UploadedApplicationDocument/uploaded_application_documentAddEditView";
import Uploaded_application_documentListView
  from "features/UploadedApplicationDocument/uploaded_application_documentListView";
import Outgoing_Uploaded_application_documentListGridView
  from "features/UploadedApplicationDocument/uploaded_application_documentListView/index_outgoing_grid";
import FastInputapplication_paymentView from "features/ApplicationPayment/application_paymentAddEditView/fastInput";
import ApplicationPaidInvoice from "features/ApplicationPaidInvoice/ApplicationPaidInvoiceListView";
import Application_taskListView from "features/application_task/application_taskListView";
import { toJS } from "mobx";
import HistoryTableListView from "features/HistoryTable/HistoryTableListView";
import Saved_application_documentListView from "features/saved_application_document/saved_application_documentListView";
import ContragentListView from "features/Contragent/ContragentListView";
import Contragent_interactionListView from "features/contragent_interaction/contragent_interactionListView";
import ApplicationWorkDocumentListView from "../../ApplicationWorkDocument/ApplicationWorkDocumentListView";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import storeComments from "../../ApplicationComments/ApplicationCommentsListView/store";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SmsIcon from "@mui/icons-material/Sms";
import ForwardToInboxTwoToneIcon from '@mui/icons-material/ForwardToInboxTwoTone';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import ScheduleSendTwoToneIcon from '@mui/icons-material/ScheduleSendTwoTone';
import MyTemplatesStore from 'features/org_structure_templates/my_templates/store';
import MyTemplatesPrintView from 'features/org_structure_templates/my_templates';
import { IconPrinter } from '@tabler/icons-react';
import storeObject from "./storeObject";
import ApplicationStatusHistoryListView from "features/HistoryTable/StatusHistoryTableListView"
import FastInputapplication_paid_invoiceView from "features/ApplicationPaidInvoice/application_paid_invoiceApplication/fastInput";
import { APPLICATION_STATUSES } from "constants/constant";
import Architecture_processPopupForm from "features/architecture_process/architecture_processAddEditView/popupForm";
import SmsPopupForm from "./smsForm";
import RejectCabinetForm from "./rejectCabinetForm";
import ApproveCabinetForm from "./approveCabinetForm";
import HistoryForm from "./notificationHistoryForm";
import SendDocumentForm from "./sendDocementsForm";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Link from '@mui/material/Link';
import MainStore from "MainStore";
import TechCouncilForm from "../../application_task/task/TechCouncilForm";
import TechCouncilStore from "../../TechCouncil/TechCouncilAddEditView/store";

type ApplicationProps = {};

const ApplicationAddEditView: FC<ApplicationProps> = observer((props) => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");
  const isCabinet = query.get("cabinet") === "true";
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isDisabled, setIsDisabled] = React.useState<boolean>(false);

  useEffect(() => {
    const result = store.checkStructureEOId();
    setIsDisabled(!result);
  }, []);

  const archObjectId = query.get("arch_object_id");
  useEffect(() => {
    if ((id != null) &&
      (id !== "") &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id));
      storeComments.setApplicationId(Number(id));
    } else {
      navigate("/error-404");
    }
    return () => {
      store.clearStore();
      storeObject.clearStore();
    };
  }, []);

  useEffect(() => {
    if (store.arch_object_id != null && store.arch_object_id !== 0) {
      store.loadArchObjectsTag(store.arch_object_id);
    }
  }, [store.arch_object_id]);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const result = store.checkStructureEOId();
    setIsDisabled(!result);

    setValue(newValue);
  };

  const BackButton = () => {
    return <Box display="flex" justifyContent={"flex-end"} p={2}>
      <CustomButton
        variant="contained"
        id="id_ApplicationBackButton"
        onClick={() => navigate(MainStore.isFinancialPlan ? "/user/ApplicationFinPlan" : "/user/Application")}
      >
        {translate("common:goOut")}
      </CustomButton>
    </Box>;
  };

  let filteredStatuses = store.Statuses.reduce((acc, s) => {
    let matchingRoad = store.ApplicationRoads.find(ar =>
      ar.from_status_id === store.status_id &&
      ar.to_status_id === s.id &&
      ar.is_active === true
    );
    if (matchingRoad) {
      acc.push({
        ...s,
        is_allowed: matchingRoad.is_allowed
      });
    }
    return acc;
  }, []);

  return (
    <>

      <Dialog
        open={store.openStatusHistoryPanel}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{translate('label:application_subtask_assigneeAddEditView.entityTitle')}</DialogTitle>
        <DialogContent>
          <ApplicationStatusHistoryListView
            ApplicationID={store.id}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_application_subtask_assigneeCancelButton"
            name={'application_subtask_assigneeAddEditView.cancel'}
            onClick={() => store.changeApplicationHistoryPanel(false)} // Исправлено
          >
            {translate("common:close")}
          </CustomButton>
        </DialogActions>
      </Dialog>
      <TechCouncilForm
        openPanel={store.isOpenTechCouncil}
        onSaveClick={() => {
          TechCouncilStore.onCloseTechCouncil();
          store.isOpenTechCouncil = false}}
        idApplication={store.id}
        idService={store.service_id}
      />
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <Box>
          {store.id ? <>
            {/*<Chip color="primary"*/}
            {/*      label={`${translate("label:ApplicationAddEditView.status")}${store.Statuses.find(s => s.id === store.status_id)?.name}`}*/}
            {/*/>*/}
            {/*<IconButton sx={{ ml: 1 }} onClick={handleClick}>*/}
            {/*  <EditIcon />*/}
            {/*</IconButton>*/}
            <CustomButton
              customColor={"#718fb8"}
              size="small"
              variant="contained"
              sx={{ mb: "5px", mr: 1 }}
              onClick={handleClick}
              endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            >
              {`${translate("label:ApplicationAddEditView.status")}${store.Statuses.find(s => s.id === store.status_id)?.name}`}
            </CustomButton>
            {filteredStatuses?.length > 0 &&
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <Typography variant="h5" sx={{ textAlign: "center", width: "100%" }}>
                  {translate("common:Select_status")}
                </Typography>
                {store.id > 0 && store.status_id > 0 && filteredStatuses.map(x => {
                  return <MenuItem
                    onClick={() => store.changeToStatus(x.id)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#718fb8",
                        color: "#FFFFFF"
                      },
                      "&:hover .MuiListItemText-root": {
                        color: "#FFFFFF"
                      }
                    }}
                    disabled={!x.is_allowed}
                  >
                    {x.name}
                  </MenuItem>
                    ;
                })}
              </Menu>
            }
          </>
            :
            <></>}
          <CustomButton
            customColor={"#718fb8"}
            size="small"
            variant="contained"
            sx={{ mb: "5px", mr: 1 }}
            onClick={() => store.changeApplicationHistoryPanel(true)} // Исправлено
          >
            {`${translate("label:ApplicationAddEditView.statusHistory")}`}
          </CustomButton>
          {(store.status_code === APPLICATION_STATUSES.document_issued ||
            store.status_code === APPLICATION_STATUSES.refusal_issued) &&
            (store.arch_process_id === null ? <CustomButton
              customColor={"#ff652f"}
              size="small"
              variant="contained"
              sx={{ mb: "5px", mr: 1 }}
              onClick={() => store.toDutyPlanClicked(true)}
            >
              {`${translate("Передать в ЦиДП")}`}
            </CustomButton> : <></>
              // <Typography sx={{ fontSize: '14px', ml: 2 }}>
              //   Отправлен на ОЦиДП
              // </Typography>
            )
          }
          <Tooltip title={
            <span style={{ fontSize: '14px' }}>
              {translate("label:ApplicationAddEditView.customer_sendDocument")}
            </span>
          }>
            <IconButton disabled={!isDisabled} onClick={() => { store.openSendDocumentsPanel() }} style={{ padding: 0 }}>
              <DriveFileMoveIcon fontSize="large" style={{ cursor: 'pointer', color: 'rgb(19,208,103)' }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={
            <span style={{ fontSize: '14px' }}>
              {translate("label:ApplicationAddEditView.customer_notify")}
            </span>
          }>
            <IconButton disabled={!isDisabled} onClick={() => { store.openSmsPanel() }} style={{ padding: 0 }}>
              <ForwardToInboxTwoToneIcon fontSize="large" style={{ cursor: 'pointer', color: 'rgb(19,208,103)' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={
            <span style={{ fontSize: '14px' }}>
              {translate("label:ApplicationAddEditView.notify_history")}
            </span>
          }>
            <IconButton disabled={!isDisabled} onClick={() => { store.openHistoryPanel() }} style={{ padding: 0 }}>
              <ScheduleSendTwoToneIcon fontSize="large" style={{ cursor: 'pointer', color: 'rgb(19,208,103)' }} />
            </IconButton>
          </Tooltip>

        </Box>
        {store.is_electronic_only && (
          <Box
            sx={{
              backgroundColor: "#f97300",
              color: "#040404",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            {translate("label:ApplicationAddEditView.only_electronic")}
          </Box>
        )}
        <span style={{ fontSize: '20px' }} id="Application_TitleName">
          # {store.number}
        </span>
      </Box>

      <SmsPopupForm
        openPanel={store.openSmsForm}
        onBtnCancelClick={() => { store.openSmsForm = false; }}
        onBtnOkClick={() => { store.openSmsForm = false; }}
      />

      <RejectCabinetForm
        number={store.number}
        appId={store.id}
        openPanel={store.openCabinetReject}
        onBtnCancelClick={() => { store.openCabinetReject = false; }}
        onBtnOkClick={() => { store.openCabinetReject = false; }}
      />

      <ApproveCabinetForm
        html={store.cabinet_html}
        openPanel={store.openCabinetApprove}
        onBtnCancelClick={() => { store.openCabinetApprove = false; }}
        onBtnOkClick={() => { store.openCabinetApprove = false; }}
      />

      <HistoryForm
        openPanel={store.openHistoryForm}
        onBtnCancelClick={() => { store.openHistoryForm = false; }}
        onBtnOkClick={() => { store.openHistoryForm = false; }}
      />
      <SendDocumentForm
        openPanel={store.openSendDocumentPanel}
        applicationId={ store.id}
        onBtnCancelClick={() => { store.openSendDocumentPanel = false; }}
        onBtnOkClick={() => { store.sendSelectedDocumentsToEmail(); }}
      />

      <Architecture_processPopupForm
        application_id={store.id}
        openPanel={store.openPanelProcess}
        onBtnCancelClick={() => store.toDutyPlanClicked(false)}
        onSaveClick={() => {
          store.toDutyPlanClicked(false)
          store.loadApplication(store.id);
          store.loadCustomerContacts(store.customer_id);
        }}
      />

      <Box component={Paper} elevation={5}>
        <Tabs variant="fullWidth" aria-label="basic tabs example" value={value} onChange={handleChange}>
          <Tab data-testid={"application_task_assignee_tab_title"} label={translate("label:ApplicationAddEditView.TabName_app")} {...a11yProps(0)} />
          <Tab disabled={store.id === 0} data-testid={"application_document_tab_title"}
            label={translate("label:ApplicationAddEditView.TabName_documents")} {...a11yProps(1)} />
          {!isCabinet &&
            <Tab disabled={store.id === 0} data-testid={"application_saved_document_tab_title"}
              label={translate("label:ApplicationAddEditView.TabName_saved_document")} {...a11yProps(5)} />
          }
          {!isCabinet &&
            <Tab disabled={store.id === 0} data-testid={"application_subtask_tab_title"}
              label={translate("label:ApplicationAddEditView.TabName_tasks")} {...a11yProps(3)} />
          }
          {!isCabinet &&
            <Tab disabled={store.id === 0} data-testid={"application_payment_tab_title"}
              label={translate("label:ApplicationAddEditView.TabName_payment")} {...a11yProps(2)} />
          }
          {!isCabinet &&
            <Tab disabled={store.id === 0} data-testid={"application_contragent_title"}
              label={translate("label:ApplicationAddEditView.TabName_contragent")} {...a11yProps(6)} />
          }
          {!isCabinet &&
            <Tab disabled={store.id === 0} data-testid={"application_subtask_tab_title"}
              label={translate("label:ApplicationAddEditView.TabName_history")} {...a11yProps(4)} />
          }
        </Tabs>

      </Box >
      <Box style={{ paddingTop: "10px", marginLeft: "50px" }} display="flex" alignItems="center">
        <KeyboardBackspaceIcon style={{ width: "40px" }} color="primary" />
        <Link fontWeight={700} underline="none" href={MainStore.isFinancialPlan ? "/user/ApplicationFinPlan" : (isCabinet ? "/user/AppsFromCabinet" : "/user/Application")}>{translate("common:backtoApp")}</Link>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <ApplicationAddEditBaseView {...props}>


          <Box display="flex" p={2}>
            {<Box m={2}>
              <CustomButton
                variant="contained"
                id="id_ApplicationSaveButton"
                onClick={() => {
                  store.onSaveClick((id: number) => {
                    if (store.id === 0) {
                      navigate(`/user/Application/addedit?id=${id}`);
                    }
                    store.doLoad(id);
                  });
                }}
              >
                {translate("common:save")}
              </CustomButton>
            </Box>}
            <Box m={2}>
              <CustomButton
                color={"secondary"}
                sx={{ color: "white", backgroundColor: "#DE350B !important" }}
                variant="contained"
                id="id_ApplicationCancelButton"
                onClick={() => navigate(MainStore.isFinancialPlan ? "/user/ApplicationFinPlan" : "/user/Application")}
              >
                {translate("common:goOut")}
              </CustomButton>
            </Box>
          </Box>
        </ApplicationAddEditBaseView>
      </CustomTabPanel>


      <CustomTabPanel value={value} index={1}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }} >
          {store.id > 0 && <CustomButton variant="contained" style={{ width: "150px" }} onClick={() => MyTemplatesStore.onPrintClick(store.id)}>
            {translate("common:print")} <IconPrinter style={{ marginLeft: "20px" }} stroke={2} />
          </CustomButton>}

        </div>

        {store.id !== 0 && <Uploaded_application_documentListView idMain={store.id} />}
        {store.id !== 0 && <Outgoing_Uploaded_application_documentListGridView idMain={store.id} />}
        {store.id > 0 && <ApplicationWorkDocumentListView idApplication={store.id} />}
        <BackButton />

      </CustomTabPanel>
      <MyTemplatesPrintView application_id={store.id} />


      <CustomTabPanel value={value} index={2}>
        {store.id !== 0 && <Saved_application_documentListView idMain={store.id} />}
        {/* <BackButton /> */}

      </CustomTabPanel>


      <CustomTabPanel value={value} index={3}>
        {store.id !== 0 && <Application_taskListView idMain={store.id} />}
        <BackButton />

      </CustomTabPanel>


      <CustomTabPanel value={value} index={4}>
        {store.id !== 0 && <FastInputapplication_paymentView idMain={store.id} statusCode={store.Statuses.find(s => s.id == store.status_id)?.code ?? ""} isDisabled={isDisabled} />}
        {/* {store.id !== 0 && <ApplicationPaidInvoice idMain={store.id} />} */}
        {store.id !== 0 && <FastInputapplication_paid_invoiceView idMain={store.id} isDisabled={isDisabled} />}
        <BackButton />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={5}>
        {store.id !== 0 && <Contragent_interactionListView idMain={store.id} />}
        {/* <BackButton /> */}

      </CustomTabPanel>


      <CustomTabPanel value={value} index={6}>
        {store.id !== 0 && <HistoryTableListView ApplicationID={store.id} />}
        <BackButton />

      </CustomTabPanel>


    </>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

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
    "aria-controls": `simple-tabpanel-${index}`
  };
}

export default ApplicationAddEditView;