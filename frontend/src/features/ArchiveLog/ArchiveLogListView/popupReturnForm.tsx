import React, { FC, useEffect } from "react";
import store from "../ArchiveLogAddEditView/store";
import { observer } from "mobx-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Card, CardContent, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import AutocompleteCustom from "../../../components/Autocomplete";
import LookUp from "../../../components/LookUp";
import DateField from "../../../components/DateField";
import dayjs from "dayjs";

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

  useEffect(() => {
    if (props.openPanel && store.take_employee_id > 0 && store.return_employee_id == 0) {
      store.return_employee_id = store.take_employee_id;
      store.return_structure_id = store.take_structure_id;
    }
  }, [store.take_employee_id]);

  return (
    <Dialog fullWidth maxWidth={"md"} open={props.openPanel} onClose={props.onBtnCancelClick}>
      <DialogTitle>{translate("label:ArchiveLogAddEditView.return_employee_id")}</DialogTitle>
      <DialogContent>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <AutocompleteCustom
                    value={store.return_employee_id}
                    onChange={(event) => store.handleChange(event)}
                    name="return_employee_id"
                    data={store.return_employees}
                    fieldNameDisplay={(e) => `${e.employee_name} - ${e.post_name ?? ""} (${e.id})`}
                    id="id_f_ArchiveLogAddEditView_return_employee_id"
                    label={translate("label:ArchiveLogAddEditView.return_employee_id")}
                    helperText={store.errorreturn_employee_id}
                    error={!!store.errorreturn_employee_id}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <LookUp
                    value={store.return_structure_id}
                    onChange={(event) => store.handleChange(event)}
                    name="return_structure_id"
                    data={store.org_structures}
                    id="id_f_ArchiveLogAddEditView_return_structure_id"
                    label={translate("label:ArchiveLogAddEditView.return_structure_id")}
                    helperText={store.errorreturn_structure_id}
                    error={!!store.errorreturn_structure_id}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <DateField
                    value={store.date_return ? dayjs(store.date_return) : dayjs()}
                    onChange={(event) => store.handleChange(event)}
                    name="date_return"
                    id="id_f_ArchiveLogAddEditView_date_return"
                    label={translate("label:ArchiveLogAddEditView.date_return")}
                    helperText={store.errordate_return}
                    error={!!store.errordate_return}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_ArchiveLogSaveButton"
            onClick={() => {
              let statusReturn = store.ArchiveLogStatuses.find(s => s.code == 'returned');
              store.date_return = store.date_return ? dayjs(store.date_return) : dayjs();
              if (statusReturn) {
                store.status_id = statusReturn.id;
              }
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_ArchiveLogCancelButton"
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
