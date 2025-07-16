import React, { FC, useEffect } from "react";
import { default as ApplicationFilterAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import {
  Box,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';

type ApplicationFilterProps = {};

const ApplicationFilterAddEditView: FC<ApplicationFilterProps> = observer((props) => {
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
    <ApplicationFilterAddEditBaseView {...props}>

      <Box display="flex" p={2}>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_ApplicationFilterSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => {
                navigate('/user/FilterApplication')
              })
            }}
          >
            {translate("common:save")}
          </CustomButton>
        </Box>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_ApplicationFilterCancelButton"
            onClick={() => navigate('/user/FilterApplication')}
          >
            {translate("common:cancel")}
          </CustomButton>
        </Box>
      </Box>
    </ApplicationFilterAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default ApplicationFilterAddEditView