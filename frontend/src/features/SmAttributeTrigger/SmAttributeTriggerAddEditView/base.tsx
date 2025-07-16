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

type SmAttributeTriggerProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<SmAttributeTriggerProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form id="SmAttributeTriggerForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="SmAttributeTrigger_TitleName">
                  {translate('label:SmAttributeTriggerAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.attribute_id}
                      onChange={(event) => store.handleChange(event)}
                      name="attribute_id"
                      data={store.EntityAttributes}
                      id='id_f_SmAttributeTrigger_attribute_id'
                      label={translate('label:SmAttributeTriggerAddEditView.attribute_id')}
                      helperText={store.errorattribute_id}
                      error={store.errorattribute_id !== ''}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.value}
                      onChange={(event) => store.handleChange(event)}
                      name="value"
                      id='id_f_SmProject_value'
                      label={translate('label:SmAttributeTriggerAddEditView.value')}
                      helperText={store.errorvalue}
                      error={store.errorvalue !== ''}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
      {props.children}
    </Container>
  );
})


export default BaseView;
