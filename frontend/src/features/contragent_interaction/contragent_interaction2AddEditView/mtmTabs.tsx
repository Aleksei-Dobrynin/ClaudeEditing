import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { observer } from "mobx-react";
import { Grid, Paper } from "@mui/material";
import store from "./store";
import { useTranslation } from "react-i18next";
import Contragent_interaction_docListView from "features/contragent_interaction_doc/contragent_interaction_docListView";
import Chat from "./chat";
import CustomerChat from "./customer_chat";
import { FC } from "react";


type contragent_interactionProps = {
  id: number;
};

const contragent_interactionMtmTabs: FC<contragent_interactionProps> = observer((props) => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component={Paper} elevation={5}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab data-testid={"contragent_interaction_doc_tab_title"}
               label={translate("label:contragent_interaction_docListView.with_contragent")}
               sx={{ textTransform: "none" }} {...a11yProps(0)} />
          <Tab data-testid={"contragent_interaction_doc_tab_title"}
               label={translate("label:contragent_interaction_docListView.with_customer")}
               sx={{ textTransform: "none" }} {...a11yProps(1)} />

        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Grid item xs={12} spacing={0}><Chat interactionId={props.id}
                                             contragent={store.contragents.find(c => c.id === store.contragent_id)} /></Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid item xs={12} spacing={0}><CustomerChat interactionId={props.id}
                                                     contragent={store.contragents.find(c => c.id === store.contragent_id)} /></Grid>
      </CustomTabPanel>

    </Box>
  );

});


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


export default contragent_interactionMtmTabs;