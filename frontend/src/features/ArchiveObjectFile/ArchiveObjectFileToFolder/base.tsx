import React, { FC, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Button,
  makeStyles,
  FormControlLabel,
  Container,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import FileField from "../../../components/FileField";
import AutocompleteCustom from "components/Autocomplete";
import CustomButton from "components/Button";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>


      <AutocompleteCustom
        value={store.archive_folder_id}
        onChange={(event) => store.handleChange(event)}
        name="archive_folder_id"
        fieldNameDisplay={(field) => field.archive_folder_name}
        data={store.ArchiveFolders}
        id='id_f_archive_folder_dutyplan_object_id'
        label={translate('label:archive_folderAddEditView.archive_folder_id')}
        helperText={store.errorarchive_folder_id}
        error={!!store.errorarchive_folder_id}
      />

      <Box display={"flex"} justifyContent={"flex-end"}>
        <CustomButton variant="contained" sx={{ mb: 2, mt: 2 }} onClick={() => {
          store.openAddFolder = true;
        }}>
          Добавить новую папку
        </CustomButton>
      </Box>

    </Container>
  );
})


export default BaseView;
