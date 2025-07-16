import { FC, useEffect } from "react";
import { default as S_QueryAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type S_QueryProps = {};

const S_QueryAddEditView: FC<S_QueryProps> = observer((props) => {
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
    <S_QueryAddEditBaseView {...props}>

      {/* start MTM */}
      {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}
      {/* end MTM */}

      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_S_QuerySaveButton"
              name={'S_QueryAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/S_Query')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              color={"secondary"}
              sx={{color:"white", backgroundColor: "red !important"}}
              variant="contained"
              id="id_S_QueryCancelButton"
              name={'S_QueryAddEditView.cancel'}
              onClick={() => navigate('/user/S_Query')}
            >
              {translate("common:goOut")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </S_QueryAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default S_QueryAddEditView