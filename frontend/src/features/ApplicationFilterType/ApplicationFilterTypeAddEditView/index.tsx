import React, { FC, useEffect } from "react";
import { default as ApplicationFilterTypeAddEditBaseView } from './base'
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

type ApplicationFilterTypeProps = {};

const ApplicationFilterTypeAddEditView: FC<ApplicationFilterTypeProps> = observer((props) => {
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
    <ApplicationFilterTypeAddEditBaseView {...props}>

      <Box display="flex" p={2}>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_ApplicationFilterTypeSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => {
                navigate('/user/FilterTypeApplication')
              })
            }}
          >
            {translate("common:save")}
          </CustomButton>
        </Box>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_ApplicationFilterTypeCancelButton"
            onClick={() => navigate('/user/FilterTypeApplication')}
          >
            {translate("common:cancel")}
          </CustomButton>
        </Box>
      </Box>
    </ApplicationFilterTypeAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default ApplicationFilterTypeAddEditView