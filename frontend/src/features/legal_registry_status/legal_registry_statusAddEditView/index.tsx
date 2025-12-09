import { FC, useEffect } from "react";
import { default as Baselegal_registry_statusView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type legal_registry_statusProps = {};

const legal_registry_statusAddEditView: FC<legal_registry_statusProps> = observer((props) => {
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
    <Baselegal_registry_statusView {...props}>

      
    
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_legal_registry_statusSaveButton"
              name={'legal_registry_statusAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/legal_registry_status')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_legal_registry_statusCancelButton"
              name={'legal_registry_statusAddEditView.cancel'}
              onClick={() => navigate('/user/legal_registry_status')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Baselegal_registry_statusView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default legal_registry_statusAddEditView