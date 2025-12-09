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

type S_PlaceHolderTemplateTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};


const BaseS_PlaceHolderTemplateView: FC<S_PlaceHolderTemplateTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="S_PlaceHolderTemplateForm" id="S_PlaceHolderTemplateForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="S_PlaceHolderTemplate_TitleName">
                  {translate('label:S_PlaceHolderTemplateAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_S_PlaceHolderTemplate_name"
                      id='id_f_S_PlaceHolderTemplate_name'
                      label={translate('label:S_PlaceHolderTemplateAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.value}
                      onChange={(event) => store.handleChange(event)}
                      name="value"
                      data-testid="id_f_S_PlaceHolderTemplate_value"
                      id='id_f_S_PlaceHolderTemplate_value'
                      label={translate('label:S_PlaceHolderTemplateAddEditView.value')}
                      helperText={store.errors.value}
                      error={!!store.errors.value}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_S_PlaceHolderTemplate_code"
                      id='id_f_S_PlaceHolderTemplate_code'
                      label={translate('label:S_PlaceHolderTemplateAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idPlaceholderType}
                      onChange={(event) => store.handleChange(event)}
                      name="idPlaceholderType"
                      data={store.S_PlaceHolderTypes}
                      id='id_f_S_PlaceHolderTemplate_idPlaceholderType'
                      label={translate('label:S_PlaceHolderTemplateAddEditView.idPlaceholderType')}
                      helperText={store.errors.idPlaceholderType}
                      error={!!store.errors.idPlaceholderType}
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

export default BaseS_PlaceHolderTemplateView;
