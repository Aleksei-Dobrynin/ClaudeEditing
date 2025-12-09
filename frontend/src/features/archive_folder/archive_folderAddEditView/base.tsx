import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";


type archive_folderTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idDutyPlan?: number;
};

const Basearchive_folderView: FC<archive_folderTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="archive_folderForm" id="archive_folderForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="archive_folder_TitleName">
                  {translate('label:archive_folderAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.archive_folder_name}
                      onChange={(event) => store.handleChange(event)}
                      name="archive_folder_name"
                      data-testid="id_f_archive_folder_archive_folder_name"
                      id='id_f_archive_folder_archive_folder_name'
                      label={translate('label:archive_folderAddEditView.archive_folder_name')}
                      helperText={store.errors.archive_folder_name}
                      error={!!store.errors.archive_folder_name}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})

export default Basearchive_folderView;
