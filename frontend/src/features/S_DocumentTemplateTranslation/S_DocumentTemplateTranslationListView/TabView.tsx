import React, { FC, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import S_DocumentTemplateTranslationPopupForm from './../S_DocumentTemplateTranslationAddEditView/popupForm'
import styled from 'styled-components';
import Ckeditor from 'components/ckeditor/ckeditor';


type S_DocumentTemplateTranslationListViewProps = {
  idMain: number;
  onChange: (translates: any[]) => void;
};


const S_DocumentTemplateTranslationTabView: FC<S_DocumentTemplateTranslationListViewProps> = observer((props) => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // if(props.idMain === 0) return;
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadS_DocumentTemplateTranslations()
    return () => store.clearStore()
  }, [props.idMain])

  return (
    <Box component={Paper} elevation={5}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {store.data.map((x, i) => {
            return <Tab key={`${x.id}_${x.idLanguage}`} label={x.idLanguage_name} {...a11yProps(i)} />
          })}
        </Tabs>
      </Box>

      {store.data.map((x, i) => {
        return <CustomTabPanel key={`${x.id}_${x.idLanguage}`} value={value} index={i}>
          <Ckeditor
            value={x.template}
            onChange={(event) => { 
              store.changeTemplate(event.target.value, i)
              props.onChange(store.data)
            }}
            name={`template_${x.id}`}
            id={`id_f_S_DocumentTemplateTranslation_template_${x.id}`}
          />
        </CustomTabPanel>
      })}

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



export default S_DocumentTemplateTranslationTabView
