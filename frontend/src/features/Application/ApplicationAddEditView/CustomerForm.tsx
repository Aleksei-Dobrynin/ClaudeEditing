import React, { FC, useEffect } from "react";
import {
  Box, Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton, Table, TableBody,
  TableCell, TableHead, TableRow
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "../../../components/Checkbox";
import DateField from "components/DateField";
import dayjs from "dayjs";
import AutocompleteCustomer from "./AutocompleteCustomer";
import CloseIcon from "@mui/icons-material/Close";
import FastInputView from "./reppresentativeFastInput";
import MaskedTextField from "../../../components/MaskedTextField";
import AutocompleteCustomImg from "../../../components/AutocompleteWithImg";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import PopupApplicationListView from "../PopupAplicationListView/PopupAplicationListView";
import PopupApplicationStore from "../PopupAplicationListView/store";
import BadgeButton from "../../../components/BadgeButton";


type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const CustomerFormView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
  }, [store.customerErrors.pin])

  // TODO see tickets BGA-407 and BGA-988
  // useEffect(() => {
  //   if (store.customer.pin.startsWith('0')) {
  //     store.customer.is_organization = true;
  //   } else {
  //     store.customer.is_organization = false;
  //   }
  // }, [store.customer.pin]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={7} xs={12}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AutocompleteCustomer />
              <IconButton disabled={store.id > 0} sx={{ ml: 1 }} onClick={() => {
                store.changeCustomer(null);
              }}>
                <CloseIcon />
              </IconButton>
              {store.customer.id !== 0 && (
                <BadgeButton
                  count={store.badgeCount}
                  circular={<CircularProgress size="20px" />}
                  stateCircular={store.loading}
                  icon={<ContentPasteSearchIcon sx={{ color: "#FF652F" }} />}
                  onClick={() => {
                    PopupApplicationStore.handleChange({ target: { name: "openCustomerApplicationDialog", value: !PopupApplicationStore.openCustomerApplicationDialog } })
                    PopupApplicationStore.handleChange({ target: { name: "common_filter", value: store.customer.pin } }, "filter")
                    PopupApplicationStore.handleChange({ target: { name: "only_count", value: false } }, "filter")
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <MaskedTextField
              disabled={store.is_application_read_only}
              helperText={store.customerErrors.pin}
              error={!!store.customerErrors.pin}
              id="id_f_Customer_pin"
              label={translate("label:CustomerAddEditView.pin")}
              value={store.customer.pin}
              onChange={(event) => store.handleChangeCustomer(event)}
              name="pin"
              mask={store.customer.is_foreign ? null : "00000000000000"}
              onBlur={() => store.setBadge()}
            />
          </Grid>
           <Grid item md={1} xs={12}>
            <IconButton
              disabled={!store.customer.pin || store.customer.pin.length < 14}
              sx={{ ml: 1 }}
              onClick={() => store.findCompanyByPin(store.customer.pin)}
              title="Найти в Минюсте"
            >
              <ContentPasteSearchIcon color="primary" />
            </IconButton>
          </Grid>
          <Grid item md={3} xs={12}>
            <CustomCheckbox
              value={store.customer.is_organization}
              disabled={store.is_application_read_only}
              onChange={(event) => store.handleChangeCustomer(event)}
              name="is_organization"
              label={translate("label:CustomerAddEditView.is_organization")}
              id="id_f_is_organization"
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <CustomCheckbox
              disabled={store.is_application_read_only}
              value={store.customer.is_foreign}
              onChange={(event) => {
                store.handleChangeCustomer(event);
              }}
              name="is_foreign"
              label={translate("label:CustomerAddEditView.is_foreign")}
              id="id_f_is_foreign"
            />
          </Grid>

          <Grid item md={4} xs={12}>

            {store.customer.is_foreign &&
              <AutocompleteCustomImg
                helperText={store.customerErrors.foreign_country}
                error={!!store.customerErrors.foreign_country}
                disabled={store.is_application_read_only}
                data={store.Countries}
                label={translate("common:country")}
                name={"foreign_country"}
                value={store.customer.foreign_country}
                id={"id_f_customer_identity_foreign_country_id"}
                onChange={(e) => store.handleChangeCustomer(e)}
                fieldNameDisplay={(field) => field.name}
              />
            }
          </Grid>


          {store.customer.is_organization ? <Grid item md={4} xs={12}>
            <CustomTextField
              disabled={store.is_application_read_only}
              helperText={store.customerErrors.full_name}
              error={!!store.customerErrors.full_name}
              id="id_f_Customer_full_name"
              label={translate("label:CustomerAddEditView.full_name")}
              value={store.customer.full_name}
              onChange={(event) => store.handleChangeCustomer(event)}
              name="full_name"
            />
          </Grid> : <>

            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                value={store.customer.individual_surname}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="individual_surname"
                data-testid="id_f_customer_individual_surname"
                id="id_f_customer_individual_surname"
                label={translate("label:CustomerAddEditView.individual_surname")}
                helperText={store.customerErrors.individual_surname}
                error={!!store.customerErrors.individual_surname}
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                value={store.customer.individual_name}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="individual_name"
                data-testid="id_f_customer_individual_name"
                id="id_f_customer_individual_name"
                label={translate("label:CustomerAddEditView.individual_name")}
                helperText={store.customerErrors.individual_name}
                error={!!store.customerErrors.individual_name}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                value={store.customer.individual_secondname}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="individual_secondname"
                data-testid="id_f_customer_individual_secondname"
                id="id_f_customer_individual_secondname"
                label={translate("label:CustomerAddEditView.individual_secondname")}
                helperText={store.customerErrors.individual_secondname}
                error={!!store.customerErrors.individual_secondname}
              />
            </Grid>

          </>}
          <Grid item md={4} xs={12}>
            <CustomTextField
              disabled={store.is_application_read_only}
              helperText={store.customerErrors.address}
              error={!!store.customerErrors.address}
              id="id_f_Customer_address"
              label={translate("label:CustomerAddEditView.address")}
              value={store.customer.address}
              onChange={(event) => store.handleChangeCustomer(event)}
              name="address"
            />
          </Grid>

          {store.customer.is_organization && <>
            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                helperText={store.customerErrors.director}
                error={!!store.customerErrors.director}
                id="id_f_Customer_director"
                label={translate("label:CustomerAddEditView.director")}
                value={store.customer.director}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="director"
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <LookUp
                disabled={store.is_application_read_only}
                helperText={store.customerErrors.organization_type_id}
                error={!!store.customerErrors.organization_type_id}
                data={store.OrganizationTypes}
                id="id_f_Customer_organization_type_id"
                label={translate("label:CustomerAddEditView.organization_type_id")}
                value={store.customer.organization_type_id}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="organization_type_id"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                helperText={store.customerErrors.ugns}
                error={!!store.customerErrors.ugns}
                id="id_f_Customer_ugns"
                label={translate("label:CustomerAddEditView.ugns")}
                value={store.customer.ugns}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="ugns"
              />
            </Grid>


            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                helperText={store.customerErrors.payment_account}
                error={!!store.customerErrors.payment_account}
                id="id_f_Customer_payment_account"
                label={translate("label:CustomerAddEditView.payment_account")}
                value={store.customer.payment_account}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="payment_account"
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                helperText={store.customerErrors.bank}
                error={!!store.customerErrors.bank}
                id="id_f_Customer_bank"
                label={translate("label:CustomerAddEditView.bank")}
                value={store.customer.bank}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="bank"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                helperText={store.customerErrors.bik}
                error={!!store.customerErrors.bik}
                id="id_f_Customer_bik"
                label={translate("label:CustomerAddEditView.bik")}
                value={store.customer.bik}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="bik"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                helperText={store.customerErrors.registration_number}
                error={!!store.customerErrors.registration_number}
                id="id_f_Customer_registration_number"
                label={translate("label:CustomerAddEditView.registration_number")}
                value={store.customer.registration_number}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="registration_number"
              />
            </Grid>
          </>}

          {!store.customer.is_organization && <>
            <Grid item md={4} xs={12}>
              <LookUp
                disabled={store.is_application_read_only}
                value={store.customer.identity_document_type_id}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="identity_document_type_id"
                data={store.Identity_document_types}
                data-testid="id_f_customer_identity_document_type_id"
                id="id_f_customer_identity_document_type_id"
                label={translate("label:CustomerAddEditView.identity_document_type_id")}
                helperText={store.customerErrors.identity_document_type_id}
                error={!!store.customerErrors.identity_document_type_id}
              />


            </Grid>
            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                value={store.customer.document_serie}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="document_serie"
                data-testid="id_f_customer_document_serie"
                id="id_f_customer_document_serie"
                label={translate("label:CustomerAddEditView.document_serie")}
                helperText={store.customerErrors.document_serie}
                error={!!store.customerErrors.document_serie}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DateField
                disabled={store.is_application_read_only}
                value={store.customer.document_date_issue ? dayjs(store.customer.document_date_issue, 'YYYY-MM-DD') : null}
                onChange={(event) => {
                  event.target.value = event.target.value?.format()
                  store.handleChangeCustomer(event)
                }}
                name="document_date_issue"
                id="id_f_customer_document_date_issue"
                label={translate("label:CustomerAddEditView.document_date_issue")}
                helperText={store.customerErrors.document_date_issue}
                error={!!store.customerErrors.document_date_issue}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <CustomTextField
                disabled={store.is_application_read_only}
                value={store.customer.document_whom_issued}
                onChange={(event) => store.handleChangeCustomer(event)}
                name="document_whom_issued"
                data-testid="id_f_customer_document_whom_issued"
                id="id_f_customer_document_whom_issued"
                label={translate("label:CustomerAddEditView.document_whom_issued")}
                helperText={store.customerErrors.document_whom_issued}
                error={!!store.customerErrors.document_whom_issued}
              />
            </Grid>
          </>}
          <Grid item md={4} xs={12}>
            <MaskedTextField
              disabled={store.is_application_read_only}
              helperText={store.customerErrors.sms_1}
              error={!!store.customerErrors.sms_1}
              id="id_f_Customer_sms_1"
              label={translate("label:CustomerAddEditView.sms_1")}
              value={store.customer.sms_1}
              onChange={(event) => store.handleChangeCustomer(event)}
              name="sms_1"
              mask="+(996)000-00-00-00"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <MaskedTextField
              disabled={store.is_application_read_only}
              helperText={store.customerErrors.sms_2}
              error={!!store.customerErrors.sms_2}
              id="id_f_Customer_sms_2"
              label={translate("label:CustomerAddEditView.sms_2")}
              value={store.customer.sms_2}
              onChange={(event) => store.handleChangeCustomer(event)}
              name="sms_2"
              mask="+(996)000-00-00-00"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <CustomTextField
              disabled={store.is_application_read_only}
              helperText={store.customerErrors.email_1}
              error={!!store.customerErrors.email_1}
              id="id_f_Customer_email_1"
              label={translate("label:CustomerAddEditView.email_1")}
              value={store.customer.email_1}
              onChange={(event) => store.handleChangeCustomer(event)}
              name="email_1"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <CustomTextField
              disabled={store.is_application_read_only}
              helperText={store.customerErrors.email_2}
              error={!!store.customerErrors.email_2}
              id="id_f_Customer_email_2"
              label={translate("label:CustomerAddEditView.email_2")}
              value={store.customer.email_2}
              onChange={(event) => store.handleChangeCustomer(event)}
              name="email_2"
            />
          </Grid>

        </Grid>
        <Grid>
          <FastInputView idMain={store.customer_id} />
        </Grid>
      </CardContent>
      <PopupApplicationListView />
      <Dialog open={store.isOpenTundukData} fullWidth maxWidth="md">
        <DialogTitle>Сравнение данных с Минюстом</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="40%"><b>{translate("label:CustomerAddEditView.field")}</b></TableCell>
                <TableCell width="30%"><b>{translate("label:CustomerAddEditView.tunduk_value")}</b></TableCell>
                <TableCell width="30%"><b>{translate("label:CustomerAddEditView.current_value")}</b></TableCell>
                <TableCell><b>{translate("label:CustomerAddEditView.match")}</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {store.isOpenTundukData && store.fields.map(f => {
                var local = "";
                if (f.key === "organization_type_id") {
                  local = store.OrganizationTypes.find(x => x.id == store.customer.organization_type_id)?.name ?? "";
                } else {
                  local = store.customer[f.key];
                }
                var tundukfield= "";
                if (f.key === "address") {
                  tundukfield = `${store.tundukData.street} ${store.tundukData.house}`;
                } else if (f.key === "organization_type_id") {
                  tundukfield = store.tundukData.categorySystemName;
                } else if (f.key === "sms_1" || f.key === "sms_2") {
                  const phones = store.tundukData.phones
                    ? store.tundukData.phones.split(',').map(p => p.trim()).filter(Boolean)
                    : [];
                  tundukfield = f.key === "sms_1" ? phones[0] || "" : phones[1] || "";
                } else {
                  tundukfield = store.tundukData[f.tunduk];
                }
                const localValue = local ? String(local).trim() : "";
                const tundukValue = tundukfield ? String(tundukfield).trim() : "";

                const equal = localValue === tundukValue;

                return (
                  <TableRow key={f.key}>
                    <TableCell width="40%">{translate(f.label)}</TableCell>
                    <TableCell width="30%">{tundukfield}</TableCell>
                    <TableCell width="30%">{local}</TableCell>
                    <TableCell>{equal ? "✅" : "⚠️"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => store.applyTundukData()}
          >
            Использовать данные Минюста
          </Button>

          <Button
            onClick={() => store.keepCurrentData()}
          >
            Оставить как есть
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={store.isTundukError} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
          ⚠️ {translate("label:CustomerAddEditView.tunduk.error.title")}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ fontSize: "16px", mb: 2 }}>
            {translate("label:CustomerAddEditView.tunduk.error.hint")}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={() => store.retryTunduk()}>
            {translate("label:CustomerAddEditView.tunduk.error.retry")}
          </Button>
          <Button variant="contained" color="primary" onClick={() => store.continueWithoutTunduk()}>
            {translate("label:CustomerAddEditView.tunduk.error.skip")}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
});


export default CustomerFormView;
