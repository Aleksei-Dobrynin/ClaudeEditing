import { FC, useEffect } from 'react';
import {
  Box,
  Checkbox,
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Application_taskPopupForm from './../application_taskAddEditView/popupForm'
import styled from 'styled-components';
import CustomButton from 'components/Button';
import { useNavigate } from 'react-router-dom';
import TreeTasksView from './tree';


type application_taskListViewProps = {
};


const AllTasks: FC<application_taskListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  useEffect(() => {
    store.loadapplication_tasks()
  }, [])

  useEffect(() => {
    return () => store.clearStore()
  }, [])

  return (
    <Box>

      <TreeTasksView />

      <Application_taskPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idMain={store.idMain}
        onBtnCancelClick={() => {
          store.closePanel()
          store.loadapplication_tasks()
        }}
        onSaveClick={() => {
          store.closePanel()
          store.loadapplication_tasks()
        }}
      />

    </Box>
  );
})



export default AllTasks
