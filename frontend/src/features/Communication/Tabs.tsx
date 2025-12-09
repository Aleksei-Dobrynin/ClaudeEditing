import { FC } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Tabs, Tab, Box, Typography } from "@mui/material";


import store from "./store";
import TemplCommsFooterListView from "features/TemplCommsFooter/TemplCommsFooterListView";
import TemplCommsEmailListView from "features/TemplCommsEmail/TemplCommsEmailListView";
import TemplCommsEmailTabsViewView from "features/TemplCommsEmail/TemplCommsEmailListView/TabsView";
import TemplCommsReminderListView from "features/TemplCommsReminder/TemplCommsReminderListView";
import TemplCommsReminderFastInputView from "features/TemplCommsReminder/TemplCommsReminderAddEditView/fastInput";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      style={{ width: "100%" }}
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

type ScheduleCommunicationProps = {};

const ScheduleCommunication: FC<ScheduleCommunicationProps> = observer((props) => {
  return (
    <MainWrapper>
      <StyledTabs
        orientation="vertical"
        variant="scrollable"
        value={store.valueTab}
        onChange={store.handleTabSecondAccordionChange}
        aria-label="Vertical tabs example"
      >
        <StyledTab label="Email settings" {...a11yProps(0)} />
        <StyledTab label="Invite email" {...a11yProps(1)} />
        <StyledTab label="Reminder emails" {...a11yProps(2)} />
      </StyledTabs>
      <div style={{ width: 900 }}>
        <TabPanel value={store.valueTab} index={0}>
          <TemplCommsFooterListView template_comms_id={store.id} />
        </TabPanel>
        <TabPanel value={store.valueTab} index={1}>
          {/* <TemplCommsEmailListView template_comms_id={store.id}/> */}
          <TemplCommsEmailTabsViewView template_comms_id={store.id}/>
        </TabPanel>
        <TabPanel value={store.valueTab} index={2}>
          <TemplCommsReminderFastInputView idMain={store.id} />
        </TabPanel>
      </div>
    </MainWrapper>
  );
});

export default ScheduleCommunication;

const MainWrapper = styled.div`
  flex-grow: 1;
  display: flex;
`;

const StyledTabs = styled(Tabs)`
  background-color: var(--colorNeutralForeground8);
  min-width: 245px;
  padding-top: 20px;
  margin: 0 0 -16px -16px;
  border-radius: 0 0 0 9px !important;
  .MuiTabs-indicator {
    left: 0;
    width: 6px;
    background-color: var(--colorPaletteVioletBackground2);
  }
`;

const StyledTab = styled(Tab)`
  text-transform: none !important;
  color: var(--colorNeutralForeground2);
  align-items: baseline !important;
  padding-left: 28px !important;
  &.MuiTab-root.Mui-selected {
    color: var(--colorNeutralForeground2);
  }
`;
