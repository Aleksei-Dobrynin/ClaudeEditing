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
import Ckeditor from "components/ckeditor/ckeditor";
import Editor from "./editor";

type S_DocumentTemplateTranslationTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseS_DocumentTemplateTranslationView: FC<S_DocumentTemplateTranslationTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="S_DocumentTemplateTranslationForm" id="S_DocumentTemplateTranslationForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="S_DocumentTemplateTranslation_TitleName">
                  {translate('label:S_DocumentTemplateTranslationAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idLanguage}
                      onChange={(event) => store.handleChange(event)}
                      name="idLanguage"
                      data={store.Languages}
                      id='id_f_S_DocumentTemplateTranslation_idLanguage'
                      label={translate('label:S_DocumentTemplateTranslationAddEditView.idLanguage')}
                      helperText={store.errors.idLanguage}
                      error={!!store.errors.idLanguage}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Ckeditor
                      value={store.template}
                      onChange={(event) => store.handleChange(event)}
                      name="template"
                      id='id_f_S_DocumentTemplateTranslation_template'
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

export default BaseS_DocumentTemplateTranslationView;
