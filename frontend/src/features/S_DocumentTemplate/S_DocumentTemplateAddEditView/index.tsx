import { FC, useEffect } from "react";
import { default as S_DocumentTemplateAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";
import S_DocumentTemplateTranslationTabView from "features/S_DocumentTemplateTranslation/S_DocumentTemplateTranslationListView/TabView";

type S_DocumentTemplateProps = {};

const S_DocumentTemplateAddEditView: FC<S_DocumentTemplateProps> = observer((props) => {
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
    <S_DocumentTemplateAddEditBaseView {...props}>

      <Grid item xs={12} spacing={0}>
        <S_DocumentTemplateTranslationTabView idMain={store.id} onChange={(translates) => store.languageChanged(translates)} />
      </Grid>

      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_S_DocumentTemplateSaveButton"
              name={'S_DocumentTemplateAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/S_DocumentTemplate')
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
              id="id_S_DocumentTemplateCancelButton"
              name={'S_DocumentTemplateAddEditView.cancel'}
              onClick={() => navigate('/user/S_DocumentTemplate')}
            >
              {translate("common:goOut")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </S_DocumentTemplateAddEditBaseView >
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default S_DocumentTemplateAddEditView