import { FC, useEffect } from "react";
import { default as ApplicationWorkDocumentAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type ApplicationWorkDocumentProps = {};

const ApplicationWorkDocumentAddEditView: FC<ApplicationWorkDocumentProps> = observer((props) => {
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
    <ApplicationWorkDocumentAddEditBaseView {...props}>



      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_ApplicationWorkDocumentSaveButton"
              name={'ApplicationWorkDocumentAddEditView.save'}
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate('/user/ApplicationWorkDocument')
                })
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_ApplicationWorkDocumentCancelButton"
              name={'ApplicationWorkDocumentAddEditView.cancel'}
              onClick={() => navigate('/user/ApplicationWorkDocument')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </ApplicationWorkDocumentAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default ApplicationWorkDocumentAddEditView