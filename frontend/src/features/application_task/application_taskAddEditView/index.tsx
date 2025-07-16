import { FC, useEffect } from "react";
import { default as Application_taskAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import FastInputapplication_subtaskView from 'features/application_subtask/application_subtaskAddEditView/fastInput';

type application_taskProps = {};

const application_taskAddEditView: FC<application_taskProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")
  const application_id = query.get("application_id")

  useEffect(() => {
    if ((id != null) &&
      (id !== '') &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id))
    } else {
      navigate('/error-404')
    }
    if ((application_id != null) &&
      (application_id !== '') &&
      !isNaN(Number(application_id.toString()))) {
        store.changeAppliationId(Number(application_id))
    }
    return () => {
      store.clearStore()
    }
  }, [])

  return (
    <Application_taskAddEditBaseView {...props}>

      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_application_taskSaveButton"
              disabled={!store.changed}
              name={'application_taskAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  if(store.id === 0){
                    navigate(`/user/application_task/addedit?id=${id}`)
                  }
                  store.doLoad(id)
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_application_taskCancelButton"
              name={'application_taskAddEditView.cancel'}
              color={"secondary"}
              sx={{ color: "white", backgroundColor: "#DE350B !important" }}
              onClick={() => navigate(-1)}
              // onClick={() => navigate(`/user/application/addedit?id=${store.application_id}`)}
              // onClick={() => navigate(`/user/my_tasks`)}
            >
              {translate("common:close")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Application_taskAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default application_taskAddEditView