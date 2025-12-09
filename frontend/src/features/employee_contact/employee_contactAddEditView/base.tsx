import React, { FC } from "react";
import { Card, CardContent, CardHeader, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import InfoIcon from "@mui/icons-material/Info";

type employee_contactTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Employee_contactAddEditBaseView: FC<employee_contactTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="employee_contactForm" id="employee_contactForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="employee_contact_TitleName">
                  {translate('label:employee_contactAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="type_id"
                      data={store.contact_types}
                      id="id_f_Application_service_id"
                      label={translate("label:employee_contactAddEditView.type_id")}
                      helperText={store.errors.type_id}
                      error={!!store.errors.type_id}
                    />
                  </Grid>

                  {store.type_id > 0 && <Grid item md={12} xs={12}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <InfoIcon />
                      <Typography variant="body1">{store.contact_types.find(x => x.id == store.type_id)?.description}</Typography>
                    </Stack>

                  </Grid>
                  }
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.value}
                      onChange={(event) => store.handleChange(event)}
                      name="value"
                      data-testid="id_f_employee_contact_value"
                      id='id_f_employee_contact_value'
                      label={translate('label:employee_contactAddEditView.value')}
                      helperText={store.errors.value}
                      error={!!store.errors.value}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.employee_id}
                      onChange={(event) => store.handleChange(event)}
                      name="employee_id"
                      data-testid="id_f_employee_contact_employee_id"
                      id='id_f_employee_contact_employee_id'
                      label={translate('label:employee_contactAddEditView.employee_id')}
                      helperText={store.errors.employee_id}
                      error={!!store.errors.employee_id}
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.allow_notification}
                      onChange={(event) => store.handleChange(event)}
                      name="allow_notification"
                      label={translate('label:employee_contactAddEditView.allow_notification')}
                      id='id_f_employee_contact_allow_notification'
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

export default Employee_contactAddEditBaseView;
