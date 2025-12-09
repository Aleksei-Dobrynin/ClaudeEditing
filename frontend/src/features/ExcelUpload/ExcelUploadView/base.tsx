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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import FileField from "components/FileField";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>
      <Grid container>

        <form id="ExcelUploadForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ExcelUpload_TitleName">
                  {translate('label:ExcelUploadView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <FileField
                      value={store.FileName}
                      helperText={store.errorFileName}
                      error={!!store.errorFileName}
                      inputKey={store.idDocumentinputKey}
                      fieldName="fileName"
                      onChange={(event) => {
                        if (event.target.files.length == 0) return
                        store.handleChange({ target: { value: event.target.files[0], name: "File" } })
                        store.handleChange({ target: { value: event.target.files[0].name, name: "FileName" } })
                      }}
                      onClear={() => {
                        store.handleChange({ target: { value: null, name: "File" } })
                        store.handleChange({ target: { value: '', name: "FileName" } })
                        store.changeDocInputKey()
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
})


export default BaseView;
