import { FC, useEffect } from "react";
import Baseunit_for_field_configView from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type unit_for_field_configProps = {};

const Unit_for_field_configAddEditView: FC<unit_for_field_configProps> = observer((props) => {
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
    <Baseunit_for_field_configView {...props}>

      
    
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_unit_for_field_configSaveButton"
              name={'unit_for_field_configAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/unit_for_field_config')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_unit_for_field_configCancelButton"
              name={'unit_for_field_configAddEditView.cancel'}
              onClick={() => navigate('/user/unit_for_field_config')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Baseunit_for_field_configView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default Unit_for_field_configAddEditView