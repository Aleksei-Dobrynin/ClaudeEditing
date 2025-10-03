import { FC, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Box, Grid, IconButton, InputAdornment, ListItemText, Paper, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import CustomButton from 'components/Button';
import FastInputapplication_subtaskView from 'features/application_subtask/application_subtaskAddEditView/fastInput';
import styled from "styled-components";
import CustomTextField from "components/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import LookUp from "components/LookUp";
import DateField from "components/DateField";
import dayjs from "dayjs";

type SearchTaskProps = {};

const FilterArch: FC<SearchTaskProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (

    <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
      <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>

            <CustomTextField
              value={store.filter.search}
              onChange={(e) => store.filter.search = e.target.value}
              name={"searchField"}
              label={translate("Поиск объекта")}
              onKeyDown={(e) => e.keyCode === 13 && store.loadArchiveObjectsByFilter()}
              id={"search"}
              InputProps={{
                endAdornment:
                  store.filter.search !== "" && <InputAdornment position="end">
                    <IconButton
                      id="number_Search_Btn"
                      onClick={() => {
                        store.filter.search = ""
                        store.loadArchiveObjectsByFilter()
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>

              }}
            />
          </Grid>

          {/* <Grid item md={4} xs={12}>
            <LookUp
              value={store.filter.status_id}
              onChange={(event) => store.filter.status_id = event.target.value - 0}
              name="from_status_id"
              data={store.ArchitectureStatuses}
              id='id_f_archirecture_road_from_status_id'
              label={translate('Статус')}
            />
          </Grid> */}
          <Grid item md={2} xs={12}>
            <DateField
              label={translate("Дата создания от")}
              value={store.filter.created_at_from ? dayjs(store.filter.created_at_from) : null}
              onChange={(e) => store.filter.created_at_from = dayjs(e.target.value).format("YYYY-MM-DD")}
              helperText=""
              id="created_at_from"
              name="created_at_from"
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <DateField
              label={translate("Дата создания до")}
              value={store.filter.created_at_to ? dayjs(store.filter.created_at_to) : null}
              onChange={(e) => (store.filter.created_at_to = dayjs(e.target.value).format("YYYY-MM-DD"))}
              helperText={''}
              id="created_at_to"
              name="created_at_to"
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <DateField
              label={translate("Дата изменения от")}
              value={store.filter.updated_at_from ? dayjs(store.filter.updated_at_from) : null}
              onChange={(e) => (store.filter.updated_at_from = dayjs(e.target.value).format("YYYY-MM-DD"))}
              helperText={''}
              id="updated_at_from"
              name="updated_at_from"
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <DateField
              label={translate("Дата изменения до")}
              value={store.filter.updated_at_to ? dayjs(store.filter.updated_at_to) : null}
              onChange={(e) => (store.filter.updated_at_to = dayjs(e.target.value).format("YYYY-MM-DD"))}
              helperText={''}
              id="updated_at_to"
              name="updated_at_to"
            />
          </Grid>
        </Grid>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Box sx={{ minWidth: 80 }}>
            <CustomButton
              variant="contained"
              id="searchFilterButton"
              onClick={() => {
                store.loadArchiveObjectsByFilter();
              }}
            >
              {translate("search")}
            </CustomButton>
          </Box>

          {(store.filter.search !== "" ||
            store.filter.created_at_from !== null ||
            store.filter.created_at_to !== null ||
            store.filter.updated_at_from !== null ||
            store.filter.updated_at_to !== null
          ) && <Box sx={{ m: 1 }}>
              <CustomButton
                id="clearSearchFilterButton"
                onClick={() => {
                  store.clearFilter();
                  store.loadArchiveObjects();
                }}
              >
                {translate("clear")}
              </CustomButton>
            </Box>}
        </Box>
      </Box>
    </Paper>
  );
})


export default FilterArch