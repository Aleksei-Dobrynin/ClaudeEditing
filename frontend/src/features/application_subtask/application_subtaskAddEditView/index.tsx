import { FC, useEffect } from "react";
import { default as Application_subtaskAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type application_subtaskProps = {};

const application_subtaskAddEditView: FC<application_subtaskProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")
  const task_id = query.get("task_id")

  useEffect(() => {
    if ((id != null) &&
      (id !== '') &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id))
    } else {
      navigate('/error-404')
    }
    if ((task_id != null) &&
      (task_id !== '') &&
      !isNaN(Number(task_id.toString()))) {
      store.changeApplicationTaskId(Number(task_id))
    }
    return () => {
      store.clearStore()
    }
  }, [])

  return (
    <Application_subtaskAddEditBaseView {...props}>

      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_application_subtaskSaveButton"
              disabled={!store.changed}
              name={'application_subtaskAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  if (store.id === 0) {
                    store.firstSaved = true;
                    navigate(`/user/application_subtask/addedit?id=${id}`)
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
              color={"secondary"}
              sx={{ color: "white", backgroundColor: "#DE350B !important" }}
              id="id_application_subtaskCancelButton"
              name={'application_subtaskAddEditView.cancel'}
              onClick={() => {
                // navigate(`/user/application_task/addedit?id=${store.application_task_id}`)
                //navigate(`/user/my_tasks`)
                if (store.firstSaved)
                  navigate(-2)
                else navigate(-1)
              }}
            >
              {translate("common:close")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Application_subtaskAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default application_subtaskAddEditView