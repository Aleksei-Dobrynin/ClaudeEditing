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
import TreeLookUp from "../../../components/TreeLookup";
import MtmLookup from "../../../components/mtmLookup";
import MuiLookUp from "../../../components/MuiLookUp";
import AutocompleteCustom from "../../../components/Autocomplete";

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

        <form id="ServiceDocumentForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ServiceDocument_TitleName">
                  {translate('label:ServiceDocumentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <AutocompleteCustom
                      value={store.application_document_id}
                      onChange={(event) => store.handleChange(event)}
                      data={store.ApplicationDocuments}
                      name="application_document_id"
                      label={translate('label:ServiceDocumentAddEditView.application_document_id')}
                      // getOptionLabel={(employee) =>
                      //   employee
                      //     ? `${employee.last_name || ""} ${employee.first_name || ""} ${employee.second_name || ""}`
                      //     : ""
                      // }
                      fieldNameDisplay={(e) => `${e.name} ${e.doc_is_outcome = true ? 
                        translate('label:ServiceDocumentAddEditView.outcome') :
                        translate('label:ServiceDocumentAddEditView.income') }`}
                      id="application_document_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <MuiLookUp
                      maxWidth={450}
                      value={store.application_document_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_document_id"
                      data={store.ApplicationDocuments}
                      id='id_f_application_document_id'
                      label={translate('label:ServiceDocumentAddEditView.application_document_id')}
                      helperText={store.errorapplication_document_id}
                      error={!!store.errorapplication_document_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_required}
                      onChange={(event) => store.handleChange(event)}
                      name="is_required"
                      label={translate('label:ServiceDocumentAddEditView.is_required')}
                      id='id_f_ServiceDocument_is_required'
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
