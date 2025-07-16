import { FC, useEffect } from "react";
import { default as ReestrAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";
import Application_in_reestrListView from 'features/application_in_reestr/application_in_reestrListView';

type reestrProps = {};

const reestrAddEditView: FC<reestrProps> = observer((props) => {
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
    <>

      {/* {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>} */}

      {store.id > 0 && <Application_in_reestrListView idMain={store.id} />}
      <Grid item xs={12} spacing={0}>
        {/* <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_reestrSaveButton"
              name={'reestrAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/reestr')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_reestrCancelButton"
              name={'reestrAddEditView.cancel'}
              onClick={() => navigate('/user/reestr')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box> */}
      </Grid>
    </>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default reestrAddEditView