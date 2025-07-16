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
import CustomCheckbox from "../../../components/Checkbox";

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

        <form id="ApplicationDocumentForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ApplicationDocument_TitleName">
                  {translate('label:ApplicationDocumentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname != ''}
                      id='id_f_ApplicationDocument_name'
                      label={translate('label:ApplicationDocumentAddEditView.name')}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.document_type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="document_type_id"
                      data={store.DocumentTypes}
                      id='id_f_document_type_id'
                      label={translate('label:ApplicationDocumentAddEditView.document_type_id')}
                      helperText={store.errordocument_type_id}
                      error={!!store.errordocument_type_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription != ''}
                      id='id_f_ApplicationDocument_description'
                      label={translate('label:ApplicationDocumentAddEditView.description')}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorlaw_description}
                      error={store.errorlaw_description != ''}
                      id='id_f_ApplicationDocument_law_description'
                      label={translate('label:ApplicationDocumentAddEditView.law_description')}
                      value={store.law_description}
                      onChange={(event) => store.handleChange(event)}
                      name="law_description"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.doc_is_outcome}
                      onChange={(event) => store.handleChange(event)}
                      name="doc_is_outcome"
                      label={translate('label:ApplicationDocumentAddEditView.doc_is_outcome')}
                      id='id_f_ApplicationDocument_doc_is_outcome'
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
