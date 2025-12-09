import React, { FC, useEffect } from "react";
import {
  Card,
  CardContent,
  Divider,
  Paper,
  Grid,
  Container,
  IconButton,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from './../TemplCommsReminderListView/store'
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomButton from "components/Button";

type TemplCommsReminderProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};


const TemplCommsReminderFastInputView: FC<TemplCommsReminderProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.template_id !== props.idMain) {
      storeList.template_id = props.idMain
      storeList.loadTemplCommsReminders()
    }
  }, [props.idMain])


  const columns = [
    {
      field: 'language_idNavName',
      headerName: translate("label:TemplCommsReminderListView.language_id"),
      width: null
    },
  ]

  return (
    <Container >
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="TemplCommsReminder_TitleName" sx={{ m: 1 }}>
            <h3>{translate('label:TemplCommsReminderAddEditView.entityTitle')}</h3>
          </Box>
          <Divider />
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {columns.map(col => {
              const id = "id_c_title_EmployeeContact_" + col.field;
              if (col.width == null) {
                return <Grid id={id} item xs sx={{ m: 1 }}>
                  <strong> {col.headerName}</strong>
                </Grid>
              }
              else return <Grid id={id} item xs={null} sx={{ m: 1 }}>
                <strong> {col.headerName}</strong>
              </Grid>
            })}
            <Grid item xs={1}>
            </Grid>
          </Grid>
          <Divider />

          {storeList.data.map((entity) => {
            const style = { backgroundColor: entity.id === store.id && "#F0F0F0" }
            return <>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={style}
                spacing={1}
                id="id_EmployeeContact_row"
              >

                {columns.map(col => {
                  const id = "id_EmployeeContact_" + col.field + "_value";
                  if (col.width == null) {
                    return <Grid item xs id={id} sx={{ m: 1 }} >
                      {entity[col.field]}
                    </Grid>
                  }
                  else return <Grid item xs={col.width} id={id} sx={{ m: 1 }} >
                    {entity[col.field]}
                  </Grid>
                })}
                <Grid
                  item
                  display={"flex"}
                  justifyContent={"center"}
                  xs={1}>
                  {storeList.isEdit === false && <>
                    <IconButton
                      id="id_EmployeeContactEditButton"
                      name='edit_button'
                      style={{ margin: 0, marginRight: 5, padding: 0 }}
                      onClick={() => {
                        storeList.setFastInputIsEdit(true)
                        store.doLoad(entity.id)
                      }}>
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      id="id_EmployeeContactDeleteButton"
                      name='delete_button'
                      style={{ margin: 0, padding: 0 }}
                      onClick={() => storeList.deleteTemplCommsReminder(entity.id)}>
                      <DeleteIcon />
                    </IconButton>

                  </>}
                </Grid>
              </Grid>
              <Divider />
            </>

          })}



          {storeList.isEdit ? <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item md={12} xs={12}>
              <LookUp
                value={store.reminder_recipientsgroup_id}
                onChange={(event) => store.handleChange(event)}
                name="reminder_recipientsgroup_id"
                data={store.TemplReminderRecipientsGroups}
                id='id_f_TemplCommsReminder_reminder_recipientsgroup_id'
                label={translate('label:TemplCommsReminderAddEditView.reminder_recipientsgroup_id')}
                helperText={store.errors.reminder_recipientsgroup_id}
                error={store.errors.reminder_recipientsgroup_id !== ''}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <LookUp
                value={store.reminder_days_id}
                onChange={(event) => store.handleChange(event)}
                name="reminder_days_id"
                data={store.TemplRemindersDays}
                id='id_f_TemplCommsReminder_reminder_days_id'
                label={translate('label:TemplCommsReminderAddEditView.reminder_days_id')}
                helperText={store.errors.reminder_days_id}
                error={store.errors.reminder_days_id !== ''}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <DateTimeField
                value={store.time_send_reminder}
                onChange={(event) => store.handleChange(event)}
                name="time_send_reminder"
                id='id_f_TemplCommsReminder_time_send_reminder'
                label={translate('label:TemplCommsReminderAddEditView.time_send_reminder')}
                helperText={store.errors.time_send_reminder}
                error={!!store.errors.time_send_reminder}
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_TemplCommsReminderSaveButton"
                sx={{ mr: 1 }}
                onClick={() => {
                  store.onSaveClick((id: number) => {
                    storeList.setFastInputIsEdit(false)
                    storeList.loadTemplCommsReminders()
                    store.clearStore()
                  })
                }}
              >
                {translate("common:save")}
              </CustomButton>
              <CustomButton
                variant="contained"
                size="small"
                id="id_TemplCommsReminderCancelButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(false)
                  store.clearStore()
                }}
              >
                {translate("common:cancel")}
              </CustomButton>
            </Grid>
          </Grid> :
            <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_TemplCommsReminderAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true)
                  store.doLoad(0)
                  store.template_id = props.idMain
                }}
              >
                {translate("common:add")}
              </CustomButton>
            </Grid>}
        </CardContent>
      </Card>
    </Container >
  );
})


export default TemplCommsReminderFastInputView;
