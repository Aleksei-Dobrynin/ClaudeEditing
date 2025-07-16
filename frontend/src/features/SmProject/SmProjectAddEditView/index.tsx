import { FC, useEffect } from "react";
import { default as SmProjectAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";
import SmAttributeTriggerFastInput from "features/SmAttributeTrigger/SmAttributeTriggerAddEditView/fastInput";
import SmProjectTagFastInput from "features/SmProjectTag/SmProjectTagAddEditView/fastInput";

type SmProjectProps = {};

const SmProjectAddEditView: FC<SmProjectProps> = observer((props) => {
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
    <SmProjectAddEditBaseView {...props}>


      {/* fast inputs */}
      {store.id > 0 && <Grid item xs={12} md={6} spacing={0}>
        <SmAttributeTriggerFastInput idMain={store.id} />
        <SmProjectTagFastInput idMain={store.id} />
      </Grid>}

      {/* mtm tabs */}
      {store.id > 0 && <Grid item xs={12} spacing={0}>
        <MtmTabs />
      </Grid>}

      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_SmProjectSaveButton"
              name={'SmProjectAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/SmProject')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_SmProjectCancelButton"
              name={'SmProjectAddEditView.cancel'}
              onClick={() => navigate('/user/SmProject')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </SmProjectAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default SmProjectAddEditView