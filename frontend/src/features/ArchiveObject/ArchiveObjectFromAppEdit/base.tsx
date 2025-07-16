import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Button,
  makeStyles,
  FormControlLabel,
  Container, Tabs, Tab, Box, Typography,
  Menu,
  MenuItem
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import MapsView from "../../ArchObject/ArchObjectAddEditView/maps";
import CustomButton from "../../../components/Button";
import { MapContainer, Polygon, Popup, TileLayer } from "react-leaflet";
import { LatLngExpression, map } from "leaflet";
import { Map2Gis } from "../../ArchObject/ArchObjectAddEditView/2gis";
import MapContainerView from "./map";
import MaskedAutocomplete from "../../../components/MaskedAutocomplete";
import applicationStore from "../../Application/ApplicationAddEditView/store";
import GisSearch from "../../ArchObject/ArchObjectAddEditView/2gisSearch";

import CreateIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Create";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import styled from "styled-components";
import dayjs from "dayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AutocompleteCustom from "components/Autocomplete";
import MainStore from "MainStore";
import Architecture_processPopupForm from "features/architecture_process/architecture_processAddEditView/popupForm";
import { APPLICATION_STATUSES } from "constants/constant";
import CardAppArch from "./appCard";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [value, setValue] = React.useState(0);
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  let filteredStatuses = store.ArchitectureStatuses.filter(s =>
    store.ArchitectureRoads.some(ar => ar.from_status_id === store.archirecture_process_status_id && ar.to_status_id === s.id && ar.is_active === true));

  return (
    <>
      <Container maxWidth={false} sx={{ mt: 2 }}>

        <form id="ArchiveObjectForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <Box id="ArchiveObject_TitleName" display={"flex"} justifyContent={"space-between"}>
                  <span>
                    Объект по адресу - {store.address}
                  </span>
                  {store.archirecture_process_status_id ? <Box sx={{ minWidth: "225px" }}>
                    <CustomButton
                      customColor={"#718fb8"}
                      size="small"
                      variant="contained"
                      sx={{ mb: "5px", mr: 1 }}
                      onClick={handleClick}
                      endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    >
                      {`${translate("label:ApplicationAddEditView.status")}${store.ArchitectureStatuses.find(s => s.id === store.archirecture_process_status_id)?.name}`}
                    </CustomButton>
                  </Box> : <></>}
                  {filteredStatuses?.length > 0 &&
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      <Typography variant="h5" sx={{ textAlign: "center", width: "100%" }}>
                        {translate("common:Select_status")}
                      </Typography>
                      {store.arch_obj_id > 0 && store.archirecture_process_status_id > 0 && filteredStatuses.map(x => {
                        return <MenuItem
                          key={x.id}
                          onClick={() => {
                            store.changeToStatus(x.id, x.code)
                            handleClose()
                          }}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#718fb8",
                              color: "#FFFFFF"
                            },
                            "&:hover .MuiListItemText-root": {
                              color: "#FFFFFF"
                            }
                          }}
                        >
                          {x.name}
                        </MenuItem>
                          ;
                      })}
                    </Menu>
                  }
                </Box>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={9}>
                    <MapContainerView />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {store.Application && <CardAppArch />}

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={3}>
                      {/* {store.mapLayers.length > 0 && <Grid item md={12} xs={12}>
                        <CustomButton onClick={() => store.mapLayers = []}>Очистить карту</CustomButton>
                      </Grid>} */}
                      {/* <Grid item md={12} xs={12}>
                        <MaskedAutocomplete
                          data={store.DarekSearchList}
                          value={store.darek_eni}
                          label={translate("label:ArchObjectAddEditView.identifier")}
                          name="darek_eni"
                          onChange={(newValue: any) => {
                            store.darek_eni = newValue.propcode;
                            store.address = newValue.address;
                            store.identifier = newValue.propcode;
                            store.searchFromDarek(newValue.propcode);
                          }}
                          freeSolo={true}
                          fieldNameDisplay={(option) => option.propcode}
                          onInputChange={(event, value) => {
                            store.darek_eni = "";
                            store.identifier = value;
                            if (value.length > 12) {
                              store.getSearchListFromDarek(value);
                            }
                          }}
                          mask="0-00-00-0000-0000-00-000"
                        />
                      </Grid> */}
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errordoc_number}
                          error={store.errordoc_number != ""}
                          // disabled={!(MainStore.isDutyPlan || MainStore.isAdmin)}
                          id="id_f_ArchiveObject_doc_number"
                          label={translate("label:ArchiveObjectAddEditView.doc_number")}
                          value={store.doc_number}
                          onChange={(event) => {
                            store.handleChange(event)
                          }}
                          name="doc_number"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        {/* <GisSearch
                          id="id_f_ArchObject_address"
                          label={translate("label:ArchObjectAddEditView.address")}
                          multiline={true}
                          onPointChange={store.handlePointChange}
                          onAddressChange={store.handleAddressChange}
                          value={store.address}
                        /> */}
                        <CustomTextField
                          helperText={store.erroraddress}
                          error={store.erroraddress != ""}
                          // disabled={!(MainStore.isDutyPlan || MainStore.isAdmin)}
                          id="id_f_ArchiveObject_address"
                          label={translate("label:ArchiveObjectAddEditView.address")}
                          value={store.address}
                          onChange={(event) => store.handleChange(event)}
                          name="address"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          // disabled={!(MainStore.isDutyPlan || MainStore.isAdmin)}
                          helperText={store.errorcustomer}
                          error={store.errorcustomer != ""}
                          id="id_f_ArchiveObject_customer"
                          label={translate("label:ArchiveObjectAddEditView.customer")}
                          value={store.customer}
                          onChange={(event) => store.handleChange(event)}
                          name="customer"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errordescription}
                          error={store.errordescription != ""}
                          // disabled={!(MainStore.isDutyPlan || MainStore.isAdmin)}
                          id="id_f_ArchiveObject_description"
                          label={translate("label:ArchiveObjectAddEditView.description")}
                          value={store.description}
                          onChange={(event) => store.handleChange(event)}
                          name="description"
                        />
                      </Grid>
                      <Grid>

                        <Box display="flex" justifyContent={"flex-end"} p={2}>
                          <Box m={2}>
                            <CustomButton
                              variant="contained"
                              id="id_ArchiveObjectSaveButton"
                              // disabled={!(MainStore.isDutyPlan || MainStore.isAdmin)}
                              onClick={() => {
                                store.onSaveClick((id: number) => {
                                  if (store.from === 'toArchive') {
                                    navigate("/user/ArchitectureProcessToArchive");
                                  } else {
                                    navigate("/user/ArchitectureProcess");
                                  }
                                });
                              }}
                            >
                              {translate("common:save")}
                            </CustomButton>
                          </Box>
                          <Box m={2}>
                            <CustomButton
                              variant="contained"
                              id="id_ArchiveObjectCancelButton"
                              onClick={() => {
                                if (store.from === 'toArchive') {
                                  navigate("/user/ArchitectureProcessToArchive");
                                } else {
                                  navigate("/user/ArchitectureProcess");
                                }
                              }}
                            >
                              {translate("common:cancel")}
                            </CustomButton>
                          </Box>
                        </Box>
                      </Grid>
                      {/* <Grid item md={12} xs={12}>
                        <CustomTextField
                          id="id_f_ArchiveObject_x"
                          label={"X coord"}
                          value={store.xcoordinate}
                          onChange={(event) => store.handleChange(event)}
                          name="xcoordinate"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          id="id_f_ArchiveObject_y"
                          label={"Y coord"}
                          value={store.ycoordinate}
                          onChange={(event) => store.handleChange(event)}
                          name="ycoordinate"
                        />
                      </Grid> */}
                      {/*<Grid item md={12} xs={12}>*/}
                      {/*  <CustomTextField*/}
                      {/*    helperText={store.errorlatitude}*/}
                      {/*    error={store.errorlatitude != ""}*/}
                      {/*    id="id_f_ArchiveObject_latitude"*/}
                      {/*    label={translate("label:ArchiveObjectAddEditView.latitude")}*/}
                      {/*    value={store.latitude}*/}
                      {/*    onChange={(event) => store.handleChange(event)}*/}
                      {/*    name="latitude"*/}
                      {/*  />*/}
                      {/*</Grid>*/}
                      {/*<Grid item md={12} xs={12}>*/}
                      {/*  <CustomTextField*/}
                      {/*    helperText={store.errorlongitude}*/}
                      {/*    error={store.errorlongitude != ""}*/}
                      {/*    id="id_f_ArchiveObject_longitude"*/}
                      {/*    label={translate("label:ArchiveObjectAddEditView.longitude")}*/}
                      {/*    value={store.longitude}*/}
                      {/*    onChange={(event) => store.handleChange(event)}*/}
                      {/*    name="longitude"*/}
                      {/*  />*/}
                      {/*</Grid>*/}
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
        {props.children}
      </Container>
    </>
  );
});

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


export default BaseView;
