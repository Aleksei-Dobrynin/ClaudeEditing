import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
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
  Container
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "../../../components/Checkbox";
import CustomButton from "../../../components/Button";
import DateField from "components/DateField";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth="xl" style={{ marginTop: 20 }}>
      <Grid container>

        <form id="CustomerForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="Customer_TitleName">
                  {translate("label:CustomerAddEditView.entityTitle")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={store.id === 0 ? 6 : 12} xs={store.id === 0 ? 6 : 12}>
                    <Grid container spacing={3}>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errorpin}
                          error={store.errorpin != ""}
                          id="id_f_Customer_pin"
                          label={translate("label:CustomerAddEditView.pin")}
                          value={store.pin}
                          onChange={(event) => store.handleChange(event)}
                          name="pin"
                        />
                      </Grid>
                      {/* <Grid item md={2} xs={2}>
                        <CustomButton
                          variant="contained"
                          id="id_CustomerSaveButton"
                          onClick={() => store.searchInfoByPin()}
                        >
                          {translate("common:search")}
                        </CustomButton>
                      </Grid> */}
                      <Grid item md={12} xs={12}>
                        <CustomCheckbox
                          value={store.is_organization}
                          onChange={(event) => store.handleChange(event)}
                          name="is_organization"
                          label={translate("label:CustomerAddEditView.is_organization")}
                          id="id_f_is_organization"
                        />
                      </Grid>


                      {store.is_organization ? <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errorfull_name}
                          error={store.errorfull_name != ""}
                          id="id_f_Customer_full_name"
                          label={translate("label:CustomerAddEditView.full_name")}
                          value={store.full_name}
                          onChange={(event) => store.handleChange(event)}
                          name="full_name"
                        />
                      </Grid> : <>

                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            value={store.individual_surname}
                            onChange={(event) => store.handleChange(event)}
                            name="individual_surname"
                            data-testid="id_f_customer_individual_surname"
                            id="id_f_customer_individual_surname"
                            label={translate("label:CustomerAddEditView.individual_surname")}
                            helperText={store.errorindividual_surname}
                            error={store.errorindividual_surname != ""}
                          />
                        </Grid>

                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            value={store.individual_name}
                            onChange={(event) => store.handleChange(event)}
                            name="individual_name"
                            data-testid="id_f_customer_individual_name"
                            id="id_f_customer_individual_name"
                            label={translate("label:CustomerAddEditView.individual_name")}
                            helperText={store.errorindividual_name}
                            error={store.errorindividual_name != ""}
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            value={store.individual_secondname}
                            onChange={(event) => store.handleChange(event)}
                            name="individual_secondname"
                            data-testid="id_f_customer_individual_secondname"
                            id="id_f_customer_individual_secondname"
                            label={translate("label:CustomerAddEditView.individual_secondname")}
                            helperText={store.errorindividual_secondname}
                            error={store.errorindividual_secondname != ""}
                          />
                        </Grid>

                      </>}
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.erroraddress}
                          error={store.erroraddress != ""}
                          id="id_f_Customer_address"
                          label={translate("label:CustomerAddEditView.address")}
                          value={store.address}
                          onChange={(event) => store.handleChange(event)}
                          name="address"
                        />
                      </Grid>


                      {/* <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errorpostal_code}
                          error={store.errorpostal_code != ""}
                          id="id_f_Customer_postal_code"
                          label={translate("label:CustomerAddEditView.postal_code")}
                          value={store.postal_code}
                          onChange={(event) => store.handleChange(event)}
                          name="postal_code"
                        />
                      </Grid> */}

                      {store.is_organization && <>
                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            helperText={store.errordirector}
                            error={store.errordirector != ""}
                            id="id_f_Customer_director"
                            label={translate("label:CustomerAddEditView.director")}
                            value={store.director}
                            onChange={(event) => store.handleChange(event)}
                            name="director"
                          />
                        </Grid>
                        {/* <Grid item md={12} xs={12}>
                          <CustomTextField
                            helperText={store.errorokpo}
                            error={store.errorokpo != ""}
                            id="id_f_Customer_okpo"
                            label={translate("label:CustomerAddEditView.okpo")}
                            value={store.okpo}
                            onChange={(event) => store.handleChange(event)}
                            name="okpo"
                          />
                        </Grid> */}

                        <Grid item md={12} xs={12}>
                          <LookUp
                            helperText={store.errororganization_type_id}
                            error={store.errororganization_type_id != ""}
                            data={store.OrganizationTypes}
                            id="id_f_Customer_organization_type_id"
                            label={translate("label:CustomerAddEditView.organization_type_id")}
                            value={store.organization_type_id}
                            onChange={(event) => store.handleChange(event)}
                            name="organization_type_id"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            helperText={store.errorugns}
                            error={store.errorugns != ""}
                            id="id_f_Customer_ugns"
                            label={translate("label:CustomerAddEditView.ugns")}
                            value={store.ugns}
                            onChange={(event) => store.handleChange(event)}
                            name="ugns"
                          />
                        </Grid>


                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            helperText={store.errorpayment_account}
                            error={store.errorpayment_account != ""}
                            id="id_f_Customer_payment_account"
                            label={translate("label:CustomerAddEditView.payment_account")}
                            value={store.payment_account}
                            onChange={(event) => store.handleChange(event)}
                            name="payment_account"
                          />
                        </Grid>

                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            helperText={store.errorbank}
                            error={store.errorbank != ""}
                            id="id_f_Customer_bank"
                            label={translate("label:CustomerAddEditView.bank")}
                            value={store.bank}
                            onChange={(event) => store.handleChange(event)}
                            name="bank"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            helperText={store.errorbik}
                            error={store.errorbik != ""}
                            id="id_f_Customer_bik"
                            label={translate("label:CustomerAddEditView.bik")}
                            value={store.bik}
                            onChange={(event) => store.handleChange(event)}
                            name="bik"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            helperText={store.errorregistration_number}
                            error={store.errorregistration_number != ""}
                            id="id_f_Customer_registration_number"
                            label={translate("label:CustomerAddEditView.registration_number")}
                            value={store.registration_number}
                            onChange={(event) => store.handleChange(event)}
                            name="registration_number"
                          />
                        </Grid>
                      </>}

                      {!store.is_organization && <><Grid item md={12} xs={12}>
                        <LookUp
                          value={store.identity_document_type_id}
                          onChange={(event) => store.handleChange(event)}
                          name="identity_document_type_id"
                          data={store.Identity_document_types}
                          data-testid="id_f_customer_identity_document_type_id"
                          id="id_f_customer_identity_document_type_id"
                          label={translate("label:CustomerAddEditView.identity_document_type_id")}
                          helperText={store.erroridentity_document_type_id}
                          error={store.erroridentity_document_type_id != ""}
                        />
                      </Grid>
                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            value={store.document_serie}
                            onChange={(event) => store.handleChange(event)}
                            name="document_serie"
                            data-testid="id_f_customer_document_serie"
                            id="id_f_customer_document_serie"
                            label={translate("label:CustomerAddEditView.document_serie")}
                            helperText={store.errordocument_serie}
                            error={store.errordocument_serie != ""}
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <DateField
                            value={store.document_date_issue}
                            onChange={(event) => store.handleChange(event)}
                            name="document_date_issue"
                            id="id_f_customer_document_date_issue"
                            label={translate("label:CustomerAddEditView.document_date_issue")}
                            helperText={store.errordocument_date_issue}
                            error={store.errordocument_date_issue != ""}
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <CustomTextField
                            value={store.document_whom_issued}
                            onChange={(event) => store.handleChange(event)}
                            name="document_whom_issued"
                            data-testid="id_f_customer_document_whom_issued"
                            id="id_f_customer_document_whom_issued"
                            label={translate("label:CustomerAddEditView.document_whom_issued")}
                            helperText={store.errordocument_whom_issued}
                            error={store.errordocument_whom_issued != ""}
                          />
                        </Grid>
                      </>}


                    </Grid>
                  </Grid>
                  {store.id === 0 && <Grid item md={6} xs={6}>
                    <Grid container spacing={3} style={{ marginTop: 105 }}>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errorsms_1}
                          error={store.errorsms_1 != ""}
                          id="id_f_Customer_sms_1"
                          label={translate("label:CustomerAddEditView.sms_1")}
                          value={store.sms_1}
                          onChange={(event) => store.handleChange(event)}
                          name="sms_1"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errorsms_2}
                          error={store.errorsms_2 != ""}
                          id="id_f_Customer_sms_2"
                          label={translate("label:CustomerAddEditView.sms_2")}
                          value={store.sms_2}
                          onChange={(event) => store.handleChange(event)}
                          name="sms_2"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.erroremail_1}
                          error={store.erroremail_1 != ""}
                          id="id_f_Customer_email_1"
                          label={translate("label:CustomerAddEditView.email_1")}
                          value={store.email_1}
                          onChange={(event) => store.handleChange(event)}
                          name="email_1"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.erroremail_2}
                          error={store.erroremail_2 != ""}
                          id="id_f_Customer_email_2"
                          label={translate("label:CustomerAddEditView.email_2")}
                          value={store.email_2}
                          onChange={(event) => store.handleChange(event)}
                          name="email_2"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errortelegram_1}
                          error={store.errortelegram_1 != ""}
                          id="id_f_Customer_telegram_1"
                          label={translate("label:CustomerAddEditView.telegram_1")}
                          value={store.telegram_1}
                          onChange={(event) => store.handleChange(event)}
                          name="telegram_1"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errortelegram_2}
                          error={store.errortelegram_2 != ""}
                          id="id_f_Customer_telegram_2"
                          label={translate("label:CustomerAddEditView.telegram_2")}
                          value={store.telegram_2}
                          onChange={(event) => store.handleChange(event)}
                          name="telegram_2"
                        />
                      </Grid>
                    </Grid>
                  </Grid>}
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
});


export default BaseView;
