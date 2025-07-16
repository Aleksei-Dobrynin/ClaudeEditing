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
import storeList from './../SmAttributeTriggerListView/store'
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomButton from "components/Button";

type SmAttributeTriggerProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};


const SmAttributeTriggerFastInputView: FC<SmAttributeTriggerProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.project_id !== props.idMain) {
      storeList.project_id = props.idMain
      storeList.loadSmAttributeTriggers()
    }
  }, [props.idMain])


  const columns = [
    {
      field: 'attribute_idNavName',
      headerName: translate("label:SmAttributeTriggerListView.attribute_id"),
      width: null
    },
    {
      field: 'value',
      headerName: translate("label:SmAttributeTriggerListView.value"),
      width: null
    },
  ]

  return (
    <Container sx={{ mb: 3 }}>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="SmAttributeTrigger_TitleName" sx={{ m: 1 }}>
            <h3>{translate('label:SmAttributeTriggerAddEditView.entityTitle')}</h3>
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
                      style={{ margin: 0, marginRight: 5, padding: 0 }}
                      onClick={() => {
                        storeList.setFastInputIsEdit(true)
                        store.doLoad(entity.id)
                      }}>
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      id="id_EmployeeContactDeleteButton"
                      style={{ margin: 0, padding: 0 }}
                      onClick={() => storeList.deleteSmAttributeTrigger(entity.id)}>
                      <DeleteIcon />
                    </IconButton>

                  </>}
                </Grid>
              </Grid>
              <Divider />
            </>

          })}



          {storeList.isEdit ? <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item md={6} xs={12}>
              <LookUp
                value={store.attribute_id}
                onChange={(event) => store.handleChange(event)}
                name="attribute_id"
                data={store.EntityAttributes}
                id='id_f_SmAttributeTrigger_attribute_id'
                label={translate('label:SmAttributeTriggerAddEditView.attribute_id')}
                helperText={store.errorattribute_id}
                error={store.errorattribute_id !== ''}
              />
            </Grid>
            <Grid item md={6} xs={6}>
              <CustomTextField
                value={store.value}
                onChange={(event) => store.handleChange(event)}
                name="value"
                id='id_f_SmProject_value'
                label={translate('label:SmAttributeTriggerAddEditView.value')}
                helperText={store.errorvalue}
                error={store.errorvalue !== ''}
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_SmAttributeTriggerSaveButton"
                sx={{ mr: 1 }}
                onClick={() => {
                  store.onSaveClick((id: number) => {
                    storeList.setFastInputIsEdit(false)
                    storeList.loadSmAttributeTriggers()
                    store.clearStore()
                  })
                }}
              >
                {translate("common:save")}
              </CustomButton>
              <CustomButton
                variant="contained"
                size="small"
                id="id_SmAttributeTriggerCancelButton"
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
                id="id_SmAttributeTriggerAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true)
                  store.doLoad(0)
                  store.project_id = props.idMain
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


export default SmAttributeTriggerFastInputView;
