import { FC, useEffect } from "react";
import { default as Application_duty_objectAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type application_duty_objectProps = {};

const application_duty_objectAddEditView: FC<application_duty_objectProps> = observer((props) => {
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
    <Application_duty_objectAddEditBaseView {...props}>



      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_application_duty_objectSaveButton"
              name={'application_duty_objectAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/application_duty_object')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_application_duty_objectCancelButton"
              name={'application_duty_objectAddEditView.cancel'}
              onClick={() => navigate('/user/application_duty_object')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Application_duty_objectAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default application_duty_objectAddEditView