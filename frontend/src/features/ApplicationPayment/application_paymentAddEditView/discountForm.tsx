import React, { FC, useEffect } from "react";
import { Card, CardContent, Paper, Grid, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import storeList from "./../application_paymentListView/store";
import CustomButton from "components/Button";
import AutocompleteCustom from "../../../components/Autocomplete";

type DiscountFormProps = {
  // idMain: number;
};

const DiscountFormView: FC<DiscountFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (storeList.idMain != 0) {
      storeList.loadApplicationSum();
    }
  }, [storeList.idMain]);

  return (
    <>
      <Grid container spacing={1} sx={{ mt: 2, mb: 5 }}>

        <Grid item md={7} xs={12}>
        </Grid>

        <Grid item md={2} xs={12}>
          <CustomTextField
            value={storeList.application_sum_wo_discount_and_tax ?? 0}
            disabled={true}
            onChange={(event) => storeList.handleApplicationSumChangeNumber(event)}
            name="application_sum_wo_discount_and_tax"
            type="number"
            data-testid="id_f_application_payment_application_sum_wo_discount_anx_tax"
            id="id_f_application_payment_application_sum_wo_discount_and_tax"
            label={translate("Сумма без налогов")}
            helperText={storeList.errors.application_sum_wo_discount}
            error={!!storeList.errors.application_sum_wo_discount}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <CustomTextField
            value={storeList.application_sum_wo_discount ?? 0}
            disabled={true}
            onChange={(event) => storeList.handleApplicationSumChangeNumber(event)}
            name="application_sum_wo_discount"
            type="number"
            data-testid="id_f_application_payment_application_sum_wo_discount"
            id="id_f_application_payment_application_sum_wo_discount"
            label={translate("Сумма с налогами")}
            helperText={storeList.errors.application_sum_wo_discount}
            error={!!storeList.errors.application_sum_wo_discount}
          />
        </Grid>








        <Grid item md={7} xs={12}>
        </Grid>

        {!storeList.application_is_percentage &&

          <Grid item md={4} xs={12}>
            <CustomTextField
              disabled={storeList.application_is_percentage}
              value={storeList.application_discount_value}
              onChange={(event) => {
                if (event.target.value?.length > 1 && event.target.value?.startsWith("0")) {
                  event.target.value = event.target.value?.replace(/^0+/, "");
                }
                storeList.handleApplicationSumChangeNumber(event)
              }}
              name="application_discount_value"
              type="number"
              data-testid="id_f_application_payment_application_discount_value"
              id="id_f_application_payment_application_discount_value"
              label={translate("label:application_paymentListView.application_discount_value")}
              helperText={storeList.errors.application_discount_value}
              error={!!storeList.errors.application_discount_value}
            />
          </Grid>
        }

        {storeList.application_is_percentage &&
          <>
            <Grid item md={2} xs={12}>
              <CustomTextField
                disabled={true}
                value={storeList.application_discount_percentage_value}
                onChange={(event) => storeList.handleApplicationSumChangeNumber(event)}
                name="application_discount_percentage_value"
                type="number"
                data-testid="id_f_application_payment_application_discount_percentage_value"
                id="id_f_application_payment_application_discount_percentage_value"
                label={translate("label:application_paymentListView.application_discount_percentage_value")}
                helperText={storeList.errors.application_discount_percentage_value}
                error={!!storeList.errors.application_discount_percentage_value}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <CustomTextField
                disabled={!storeList.application_is_percentage}
                value={storeList.application_discount_percentage}
                onChange={(event) => {
                  if (event.target.value?.length > 1 && event.target.value?.startsWith("0")) {
                    event.target.value = event.target.value?.replace(/^0+/, "");
                  }
                  storeList.handleApplicationSumChangeNumber(event)
                }}
                name="application_discount_percentage"
                type="number"
                data-testid="id_f_application_payment_application_discount_percentage"
                id="id_f_application_payment_application_discount_percentage"
                label={translate("label:application_paymentListView.application_discount_percentage")}
                helperText={storeList.errors.application_discount_percentage}
                error={!!storeList.errors.application_discount_percentage}
              />
            </Grid>

          </>
        }

        <Grid item md={1} xs={12}>
          <CustomCheckbox
            value={storeList.application_is_percentage}
            onChange={(event) => storeList.handleApplicationSumChange(event)}
            name="application_is_percentage"
            label={translate("label:application_paymentListView.application_is_percentage")}
            id="id_f_application_is_percentage"
          />
        </Grid>



        <Grid item md={7} xs={12}>

        </Grid>


        <Grid item md={2} xs={12}>
          <CustomTextField
            value={storeList.application_nds_value}
            disabled={true}
            onChange={(event) => storeList.handleApplicationSumChangeNumber(event)}
            name="application_nds_value"
            type="number"
            data-testid="id_f_application_payment_application_nds_value"
            id="id_f_application_payment_application_nds_value"
            label={translate("Сумма НДС")}
            helperText={store.errors.application_nds_value}
            error={!!store.errors.application_nds_value}
          />
        </Grid>



        <Grid item md={2} xs={12}>
          <CustomTextField
            value={12}
            // value={storeList.application_nds}
            disabled={true}
            // disabled={!storeList.application_disable_nds}
            onChange={(event) => storeList.handleApplicationSumChangeNumber(event)}
            name="application_nds"
            type="number"
            data-testid="id_f_application_payment_application_nds"
            id="id_f_application_payment_application_nds"
            label={translate("label:application_paymentListView.application_nds")}
            helperText={store.errors.application_nds}
            error={!!store.errors.application_nds}
          />
        </Grid>

        <Grid item md={1} xs={12}>
          <CustomCheckbox
            value={storeList.application_disable_nds}
            onChange={(event) => storeList.handleApplicationSumChange(event)}
            name="application_disable_nds"
            label={translate("Исключить НДС")}
            id="id_f_application_disable_nds"
          />
        </Grid>



        <Grid item md={7} xs={12}></Grid>

        <Grid item md={2} xs={12}>
          <CustomTextField
            value={storeList.application_nsp_value}
            disabled={true}
            onChange={(event) => storeList.handleApplicationSumChangeNumber(event)}
            name="application_nsp_value"
            type="number"
            data-testid="id_f_application_payment_application_nsp_value"
            id="id_f_application_payment_application_nsp_value"
            label={translate("Сумма НСП")}
            helperText={store.errors.application_nsp_value}
            error={!!store.errors.application_nsp_value}
          />
        </Grid>



        <Grid item md={2} xs={12}>
          <CustomTextField
            // value={storeList.application_nsp}
            value={2}
            // disabled={!storeList.application_disable_nsp}
            disabled={true}
            onChange={(event) => storeList.handleApplicationSumChangeNumber(event)}
            name="application_nsp"
            type="number"
            data-testid="id_f_application_payment_application_nsp"
            id="id_f_application_payment_application_nsp"
            label={translate("label:application_paymentListView.application_nsp")}
            helperText={store.errors.application_nsp}
            error={!!store.errors.application_nsp}
          />
        </Grid>



        <Grid item md={1} xs={12}>
          <CustomCheckbox
            value={storeList.application_disable_nsp}
            onChange={(event) => storeList.handleApplicationSumChange(event)}
            name="application_disable_nsp"
            label={translate("Исключить НСП")}
            id="id_f_application_disable_nsp"
          />
        </Grid>


        <Grid item md={7} xs={12}></Grid>
        <Grid item md={5} xs={12}>
          <CustomTextField
            value={storeList.application_total_sum}
            disabled={true}
            onChange={(event) => storeList.handleApplicationSumChangeNumber(event)}
            name="application_total_sum"
            type="number"
            data-testid="id_f_application_payment_application_total_sum"
            id="id_f_application_payment_application_total_sum"
            label={translate("label:application_paymentListView.application_total_sum")}
            helperText={store.errors.application_total_sum}
            error={!!store.errors.application_total_sum}
          />
        </Grid>

        <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
          <CustomButton
            variant="contained"
            size="small"
            id="id_application_paymentSaveButton"
            sx={{ mr: 1 }}
            onClick={() => {
              storeList.onSaveDiscountClick((id: number) => {
                storeList.setOpenDiscountForm(false);
                storeList.loadApplicationSum();
                storeList.loadapplication_payments();
              });
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            size="small"
            id="id_application_paymentCancelButton"
            onClick={() => {
              storeList.setOpenDiscountForm(false);
              store.clearStore();
            }}
          >
            {translate("common:cancel")}
          </CustomButton>
        </Grid>
      </Grid>
    </>
  );
});

export default DiscountFormView;
