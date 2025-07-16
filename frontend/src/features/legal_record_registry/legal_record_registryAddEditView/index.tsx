import { FC, useEffect } from "react";
import { default as Baselegal_record_registryView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type legal_record_registryProps = {};

const legal_record_registryAddEditView: FC<legal_record_registryProps> = observer((props) => {
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
    <Baselegal_record_registryView {...props}>

      {/* start MTM */}
            {/* {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>} */}
            {/* end MTM */}
    
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_legal_record_registrySaveButton"
              name={'legal_record_registryAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/legal_record_registry')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_legal_record_registryCancelButton"
              name={'legal_record_registryAddEditView.cancel'}
              onClick={() => navigate('/user/legal_record_registry')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Baselegal_record_registryView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default legal_record_registryAddEditView