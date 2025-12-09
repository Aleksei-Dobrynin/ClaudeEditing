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

type S_QueriesDocumentTemplateTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseS_QueriesDocumentTemplateView: FC<S_QueriesDocumentTemplateTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="S_QueriesDocumentTemplateForm" id="S_QueriesDocumentTemplateForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="S_QueriesDocumentTemplate_TitleName">
                  {translate('label:S_QueriesDocumentTemplateAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idDocumentTemplate}
                      onChange={(event) => store.handleChange(event)}
                      name="idDocumentTemplate"
                      data={store.S_DocumentTemplateTranslations}
                      id='id_f_S_QueriesDocumentTemplate_idDocumentTemplate'
                      label={translate('label:S_QueriesDocumentTemplateAddEditView.idDocumentTemplate')}
                      helperText={store.errors.idDocumentTemplate}
                      error={!!store.errors.idDocumentTemplate}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idQuery}
                      onChange={(event) => store.handleChange(event)}
                      name="idQuery"
                      data={store.S_Querys}
                      id='id_f_S_QueriesDocumentTemplate_idQuery'
                      label={translate('label:S_QueriesDocumentTemplateAddEditView.idQuery')}
                      helperText={store.errors.idQuery}
                      error={!!store.errors.idQuery}
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

export default BaseS_QueriesDocumentTemplateView;
