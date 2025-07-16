import { FC, useEffect } from 'react';
import {
  Container,
  Checkbox,
  Paper,
  Box,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Step_dependencyPopupForm from '../step_dependencyAddEditView/popupForm'
import styled from 'styled-components';
import AutocompleteCustom from "components/Autocomplete";
import CustomButton from "components/Button";
import ClearIcon from "@mui/icons-material/Clear";


type step_dependencyListViewProps = {
};


const step_dependencyListView: FC<step_dependencyListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadservice_paths();
    store.loadstep_dependencies();
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    {
      field: 'dependent_step_id',
      headerName: translate("label:step_dependencyListView.dependent_step_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_dependency_column_dependent_step_id"> {param.row.dependent_step_name} </div>),
      renderHeader: (param) => (<div data-testid="table_step_dependency_header_dependent_step_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'prerequisite_step_id',
      headerName: translate("label:step_dependencyListView.prerequisite_step_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_dependency_column_prerequisite_step_id"> {param.row.prerequisite_step_name} </div>),
      renderHeader: (param) => (<div data-testid="table_step_dependency_header_prerequisite_step_id">{param.colDef.headerName}</div>)
    },

    {
      field: 'is_strict',
      headerName: translate("label:step_dependencyListView.is_strict"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_step_dependency_column_is_strict">
          <Checkbox
            checked={!!param.row.is_strict}
            disabled
            size="small"
          />
        </div>
      ),
      renderHeader: (param) => (<div data-testid="table_step_dependency_header_is_strict">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:step_dependencyListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestep_dependency(id)}
        columns={columns}
        data={store.data}
        tableName="step_dependency" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:step_dependencyListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestep_dependency(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="step_dependency" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <AutocompleteCustom
                value={store.filter?.service_path_id ?? 0}
                onChange={(e) => store.filter.service_path_id = e.target.value}
                name="service_path_id"
                data={store.service_paths}
                fieldNameDisplay={(item) => item.name || ''}
                id="id_f_filter_service_path_id"
                label={translate("label:step_dependencyListView.filter_service_path")}
              />
            </Grid>
          </Grid>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Box sx={{ minWidth: 80 }}>
              <CustomButton
                variant="contained"
                id="searchFilterButton"
                onClick={() => {
                  store.loadstep_dependenciesByFilter();
                }}
              >
                {translate("search")}
              </CustomButton>
            </Box>
            {(store.filter?.service_path_id !== 0) && 
              <Box sx={{ m: 1 }}>
                <CustomButton
                  id="clearSearchFilterButton"
                  onClick={() => {
                    store.clearFilter();
                    store.loadstep_dependencies();
                  }}
                >
                  {translate("clear")}
                </CustomButton>
              </Box>
            }
          </Box>
        </Box>
      </Paper>
      
      {component}

      <Step_dependencyPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadstep_dependencies()
        }}
      />

    </Container>
  );
})



export default step_dependencyListView