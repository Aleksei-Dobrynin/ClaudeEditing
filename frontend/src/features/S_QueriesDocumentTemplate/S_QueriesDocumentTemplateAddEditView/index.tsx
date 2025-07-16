import { FC, useEffect } from "react";
import { default as S_QueriesDocumentTemplateAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type S_QueriesDocumentTemplateProps = {};

const S_QueriesDocumentTemplateAddEditView: FC<S_QueriesDocumentTemplateProps> = observer((props) => {
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
    <S_QueriesDocumentTemplateAddEditBaseView {...props}>

      
    
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_S_QueriesDocumentTemplateSaveButton"
              name={'S_QueriesDocumentTemplateAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/S_QueriesDocumentTemplate')
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
              id="id_S_QueriesDocumentTemplateCancelButton"
              name={'S_QueriesDocumentTemplateAddEditView.cancel'}
              onClick={() => navigate('/user/S_QueriesDocumentTemplate')}
            >
              {translate("common:goOut")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </S_QueriesDocumentTemplateAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default S_QueriesDocumentTemplateAddEditView