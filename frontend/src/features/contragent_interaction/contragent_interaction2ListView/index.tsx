import { FC, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Contragent_interactionPopupForm from './../contragent_interaction2AddEditView/popupForm'
import styled from 'styled-components';
import dayjs from 'dayjs';
import CustomTextField from 'components/TextField';
import { Clear } from '@mui/icons-material';
import CustomButton from 'components/Button';
import DateField from 'components/DateField';


type contragent_interactionListViewProps = {
  idMain: number;
};


const Contragent_interactionListView: FC<contragent_interactionListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {

    store.loadcontragent_interactions()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    {
      field: 'application_id',
      headerName: translate("label:contragent_interactionListView.application_number"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_task_id"> {param.row.application_id} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_task_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:contragent_interactionListView.name"),
      flex: 2,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'status',
      headerName: translate("label:contragent_interactionListView.status"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_status"> {param.row.status} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_status">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'contragent_id',
    //   headerName: translate("label:contragent_interactionListView.contragent_id"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_contragent_interaction_column_contragent_id"> {param.row.contragent_name} </div>),
    //   renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_contragent_id">{param.colDef.headerName}</div>)
    // },

    {
      field: 'object_address',
      headerName: translate("label:contragent_interactionListView.object_address"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_contragent_id"> {param.row.object_address} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_contragent_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'customer_name',
      headerName: translate("label:contragent_interactionListView.customer_name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_customer_name"> {param.row.customer_name} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_customer_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'customer_contact',
      headerName: translate("label:contragent_interactionListView.customer_contact"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_customer_contact"> {param.row.customer_contact} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_customer_contact">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'description',
    //   headerName: translate("label:contragent_interactionListView.description"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_contragent_interaction_column_description"> {param.row.description} </div>),
    //   renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_description">{param.colDef.headerName}</div>)
    // },
    {
      field: 'created_at',
      headerName: translate("label:contragent_interactionListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_contragent_id"> {param.value ? dayjs(param.value).format("DD.MM.YYYY") : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_contragent_id">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <Container maxWidth={false}>


      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <CustomTextField
                value={store.pin}
                onChange={(e) => store.changePin(e.target.value)}
                name={"searchByPin"}
                label={translate("label:ApplicationListView.searchByPin")}
                onKeyDown={(e) => e.keyCode === 13 && store.loadcontragent_interactions()}
                id={"pin"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="pin_Search_Btn"
                        onClick={() => store.changePin("")}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <CustomTextField
                value={store.number}
                onChange={(e) => store.changeNumber(e.target.value)}
                name={"number"}
                label={translate("label:ApplicationListView.searchByNumber")}
                onKeyDown={(e) => e.keyCode === 13 && store.loadcontragent_interactions()}
                id={"pin"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="number_Search_Btn"
                        onClick={() => store.changeNumber("")}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <CustomTextField
                value={store.address}
                onChange={(e) => store.changeAddress(e.target.value)}
                name={"address"}
                label={translate("label:ApplicationListView.searchByAddress")}
                onKeyDown={(e) => e.keyCode === 13 && store.loadcontragent_interactions()}
                id={"pin"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="address_Search_Btn"
                        onClick={() => store.changeAddress("")}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DateField
                value={store.date_start}
                onChange={(event) => store.changeDateStart(event.target.value)}
                name="dateStart"
                id="filterByDateStart"
                label={translate("label:ApplicationListView.filterByDateStart")}
                helperText={""}
                error={false}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DateField
                value={store.date_end}
                onChange={(event) => store.changeDateEnd(event.target.value)}
                name="dateEnd"
                id="filterByDateEnd"
                label={translate("label:ApplicationListView.filterByDateEnd")}
                helperText={""}
                error={false}
              />
            </Grid>
          </Grid>
          <Box display={"flex"} flexDirection={"column"} sx={{ ml: 2 }} alignItems={"center"}>
            <Box sx={{ minWidth: 80 }}>
              <CustomButton
                variant="contained"
                id="searchFilterButton"
                onClick={() => {
                  store.loadcontragent_interactions();
                }}
              >
                {translate("search")}
              </CustomButton>
            </Box>
            {(store.pin !== ""
              || store.number !== ""
              || store.address !== ""
              || store.date_start !== null
              || store.date_end !== null
            ) && <Box sx={{ mt: 2 }}>
                <CustomButton
                  id="clearSearchFilterButton"
                  onClick={() => {
                    store.clearFilter();
                    store.loadcontragent_interactions();
                  }}
                >
                  {translate("clear")}
                </CustomButton>
              </Box>}
          </Box>
        </Box>
      </Paper>
      
      <PageGrid
        title={translate("label:contragent_interactionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletecontragent_interaction(id)}
        // onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="contragent_interaction" />

      <Contragent_interactionPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        application_id={props.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadcontragent_interactions()
        }}
      />

    </Container>
  );
})



export default Contragent_interactionListView
