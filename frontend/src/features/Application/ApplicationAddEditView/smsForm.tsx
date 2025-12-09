import { FC, useEffect } from 'react';
import store from "./store"
import { observer } from "mobx-react"
import { Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import { ContactTypes } from "constants/constant";
import CustomTextField from "components/TextField";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from "@mui/material";

type SmsPopupFormProps = {
  openPanel: boolean;
  onBtnCancelClick: () => void;
  onBtnOkClick: () => void;
}

const SmsPopupForm: FC<SmsPopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
    } else {
    }
  }, [props.openPanel])


  return (
    <Dialog maxWidth={"md"} open={props.openPanel} onClose={props.onBtnCancelClick}>

      <DialogContent>
        <h2>Выберите номера, на которые будут отправлены сообщения</h2>

        <h3>
          {store.customer?.is_organization ? store.customer.full_name : store.customer.individual_surname + " " + store.customer.individual_name}<br />
        </h3>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Номер</TableCell>
                <TableCell>СМС</TableCell>
                <TableCell>Telegram</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {store?.CustomerContacts?.filter(x => x.type_code == ContactTypes.SMS || x.type_code == ContactTypes.TELEGRAM).map((x) => (
                <TableRow>
                  <TableCell>{x.value}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={store.selectedSms.has(x.value)}
                      onChange={() => store.toggleNumberSelection(x.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={store.selectedTelegram.has(x.value)}
                      onChange={() => store.toggleTelegramSelection(x.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {store?.customer?.customerRepresentatives?.filter(x => x.contact?.length > 0).length > 0 && <>
          <h4>Контакты представителей</h4>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Представитель</TableCell>
                  <TableCell>Номер</TableCell>
                  <TableCell>Выбран</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {store?.customer?.customerRepresentatives?.filter(x => x.contact?.length > 0)?.map((x) => (
                  <TableRow key={x.id}>
                    <TableCell>{x.last_name} {x.first_name}</TableCell>
                    <TableCell>{x.contact}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={store.selectedSms.has(x.contact)}
                        onChange={() => store.toggleNumberSelection(x.contact)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


        </>}

        <br />
        <br />
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <CustomTextField
              multiline={true}
              rows={6}
              id='id_f_Sms_description'
              label={'Текст сообщения СМС'}
              value={store.smsDescription}
              onChange={(event) => store.handleChange(event)}
              name="smsDescription"
            />
            Текущее количество СМС = {store.countSMS(store.smsDescription)}
            <br /><br />
            70 символов - 1 СМС<br />
            134 символа - 2 СМС<br />
            201 символ - 3 СМС<br />
            <br />
          </Grid>
          <Grid item md={6} xs={12}>
            <CustomTextField
              multiline={true}
              rows={6}
              id='id_f_tg_description'
              label={'Текст сообщения Telegram'}
              value={store.telegramDescription}
              onChange={(event) => store.handleChange(event)}
              name="telegramDescription"
            />
          </Grid>
        </Grid>


      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            disabled={store.selectedSms?.size == 0 && store.selectedTelegram?.size == 0}
            id="id_SmsSaveButton"
            onClick={() => {
              store.sendSms();
            }}
          >
            {translate("Отправить")}
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

export default SmsPopupForm
