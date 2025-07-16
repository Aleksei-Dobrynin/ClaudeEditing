import React, { FC, useEffect } from "react";
import { default as ArchiveLogAddEditBaseView } from './base'
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
import MainStore from "../../../MainStore";

type ArchiveLogProps = {};

const ArchiveLogAddEditView: FC<ArchiveLogProps> = observer((props) => {
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
    <ArchiveLogAddEditBaseView {...props}>

      <Box display="flex" p={2}>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_ArchiveLogSaveButton"
            disabled={!MainStore.isArchive}
            onClick={() => {
              store.onSaveClick((id: number) => {
                navigate('/user/ArchiveLog')
              })
            }}
          >
            {translate("common:save")}
          </CustomButton>
        </Box>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_ArchiveLogCancelButton"
            onClick={() => navigate('/user/ArchiveLog')}
          >
            {translate("common:cancel")}
          </CustomButton>
        </Box>
      </Box>
    </ArchiveLogAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default ArchiveLogAddEditView