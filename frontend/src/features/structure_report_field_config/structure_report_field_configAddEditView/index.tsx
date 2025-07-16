import { FC, useEffect } from "react";
import Basestructure_report_field_configView from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type structure_report_field_configProps = {};

const Structure_report_field_configAddEditView: FC<structure_report_field_configProps> = observer((props) => {
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
    <Basestructure_report_field_configView {...props}>

      {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}


      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_structure_report_field_configSaveButton"
              name={'structure_report_field_configAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/structure_report_field_config')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_structure_report_field_configCancelButton"
              name={'structure_report_field_configAddEditView.cancel'}
              onClick={() => {
                navigate('/user/structure_report_field_config')
                store.clearStore()
              }
              }
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Basestructure_report_field_configView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default Structure_report_field_configAddEditView