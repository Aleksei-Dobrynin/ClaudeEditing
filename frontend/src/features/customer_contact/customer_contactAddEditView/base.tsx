import React, { FC } from "react";
import { Card, CardContent, CardHeader, Container, Divider, Grid, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";

type customer_contactTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basecustomer_contactView: FC<customer_contactTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="customer_contactForm" id="customer_contactForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="customer_contact_TitleName">
                  {translate('label:customer_contactAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.value}
                      onChange={(event) => store.handleChange(event)}
                      name="value"
                      data-testid="id_f_customer_contact_value"
                      id='id_f_customer_contact_value'
                      label={translate('label:customer_contactAddEditView.value')}
                      helperText={store.errors.value}
                      error={!!store.errors.value}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="type_id"
                      data={store.contact_types}
                      id='id_f_customer_contact_type_id'
                      label={translate('label:customer_contactAddEditView.type_id')}
                      helperText={store.errors.type_id}
                      error={!!store.errors.type_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.allow_notification}
                      onChange={(event) => store.handleChange(event)}
                      name="allow_notification"
                      label={translate('label:customer_contactAddEditView.allow_notification')}
                      id='id_f_customer_contact_allow_notification'
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

export default Basecustomer_contactView;
