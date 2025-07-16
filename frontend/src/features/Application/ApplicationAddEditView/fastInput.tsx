import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "../../CustomerRepresentative/CustomerRepresentativeAddEditView/store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import DateField from "components/DateField";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import storeCustomer from './store'
import storeRepresentative from './representativeStore'
import CustomButton from "components/Button";
import dayjs from "dayjs";
import CustomCheckbox from "components/Checkbox";
import MaskedTextField from "../../../components/MaskedTextField";

type work_dayProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<work_dayProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    storeRepresentative.clearStore()
  }, [])

  const columns = [
    {
      field: "last_name",
      width: null,
      headerName: translate("label:CustomerRepresentativeListView.last_name")
    },
    {
      field: "first_name",
      width: null,
      headerName: translate("label:CustomerRepresentativeListView.first_name")
    },
    {
      field: "second_name",
      width: null,
      headerName: translate("label:CustomerRepresentativeListView.second_name")
    },
    {
      field: "contact",
      width: null,
      headerName: translate("label:CustomerRepresentativeListView.contact"),
      renderCell: null
    },
    // {
    //   field: "date_document",
    //   width: null,
    //   headerName: translate("label:CustomerRepresentativeListView.date_document"),
    //   renderCell: (params) => (
    //     <span>
    //       {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
    //     </span>
    //   )
    // },
  ];

  return (
    <Card component={Paper} elevation={3} sx={{ width: "100%", mt: 2 }}>
      <CardContent>
        <h3 style={{ marginTop: "0px" }}>{translate("label:CustomerRepresentativeAddEditView.entityTitle")}</h3>
        <Divider />
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
          {columns.map((col) => {
            const id = "id_c_title_CustomerRepresentative_" + col.field;
            if (col.width == null) {
              return (
                <Grid id={id} item xs sx={{ m: 1 }}>
                  <strong> {col.headerName}</strong>
                </Grid>
              );
            } else
              return (
                <Grid id={id} item xs={null} sx={{ m: 1 }}>
                  <strong> {col.headerName}</strong>
                </Grid>
              );
          })}
          <Grid item xs={1}></Grid>
        </Grid>
        <Divider />

        {storeCustomer.customer.customerRepresentatives.map((entity) => {
          const style = { backgroundColor: entity.id === storeRepresentative.representativeOnEdit.id && "#F0F0F0" };
          return (
            <>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={style}
                spacing={1}
                id="id_CustomerRepresentative_row"
              >
                {columns.map((col) => {
                  const id = "id_CustomerRepresentative_" + col.field + "_value";
                  if (col.width == null) {
                    if (col.renderCell == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {col.renderCell({ value: entity[col.field], entity })}
                        </Grid>
                      );
                    }
                  } else
                    return (
                      <Grid item xs={col.width} id={id} sx={{ m: 1 }}>
                        {entity[col.field]}
                      </Grid>
                    );
                })}
                <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                  {storeRepresentative.isEdit === false && (
                    <>
                      <IconButton
                        id="id_CustomerRepresentativeEditButton"
                        name="edit_button"
                        style={{ margin: 0, marginRight: 5, padding: 0 }}
                        onClick={() => {
                          storeRepresentative.setEdit(entity)
                        }}
                      >
                        <CreateIcon />
                      </IconButton>
                      <IconButton
                        id="id_CustomerRepresentativeDeleteButton"
                        disabled={storeCustomer.is_application_read_only}
                        name="delete_button"
                        style={{ margin: 0, padding: 0 }}
                        onClick={() => storeCustomer.deleteRepresentative(entity.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Grid>
              </Grid>
              <Divider />
            </>
          );
        })}

        {storeRepresentative.isEdit ? (
          <Grid container spacing={3} sx={{ mt: 2 }}>

            <Grid item md={3} xs={12}>
              <CustomTextField
                disabled={storeCustomer.is_application_read_only}
                value={storeRepresentative.representativeOnEdit.last_name}
                onChange={(event) => storeRepresentative.handleChangeRepresentative(event)}
                name="last_name"
                data-testid="id_f_last_name"
                id="id_f_last_name"
                label={translate("label:CustomerRepresentativeAddEditView.last_name")}
                helperText={storeRepresentative.errors.last_name}
                error={!!storeRepresentative.errors.last_name}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <CustomTextField
                value={storeRepresentative.representativeOnEdit.first_name}
                disabled={storeCustomer.is_application_read_only}
                onChange={(event) => storeRepresentative.handleChangeRepresentative(event)}
                name="first_name"
                data-testid="id_f_first_name"
                id="id_f_first_name"
                label={translate("label:CustomerRepresentativeAddEditView.first_name")}
                helperText={storeRepresentative.errors.first_name}
                error={!!storeRepresentative.errors.first_name}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <CustomTextField
                disabled={storeCustomer.is_application_read_only}
                value={storeRepresentative.representativeOnEdit.second_name}
                onChange={(event) => storeRepresentative.handleChangeRepresentative(event)}
                name="second_name"
                id="id_f_second_name"
                label={translate("label:CustomerRepresentativeAddEditView.second_name")}
                helperText={storeRepresentative.errors.second_name}
                error={!!storeRepresentative.errors.second_name}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <MaskedTextField
                disabled={storeCustomer.is_application_read_only}
                value={storeRepresentative.representativeOnEdit.contact}
                onChange={(event) => storeRepresentative.handleChangeRepresentative(event)}
                name="contact"
                id="id_f_contact"
                label={translate("label:CustomerRepresentativeAddEditView.contact")}
                helperText={storeRepresentative.errors.contact}
                error={!!storeRepresentative.errors.contact}
                mask="+(996)000-00-00-00"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              {/* <CustomTextField
                disabled={storeCustomer.is_application_read_only}
                value={storeRepresentative.representativeOnEdit.pin}
                onChange={(event) => storeRepresentative.handleChangeRepresentative(event)}
                name="pin"
                id="id_f_pin"
                label={translate("label:CustomerRepresentativeAddEditView.pin")}
                helperText={storeRepresentative.errors.pin}
                error={!!storeRepresentative.errors.pin}
              /> */}
              <MaskedTextField
              disabled={storeCustomer.is_application_read_only}
              helperText={storeCustomer.customerErrors.pin}
              error={!!storeCustomer.customerErrors.pin}
              id="id_f_pin"
              label={translate("label:CustomerRepresentativeAddEditView.pin")}
              value={storeRepresentative.representativeOnEdit.pin}
              onChange={(event) => storeRepresentative.handleChangeRepresentative(event)}
              name="pin"
              mask="00000000000000"
            />
            </Grid> 
            <Grid item md={3} xs={12}>
              <CustomTextField
                disabled={storeCustomer.is_application_read_only}
                value={storeRepresentative.representativeOnEdit.requisites}
                onChange={(event) => storeRepresentative.handleChangeRepresentative(event)}
                name="requisites"
                id="id_f_requisites"
                label={translate("label:CustomerRepresentativeAddEditView.requisites")}
                helperText={storeRepresentative.errors.requisites}
                error={!!storeRepresentative.errors.requisites}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <CustomTextField
                disabled={storeCustomer.is_application_read_only}
                value={storeRepresentative.representativeOnEdit.notary_number}
                onChange={(event) => storeRepresentative.handleChangeRepresentative(event)}
                name="notary_number"
                data-testid="id_f_customer_representative_notary_number"
                id='id_f_customer_representative_notary_number'
                label={translate('label:CustomerRepresentativeAddEditView.notary_number')}
                helperText={storeRepresentative.errors.notary_number}
                error={!!storeRepresentative.errors.notary_number}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <DateField
                disabled={storeCustomer.is_application_read_only}
                value={storeRepresentative.representativeOnEdit.date_document}
                onChange={(event) => storeRepresentative.handleChangeRepresentative(event)}
                name="date_document"
                id='id_f_customer_representative_date_document'
                label={translate('label:CustomerRepresentativeAddEditView.date_document')}
                helperText={storeRepresentative.errors.date_document}
                error={!!storeRepresentative.errors.date_document}
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
              {<CustomButton
                disabled={storeCustomer.is_application_read_only}
                variant="contained"
                size="small"
                id="id_work_daySaveButton"
                sx={{ mr: 1 }}
                onClick={() => {
                  storeRepresentative.onSaveClicked()
                }}
              >
                {translate("common:save")}
              </CustomButton>}
              <CustomButton
                variant="contained"
                size="small"
                id="id_work_dayCancelButton"
                onClick={() => {
                  storeRepresentative.onCancelClick();
                }}
              >
                {translate("common:cancel")}
              </CustomButton>
            </Grid>
          </Grid>
        ) : (
          <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
            {<CustomButton
              disabled={storeCustomer.is_application_read_only}
              variant="contained"
              size="small"
              id="id_work_dayAddButton"
              onClick={() => {
                storeRepresentative.addNewClicked((storeCustomer.customer.customerRepresentatives.length + 1) * -1)
              }}
            >
              {translate("common:add")}
            </CustomButton>}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
});

export default FastInputView;
