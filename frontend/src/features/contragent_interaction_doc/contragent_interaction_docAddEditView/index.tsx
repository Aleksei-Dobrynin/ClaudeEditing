import { FC, useEffect } from "react";
import { default as Contragent_interaction_docAddEditBaseView } from './base';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react";
import store from "./store";
import CustomButton from 'components/Button';

type Contragent_interaction_docProps = {};

const Contragent_interaction_docAddEditView: FC<Contragent_interaction_docProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");

  useEffect(() => {
    if (id != null && id !== '' && !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id));
    } else {
      navigate('/error-404');
    }
    
    return () => {
      store.clearStore();
    };
  }, [id, navigate]);

  return (
    <Contragent_interaction_docAddEditBaseView {...props}>
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_contragent_interaction_docSaveButton"
              name="contragent_interaction_docAddEditView.save"
              onClick={() => {
                store.onSaveClick(() => {
                  navigate('/user/contragent_interaction_doc');
                });
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_contragent_interaction_docCancelButton"
              name="contragent_interaction_docAddEditView.cancel"
              onClick={() => navigate('/user/contragent_interaction_doc')}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </Contragent_interaction_docAddEditBaseView>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default Contragent_interaction_docAddEditView;