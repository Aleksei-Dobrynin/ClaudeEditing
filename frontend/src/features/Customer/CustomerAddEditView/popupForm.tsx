import { FC, useEffect } from "react";
import CustomerAddEditBaseView from "./base";
import store from "./store";
import { observer } from "mobx-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import FastInputcustomer_contactView from "features/customer_contact/customer_contactAddEditView/fastInput";

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  pin?: string;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id);
    } else {
      store.clearStore();
    }
    if (props.pin) {
      store.pin = props.pin;
    }
  }, [props.openPanel]);

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} fullWidth={store.id === 0 ? true : false}
      maxWidth={store.id === 0 ? "lg" : "lg"}>
      <DialogTitle>{translate("label:CustomerAddEditView.entityTitle")}</DialogTitle>
      <DialogContent>

        <Grid container>
          <Grid md={store.id === 0 ? 12 : 6} xs={12} item>
            <CustomerAddEditBaseView
              isPopup={true}
            >
            </CustomerAddEditBaseView>
          </Grid>
          <Grid md={6} xs={12} item>
            {store.id !== 0 && <FastInputcustomer_contactView idMain={store.id} />}

          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_CustomerSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id));
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_CustomerCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
});

export default PopupForm;
