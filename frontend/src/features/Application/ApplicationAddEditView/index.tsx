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
  Tooltip,
  alpha,
  styled,
  Button,
  IconButton,
  Fade,
  Divider
} from "@mui/material";

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
import ContragentListView from "features/Contragent/ContragentTypeListView";
import Contragent_interactionListView from "features/contragent_interaction/contragent_interactionListView";
import ApplicationWorkDocumentListView from "../../ApplicationWorkDocument/ApplicationWorkDocumentListView";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import storeComments from "../../ApplicationComments/ApplicationCommentsListView/store";
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
import {
  History,
  Send,
  Notifications,
  Assignment,
  Description,
  SavedSearch,
  Task,
  Payment,
  Business,
  Timeline,
  Print,
  ExitToApp,
  CheckCircle,
  SwapHoriz
} from "@mui/icons-material";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  overflow: "hidden",
  marginBottom: theme.spacing(2)
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
    backgroundColor: theme.palette.primary.main
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.95rem",
  minHeight: 56,
  color: theme.palette.text.secondary,
  transition: "all 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04)
  },
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    fontWeight: 600
  },
  "&.Mui-disabled": {
    opacity: 0.5
  }
}));

const StatusButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 500,
  padding: theme.spacing(0.75, 2),
  transition: "all 0.3s ease",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }
}));

const ActionButton = styled(Button)(({ theme, color = "primary" }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 500,
  padding: theme.spacing(0.75, 2),
  marginRight: theme.spacing(1),
  transition: "all 0.3s ease",
  ...(color === "success" && {
    backgroundColor: "#00875a",
    color: "white",
    "&:hover": {
      backgroundColor: "#006644"
    }
  }),
  ...(color === "warning" && {
    backgroundColor: "#ff652f",
    color: "white",
    "&:hover": {
      backgroundColor: "#e54e1b"
    }
  })
}));

const ActionIconButton = styled(IconButton)(({ theme, color }) => ({
  transition: "all 0.3s ease",
  ...(color === "success" && {
    color: "rgb(19,208,103)",
    "&:hover": {
      backgroundColor: alpha("rgb(19,208,103)", 0.1),
      transform: "scale(1.1)"
    }
  })
}));

const BackLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: 600,
  textDecoration: "none",
  transition: "all 0.2s ease",
  padding: theme.spacing(2),
  "&:hover": {
    color: theme.palette.primary.dark,
    transform: "translateX(-4px)"
  }
}));

