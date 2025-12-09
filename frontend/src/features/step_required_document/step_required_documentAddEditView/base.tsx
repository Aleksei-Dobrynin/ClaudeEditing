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

type step_required_documentTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Basestep_required_documentView: FC<step_required_documentTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="step_required_documentForm" id="step_required_documentForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="step_required_document_TitleName">
                  {translate('label:step_required_documentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.document_type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="document_type_id"
                      data={store.application_documents}
                      id='id_f_step_required_document_document_type_id'
                      label={translate('label:step_required_documentAddEditView.document_type_id')}
                      helperText={store.errors.document_type_id}
                      error={!!store.errors.document_type_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_required}
                      onChange={(event) => store.handleChange(event)}
                      name="is_required"
                      label={translate('label:step_required_documentAddEditView.is_required')}
                      id='id_f_step_required_document_is_required'
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

export default Basestep_required_documentView;
