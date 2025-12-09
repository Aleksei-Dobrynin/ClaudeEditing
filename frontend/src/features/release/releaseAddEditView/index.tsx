import React, { FC, useEffect } from "react";
import { default as ReleaseAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid, Paper, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";
import Ckeditor from "components/ckeditor/ckeditor";

type releaseProps = {};

const releaseAddEditView: FC<releaseProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if ((id != null) &&
      (id !== '') &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id))
    } else {
      navigate('/error-404')
    }
    return () => {
      store.clearStore()
    }
  }, [])

  return (
    <ReleaseAddEditBaseView {...props}>

      <Grid item md={12} xs={12}>
        <Box component={Paper} elevation={5}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label={"На русском"} {...a11yProps(0)} />
              <Tab label={"Кыргызча"} {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <Ckeditor
              value={store.description ?? ""}
              onChange={(event) => {
                store.handleChange(event)
              }}
              withoutPlaceholder
              name={`description`}
              id={`id_f_release_description`}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Ckeditor
              value={store.description_kg ?? ""}
              withoutPlaceholder
              onChange={(event) => {
                store.handleChange(event)
              }}
              name={`description_kg`}
              id={`id_f_release_description_kg`}
            />
          </CustomTabPanel>
        </Box>
      </Grid>

      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_releaseSaveButton"
              name={'releaseAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/release')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_releaseCancelButton"
              name={'releaseAddEditView.cancel'}
              onClick={() => navigate('/user/release')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </ReleaseAddEditBaseView>
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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default releaseAddEditView