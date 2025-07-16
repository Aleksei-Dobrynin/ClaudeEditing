import { FC, useEffect } from "react";
import { default as Arch_object_tagAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type arch_object_tagProps = {};

const arch_object_tagAddEditView: FC<arch_object_tagProps> = observer((props) => {
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
    <Arch_object_tagAddEditBaseView {...props}>

      
    
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_arch_object_tagSaveButton"
              name={'arch_object_tagAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/arch_object_tag')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_arch_object_tagCancelButton"
              name={'arch_object_tagAddEditView.cancel'}
              onClick={() => navigate('/user/arch_object_tag')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Arch_object_tagAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default arch_object_tagAddEditView