import { FC, useEffect } from "react";
import { default as Contragent_interactionAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";
import Chat from "./chat";
import document_store from '../../contragent_interaction_doc/contragent_interaction_docListView/store'

type contragent_interactionProps = {};

const contragent_interactionAddEditView: FC<contragent_interactionProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")

  useEffect(() => {
    if ((id != null) &&
      (id !== '') &&
      !isNaN(Number(id.toString()))) {
      document_store.idMain = Number(id)
      store.doLoad(Number(id))
    } else {
      navigate('/error-404')
    }
    return () => {
      store.clearStore()
    }
  }, [])

  return (
    <Container>
    <Contragent_interactionAddEditBaseView {...props}>

      {/* start MTM */}
      {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs id={Number(id)} /></Grid>}
      {/* end MTM */}



      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_contragent_interactionSaveButton"
              name={'contragent_interactionAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  store.customParrent ? navigate(-1) : navigate('/user/contragent_interaction')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_contragent_interactionCancelButton"
              name={'contragent_interactionAddEditView.cancel'}
              onClick={() => store.customParrent ? navigate(-1) : navigate('/user/contragent_interaction')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Contragent_interactionAddEditBaseView>
    </Container>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default contragent_interactionAddEditView