import { FC, useEffect, useState } from 'react';
import store from "./store"
import { observer } from "mobx-react"
import { Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import { ContactTypes } from "constants/constant";
import CustomTextField from "components/TextField";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from "@mui/material";
import Ckeditor from "components/ckeditor/ckeditor";
import layoutStore from 'layouts/MainLayout/store'
import MainStore from 'MainStore';


type ApproveCabinetFormProps = {
  openPanel: boolean;
  html: string;
  onBtnCancelClick: () => void;
  onBtnOkClick: () => void;
}

const ApproveCabinetForm: FC<ApproveCabinetFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const [description, setDescription] = useState(props.html);


  useEffect(() => {
    if (props.openPanel) {
    } else {
    }
  }, [props.openPanel])



  useEffect(() => {
    setDescription(props.html)
  }, [props.html])

  return (
    <Dialog maxWidth={"lg"} open={props.openPanel} onClose={props.onBtnCancelClick}>

      <DialogContent>
        <h2></h2>

        <Ckeditor
          disabled={true}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          withoutPlaceholder
          name={`description`}
          id={`id_f_release_description`}
        />

      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_SmsSaveButton"
            onClick={() => {
              //TODO
              MainStore.openDigitalSign(
                0,
                async () => {
                  await store.signAndApproveToCabinet();
                  MainStore.onCloseDigitalSign();
                },
                () => MainStore.onCloseDigitalSign(),
              );

            }}
          >
            {translate("Подписать и отправить заказчику")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_SmsCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default ApproveCabinetForm
