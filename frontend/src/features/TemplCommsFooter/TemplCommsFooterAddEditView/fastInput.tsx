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
import storeList from './../TemplCommsFooterListView/store'
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomButton from "components/Button";

type TemplCommsFooterProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};


const TemplCommsFooterFastInputView: FC<TemplCommsFooterProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.template_comms_id !== props.idMain) {
      storeList.template_comms_id = props.idMain
      storeList.loadTemplCommsFooters()
    }
  }, [props.idMain])


  const columns = [
    {
      field: 'language_idNavName',
      headerName: translate("label:TemplCommsFooterListView.language_id"),
      width: null
    },
  ]

  return (
    <Container >
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="TemplCommsFooter_TitleName" sx={{ m: 1 }}>
            <h3>{translate('label:TemplCommsFooterAddEditView.entityTitle')}</h3>
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
                      onClick={() => storeList.deleteTemplCommsFooter(entity.id)}>
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
                value={store.language_id}
                onChange={(event) => store.handleChange(event)}
                name="language_id"
                data={store.DictionaryLanguages}
                id='id_f_TemplCommsFooter_language_id'
                label={translate('label:TemplCommsFooterAddEditView.language_id')}
                helperText={store.errors.language_id}
                error={store.errors.language_id !== ''}
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_TemplCommsFooterSaveButton"
                sx={{ mr: 1 }}
                onClick={() => {
                  store.onSaveClick((id: number) => {
                    storeList.setFastInputIsEdit(false)
                    storeList.loadTemplCommsFooters()
                    store.clearStore()
                  })
                }}
              >
                {translate("common:save")}
              </CustomButton>
              <CustomButton
                variant="contained"
                size="small"
                id="id_TemplCommsFooterCancelButton"
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
                id="id_TemplCommsFooterAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true)
                  store.doLoad(0)
                  store.template_comms_id = props.idMain
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


export default TemplCommsFooterFastInputView;
