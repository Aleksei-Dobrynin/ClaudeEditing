import { FC, useEffect } from "react";
import { default as StructureTemplatesAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import S_DocumentTemplateTranslationTabView from "features/S_DocumentTemplateTranslation/S_DocumentTemplateTranslationListView/TabView";

type StructureTemplatesProps = {};

const StructureTemplatesAddEditView: FC<StructureTemplatesProps> = observer((props) => {
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
    <StructureTemplatesAddEditBaseView {...props}>

      <Grid item xs={12} spacing={0}>
        <S_DocumentTemplateTranslationTabView idMain={store.template_id} onChange={(translates) => store.languageChanged(translates)} />
      </Grid>

      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_StructureTemplatesSaveButton"
              name={'StructureTemplatesAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/StructureTemplates')
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
              id="id_StructureTemplatesCancelButton"
              name={'StructureTemplatesAddEditView.cancel'}
              onClick={() => navigate('/user/StructureTemplates')}
            >
              {translate("common:goOut")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </StructureTemplatesAddEditBaseView >
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default StructureTemplatesAddEditView