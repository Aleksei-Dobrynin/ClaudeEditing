import React, { FC, useEffect } from "react";
import { default as DocumentJournalsAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import {
  Box, Grid
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type DocumentJournalsProps = {};

const DocumentJournalsAddEditView: FC<DocumentJournalsProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")

  useEffect(() => {
    if ((id !== null) &&
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
    <DocumentJournalsAddEditBaseView {...props}>

      {/* start MTM */}
      {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}
      {/* end MTM */}

      <Box display="flex" p={2}>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_DocumentJournalsSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => {
                navigate(`/user/DocumentJournals/addedit?id=${id}`);
              })
            }}
          >
            {translate("common:save")}
          </CustomButton>
        </Box>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_DocumentJournalsCancelButton"
            onClick={() => navigate('/user/DocumentJournals')}
          >
            {translate("common:cancel")}
          </CustomButton>
        </Box>
      </Box>
    </DocumentJournalsAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default DocumentJournalsAddEditView