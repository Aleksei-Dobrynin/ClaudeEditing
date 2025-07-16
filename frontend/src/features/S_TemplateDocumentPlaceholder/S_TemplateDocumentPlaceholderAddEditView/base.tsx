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

type S_TemplateDocumentPlaceholderTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseS_TemplateDocumentPlaceholderView: FC<S_TemplateDocumentPlaceholderTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="S_TemplateDocumentPlaceholderForm" id="S_TemplateDocumentPlaceholderForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="S_TemplateDocumentPlaceholder_TitleName">
                  {translate('label:S_TemplateDocumentPlaceholderAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idTemplateDocument}
                      onChange={(event) => store.handleChange(event)}
                      name="idTemplateDocument"
                      data={store.S_DocumentTemplateTranslations}
                      id='id_f_S_TemplateDocumentPlaceholder_idTemplateDocument'
                      label={translate('label:S_TemplateDocumentPlaceholderAddEditView.idTemplateDocument')}
                      helperText={store.errors.idTemplateDocument}
                      error={!!store.errors.idTemplateDocument}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idPlaceholder}
                      onChange={(event) => store.handleChange(event)}
                      name="idPlaceholder"
                      data={store.S_PlaceHolderTemplates}
                      id='id_f_S_TemplateDocumentPlaceholder_idPlaceholder'
                      label={translate('label:S_TemplateDocumentPlaceholderAddEditView.idPlaceholder')}
                      helperText={store.errors.idPlaceholder}
                      error={!!store.errors.idPlaceholder}
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

export default BaseS_TemplateDocumentPlaceholderView;
