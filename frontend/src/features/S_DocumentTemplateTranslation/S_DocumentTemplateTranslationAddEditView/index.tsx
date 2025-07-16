import { FC, useEffect } from "react";
import { default as S_DocumentTemplateTranslationAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type S_DocumentTemplateTranslationProps = {};

const S_DocumentTemplateTranslationAddEditView: FC<S_DocumentTemplateTranslationProps> = observer((props) => {
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
    <S_DocumentTemplateTranslationAddEditBaseView {...props}>

      
    
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_S_DocumentTemplateTranslationSaveButton"
              name={'S_DocumentTemplateTranslationAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/S_DocumentTemplateTranslation')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_S_DocumentTemplateTranslationCancelButton"
              name={'S_DocumentTemplateTranslationAddEditView.cancel'}
              onClick={() => navigate('/user/S_DocumentTemplateTranslation')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </S_DocumentTemplateTranslationAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default S_DocumentTemplateTranslationAddEditView