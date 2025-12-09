import React, { FC, useEffect } from "react";
import { default as EmployeeAddEditBaseView } from './base'
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import {
  Box,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";


type EmployeeProps = {};

const EmployeeAddEditView: FC<EmployeeProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")

  useEffect(() => {
    if ((id != null) &&
      (id !== '') &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id))
    } else {
      navigate('/error-404')
    }
    return () => {
      store.clearStore()
    }
  }, [])

  return (
    <EmployeeAddEditBaseView {...props}>

      {/* start MTM */}
      {/* TODO DELETE */}
      <div style={{marginTop: 20}}></div> 
      {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}
      {/* end MTM */}
      
      <Box display="flex" p={2}>
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_EmployeeSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => {
                // navigate('/user/Employee')
                if (store.id === 0) {
                  store.doLoad(id)
                  navigate(`/user/Employee/addedit?id=${id}`)
                }
              })
            }}
          >
            {translate("common:save")}
          </CustomButton>
        </Box>
        <Box m={2}>
          <CustomButton
            color={"secondary"}
            sx={{color:"white", backgroundColor: "red !important"}}
            variant="contained"
            id="id_EmployeeCancelButton"
            onClick={() => navigate('/user/Employee')}
          >
            {translate("common:goOut")}
          </CustomButton>
        </Box>
      </Box>
    </EmployeeAddEditBaseView>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default EmployeeAddEditView