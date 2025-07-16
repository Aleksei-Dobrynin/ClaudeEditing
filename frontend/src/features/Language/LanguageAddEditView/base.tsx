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

type LanguageTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseLanguageView: FC<LanguageTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="LanguageForm" id="LanguageForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="Language_TitleName">
                  {translate('label:LanguageAddEditView.entityTitle')}
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
                      data-testid="id_f_Language_name"
                      id='id_f_Language_name'
                      label={translate('label:LanguageAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_Language_description"
                      id='id_f_Language_description'
                      label={translate('label:LanguageAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_Language_code"
                      id='id_f_Language_code'
                      label={translate('label:LanguageAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.isDefault}
                      onChange={(event) => store.handleChange(event)}
                      name="isDefault"
                      label={translate('label:LanguageAddEditView.isDefault')}
                      id='id_f_Language_isDefault'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.queueNumber}
                      onChange={(event) => store.handleChange(event)}
                      name="queueNumber"
                      data-testid="id_f_Language_queueNumber"
                      id='id_f_Language_queueNumber'
                      label={translate('label:LanguageAddEditView.queueNumber')}
                      helperText={store.errors.queueNumber}
                      error={!!store.errors.queueNumber}
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

export default BaseLanguageView;
