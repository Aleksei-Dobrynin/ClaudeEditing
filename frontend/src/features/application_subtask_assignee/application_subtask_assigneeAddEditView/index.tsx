import { FC, useEffect } from "react";
import { default as Application_subtask_assigneeAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type application_subtask_assigneeProps = {};

const application_subtask_assigneeAddEditView: FC<application_subtask_assigneeProps> = observer((props) => {
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
    <Application_subtask_assigneeAddEditBaseView {...props}>



      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_application_subtask_assigneeSaveButton"
              name={'application_subtask_assigneeAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/application_subtask_assignee')
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
              id="id_application_subtask_assigneeCancelButton"
              name={'application_subtask_assigneeAddEditView.cancel'}
              onClick={() => navigate('/user/application_subtask_assignee')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Application_subtask_assigneeAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default application_subtask_assigneeAddEditView