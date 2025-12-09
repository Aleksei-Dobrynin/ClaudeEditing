import React, { FC, useEffect } from "react";
import { default as ExcelUploadView } from './base'
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

type FileForApplicationDocumentProps = {};

const FileForApplicationDocumentAddEditView: FC<FileForApplicationDocumentProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    return () => {
      store.clearStore()
    }
  }, [])

  return (
    <ExcelUploadView {...props}>

      <Box display="flex" p={2}>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_FileForApplicationDocumentSaveButton"
            onClick={() => {
              store.onSaveClick(() => {})
            }}
          >
            {translate("common:add")}
          </CustomButton>
        </Box>
      </Box>
    </ExcelUploadView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default FileForApplicationDocumentAddEditView