const ElectronicOnlyBadge = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffeb3b",
  color: "#d32f2f",
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  fontWeight: "bold",
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3)
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2)
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    transform: "translateX(4px)"
  },
  "&.Mui-disabled": {
    opacity: 0.5
  }
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: 600,
  color: theme.palette.primary.main
}));

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
    return (
      <Box display="flex" justifyContent="flex-end" p={2}>
        <ActionButton
          variant="contained"
          color="secondary"
          id="id_ApplicationBackButton"
          onClick={() => navigate(MainStore.isFinancialPlan ? "/user/ApplicationFinPlan" : "/user/Application")}
          startIcon={<ExitToApp />}
        >
          {translate("common:goOut")}
        </ActionButton>
      </Box>
    );
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

  const getTabIcon = (index: number) => {
    switch(index) {
      case 0: return <Assignment sx={{ fontSize: 20 }} />;
      case 1: return <Description sx={{ fontSize: 20 }} />;
      case 2: return <SavedSearch sx={{ fontSize: 20 }} />;
      case 3: return <Task sx={{ fontSize: 20 }} />;
      case 4: return <Payment sx={{ fontSize: 20 }} />;
      case 5: return <Business sx={{ fontSize: 20 }} />;
      case 6: return <Timeline sx={{ fontSize: 20 }} />;
      default: return null;
    }
  };

  return (
    <>
      {/* Диалоги */}
      <Dialog
        open={store.openStatusHistoryPanel}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogHeader>
          <Box display="flex" alignItems="center" gap={1}>
            <History />
            {translate('label:application_subtask_assigneeAddEditView.entityTitle')}
          </Box>
        </DialogHeader>
        <DialogContent>
          <ApplicationStatusHistoryListView ApplicationID={store.id} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <CustomButton
            variant="contained"
            id="id_application_subtask_assigneeCancelButton"
            onClick={() => store.changeApplicationHistoryPanel(false)}
          >
            {translate("common:close")}
          </CustomButton>
        </DialogActions>
      </Dialog>

      <TechCouncilForm
        openPanel={store.isOpenTechCouncil}
        onSaveClick={() => {
          TechCouncilStore.onCloseTechCouncil();
          store.isOpenTechCouncil = false
        }}
        idApplication={store.id}
        idService={store.service_id}
      />

      {/* Заголовок с действиями */}
      <HeaderSection>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <StatusButton
            size="small"
            variant="contained"
            onClick={handleClick}
            endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            startIcon={<SwapHoriz />}
          >
            {`${translate("label:ApplicationAddEditView.status")}${store.Statuses.find(s => s.id === store.status_id)?.name}`}
          </StatusButton>
          
          {filteredStatuses?.length > 0 && (
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  mt: 1,
                  minWidth: 250
                }
              }}
            >
              <Typography variant="h6" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                {translate("common:Select_status")}
              </Typography>
              <Divider />
              {store.id > 0 && store.status_id > 0 && filteredStatuses.map(x => (
                <StyledMenuItem
                  key={x.id}
                  onClick={() => store.changeToStatus(x.id)}
                  disabled={!x.is_allowed}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    {x.is_allowed && <CheckCircle fontSize="small" color="success" />}
                    {x.name}
                  </Box>
                </StyledMenuItem>
              ))}
            </Menu>
          )}

          <ActionButton
            size="small"
            variant="contained"
            onClick={() => store.changeApplicationHistoryPanel(true)}
            startIcon={<History />}
          >
            {translate("label:ApplicationAddEditView.statusHistory")}
          </ActionButton>

          {(store.status_code === APPLICATION_STATUSES.document_issued ||
            store.status_code === APPLICATION_STATUSES.refusal_issued) &&
            (store.arch_process_id === null && (
              <ActionButton
                color="warning"
                size="small"
                variant="contained"
                onClick={() => store.toDutyPlanClicked(true)}
                startIcon={<Send />}
              >
                {translate("Передать в ЦиДП")}
              </ActionButton>
            ))
          }

          <Box display="flex" gap={1}>
            <Tooltip title={translate("label:ApplicationAddEditView.customer_sendDocument")}>
              <ActionIconButton 
                disabled={!isDisabled} 
                onClick={() => store.openSendDocumentsPanel()}
                color="success"
              >
                <DriveFileMoveIcon fontSize="large" />
              </ActionIconButton>
            </Tooltip>

            <Tooltip title={translate("label:ApplicationAddEditView.customer_notify")}>
              <ActionIconButton 
                disabled={!isDisabled} 
                onClick={() => store.openSmsPanel()}
                color="success"
              >
                <ForwardToInboxTwoToneIcon fontSize="large" />
              </ActionIconButton>
            </Tooltip>

            <Tooltip title={translate("label:ApplicationAddEditView.notify_history")}>
              <ActionIconButton 
                disabled={!isDisabled} 
                onClick={() => store.openHistoryPanel()}
                color="success"
              >
                <ScheduleSendTwoToneIcon fontSize="large" />
              </ActionIconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {store.is_electronic_only && (
            <ElectronicOnlyBadge>
              <Notifications />
              {translate("label:ApplicationAddEditView.only_electronic")}
            </ElectronicOnlyBadge>
          )}
          <Typography variant="h6" fontWeight={600} color="primary">
            #{store.number}
          </Typography>
        </Box>
      </HeaderSection>

      {/* Попапы */}
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
        applicationId={store.id}
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

      {/* Табы */}
      <StyledPaper elevation={0}>
        <StyledTabs 
          variant="fullWidth" 
          value={value} 
          onChange={handleChange}
        >
          <StyledTab 
            data-testid="application_task_assignee_tab_title" 
            label={translate("label:ApplicationAddEditView.TabName_app")} 
            icon={getTabIcon(0)}
            iconPosition="start"
            {...a11yProps(0)} 
          />
          <StyledTab 
            disabled={store.id === 0} 
            data-testid="application_document_tab_title"
            label={translate("label:ApplicationAddEditView.TabName_documents")} 
            icon={getTabIcon(1)}
            iconPosition="start"
            {...a11yProps(1)} 
          />
          {!isCabinet && (
            <StyledTab 
              disabled={store.id === 0} 
              data-testid="application_saved_document_tab_title"
              label={translate("label:ApplicationAddEditView.TabName_saved_document")} 
              icon={getTabIcon(2)}
              iconPosition="start"
              {...a11yProps(5)} 
            />
          )}
          {!isCabinet && (
            <StyledTab 
              disabled={store.id === 0} 
              data-testid="application_subtask_tab_title"
              label={translate("label:ApplicationAddEditView.TabName_tasks")} 
              icon={getTabIcon(3)}
              iconPosition="start"
              {...a11yProps(3)} 
            />
          )}
          {!isCabinet && (
            <StyledTab 
              disabled={store.id === 0} 
              data-testid="application_payment_tab_title"
              label={translate("label:ApplicationAddEditView.TabName_payment")} 
              icon={getTabIcon(4)}
              iconPosition="start"
              {...a11yProps(2)} 
            />
          )}
          {!isCabinet && (
            <StyledTab 
              disabled={store.id === 0} 
              data-testid="application_contragent_title"
              label={translate("label:ApplicationAddEditView.TabName_contragent")} 
              icon={getTabIcon(5)}
              iconPosition="start"
              {...a11yProps(6)} 
            />
          )}
          {!isCabinet && (
            <StyledTab 
              disabled={store.id === 0} 
              data-testid="application_subtask_tab_title"
              label={translate("label:ApplicationAddEditView.TabName_history")} 
              icon={getTabIcon(6)}
              iconPosition="start"
              {...a11yProps(4)} 
            />
          )}
        </StyledTabs>
      </StyledPaper>

      {/* Ссылка назад */}
      <BackLink 
        href={MainStore.isFinancialPlan ? "/user/ApplicationFinPlan" : (isCabinet ? "/user/AppsFromCabinet" : "/user/Application")}
      >
        <KeyboardBackspaceIcon />
        {translate("common:backtoApp")}
      </BackLink>

      {/* Контент табов */}
      <CustomTabPanel value={value} index={0}>
        <ApplicationAddEditBaseView {...props}>
          <Box display="flex" p={2} gap={2}>
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
            
            <CustomButton
              color="secondary"
              sx={{ color: "white", backgroundColor: "#DE350B !important" }}
              variant="contained"
              id="id_ApplicationCancelButton"
              onClick={() => navigate(MainStore.isFinancialPlan ? "/user/ApplicationFinPlan" : "/user/Application")}
            >
              {translate("common:goOut")}
            </CustomButton>
          </Box>
        </ApplicationAddEditBaseView>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          {store.id > 0 && (
            <ActionButton 
              variant="contained" 
              onClick={() => MyTemplatesStore.onPrintClick(store.id)}
              startIcon={<Print />}
            >
              {translate("common:print")}
            </ActionButton>
          )}
        </Box>

        {store.id !== 0 && <Uploaded_application_documentListView idMain={store.id} />}
        {store.id !== 0 && <Outgoing_Uploaded_application_documentListGridView idMain={store.id} />}
        {store.id > 0 && <ApplicationWorkDocumentListView idApplication={store.id} />}
        <BackButton />
      </CustomTabPanel>
      
      <MyTemplatesPrintView application_id={store.id} />

      <CustomTabPanel value={value} index={2}>
        {store.id !== 0 && <Saved_application_documentListView idMain={store.id} />}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        {store.id !== 0 && <Application_taskListView idMain={store.id} />}
        <BackButton />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        {store.id !== 0 && <FastInputapplication_paymentView idMain={store.id} statusCode={store.Statuses.find(s => s.id == store.status_id)?.code ?? ""} isDisabled={isDisabled} />}
        {store.id !== 0 && <FastInputapplication_paid_invoiceView idMain={store.id} isDisabled={isDisabled} />}
        <BackButton />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={5}>
        {store.id !== 0 && <Contragent_interactionListView idMain={store.id} />}
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
    <Fade in={value === index} timeout={300}>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <TabPanel>{children}</TabPanel>}
      </div>
    </Fade>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

export default ApplicationAddEditView;