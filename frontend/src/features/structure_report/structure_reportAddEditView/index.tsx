import { FC, useEffect } from "react";
import Basestructure_reportView from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type structure_reportProps = {};

const Structure_reportAddEditView: FC<structure_reportProps> = observer((props) => {
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
    <Basestructure_reportView {...props}>

      {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}


      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          {/* <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_structure_reportSaveButton"
              name={'structure_reportAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/structure_report')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box> */}
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_structure_reportCancelButton"
              name={'structure_reportAddEditView.cancel'}
              onClick={() => navigate('/user/structure_report')}
            >
              {translate("common:back")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Basestructure_reportView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default Structure_reportAddEditView