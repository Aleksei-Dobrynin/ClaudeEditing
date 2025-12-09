import React, { FC, useEffect } from "react";
import { default as WorkflowAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import {
  Box,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type WorkflowProps = {};

const WorkflowAddEditView: FC<WorkflowProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")

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
    <WorkflowAddEditBaseView {...props}>

      <br/>
      {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}

      <Box display="flex" p={2}>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_WorkflowSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => {
                navigate(`/user/Workflow`)
              })
            }}
          >
            {translate("common:save")}
          </CustomButton>
        </Box>
        <Box m={2}>
          <CustomButton
            color={"secondary"}
            sx={{color:"white", backgroundColor: "red !important"}}
            variant="contained"
            id="id_WorkflowCancelButton"
            onClick={() => navigate('/user/Workflow')}
          >
            {translate("common:goOut")}
          </CustomButton>
        </Box>
      </Box>
    </WorkflowAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default WorkflowAddEditView