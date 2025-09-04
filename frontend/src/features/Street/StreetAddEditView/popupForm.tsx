import { FC, useEffect } from "react";
import StreetAddEditBaseView from "./base";
import store from "./store";
import { observer } from "mobx-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";

type PopupFormProps = {
  openPanel: boolean;
  id: number;
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
  }, [props.openPanel]);

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} fullWidth={true}
      maxWidth={"lg"}>
      <DialogTitle>{translate("label:StreetAddEditView.entityTitle")}</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid md={12} xs={12} item>
            <StreetAddEditBaseView
              isPopup={true}
            >
            </StreetAddEditBaseView>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_StreetSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id));
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_StreetCancelButton"
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