import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container, Tabs, Tab, Box, Typography,
  Tooltip,
  IconButton
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import CustomButton from "../../../components/Button";
import MapContainerView from "./map";
import ClearIcon from "@mui/icons-material/Clear";
import CardAppArch from "./appCard";
import DivideObjectPopupForm from './../ArchiveObjectDivideForm/popupForm'
import DivisionHistory from './DivisionHistory';
import AddIcon from "@mui/icons-material/Add";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  isReadOnly?: boolean;
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

  // Обработчик клика по объекту в истории разделения
  const handleDivisionObjectClick = (id: number) => {
    navigate(`/user/ArchiveObject/addedit?id=${id}`);
    window.location.reload()
  };

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
                  <CustomButton
                    customColor={"#718fb8"}
                    size="small"
                    variant="contained"
                    sx={{ mb: "5px", mr: 1 }}
                    onClick={() => {
                      store.changeDivideObjectPopup(true)
                    }}
                    disabled={props.isReadOnly}
                  >
                    {`${translate("Разделить")}`}
                  </CustomButton>

                  <DivideObjectPopupForm 
                    openPanel={store.divideObjectOpenPanel}
                    onBtnCancelClick={() => {
                      store.changeDivideObjectPopup(false)
                    }}
                    onSaveClick={() => {
                      store.changeDivideObjectPopup(false)
                      // Перезагружаем объект для обновления истории разделения
                      store.loadArchiveObject(store.id);
                    }}
                    id={store.id}
                  />
                </Box>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={9}>
                    <MapContainerView  isReadOnly={props.isReadOnly}/>
                    {store.mapLayers[0]?.geometry?.coordinates[0] != null && store.mapLayers[0]?.geometry?.coordinates[1] != null &&
                      <a
                        style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                        target="_blank"
                        href={`https://2gis.kg/bishkek/geo/${store.mapLayers[0]?.geometry?.coordinates[0]}%2C${store.mapLayers[0]?.geometry?.coordinates[1]}?m=${store.mapLayers[0]?.geometry?.coordinates[0]}%2C${store.mapLayers[0]?.geometry?.coordinates[1]}%2F14.6`}>
                        {translate("common:openIn2GIS")}
                      </a>}
                    {store.darek_eni.length !== 0 &&
                      <a
                        style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                        target="_blank"
                        href={`/user/DarekView?eni=${store.darek_eni}`}>
                        {translate("common:openInDarekOnEni")}
                      </a>}
                    {store.mapLayers[0]?.geometry?.coordinates[0] != null && store.mapLayers[0]?.geometry?.coordinates[1] != null &&
                      <a
                        style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                        target="_blank"
                        href={`/user/DarekView?coordinate=${store.mapLayers[0]?.geometry?.coordinates[1]},${store.mapLayers[0]?.geometry?.coordinates[0]}`}>
                        {translate("common:openInDarekOnLatLng")}
                      </a>}
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {store.Application && store.archirecture_process_status_code === "under_consideration" && <CardAppArch />}

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={3}>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errordoc_number}
                          error={store.errordoc_number != ""}
                          id="id_f_ArchiveObject_doc_number"
                          label={translate("label:ArchiveObjectAddEditView.doc_number")}
                          value={store.doc_number}
                          onChange={(event) => {
                            store.handleChange(event)
                          }}
                          name="doc_number"
                          disabled={props.isReadOnly}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.erroraddress}
                          error={store.erroraddress != ""}
                          id="id_f_ArchiveObject_address"
                          label={translate("label:ArchiveObjectAddEditView.address")}
                          value={store.address}
                          onChange={(event) => store.handleChange(event)}
                          name="address"
                          disabled={props.isReadOnly}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errordescription}
                          error={store.errordescription != ""}
                          id="id_f_ArchiveObject_description"
                          label={translate("label:ArchiveObjectAddEditView.description")}
                          value={store.description}
                          onChange={(event) => store.handleChange(event)}
                          name="description"
                          disabled={props.isReadOnly}
                        />
                      </Grid>
                      {store.id > 0 ? <Grid item md={12} xs={12}>
                        <CustomTextField
                          helperText={store.errordp_outgoing_number}
                          error={store.errordp_outgoing_number != ""}
                          id="id_f_ArchiveObject_dp_outgoing_number"
                          label={translate("label:ArchiveObjectAddEditView.dp_outgoing_number")}
                          value={store.Application?.dp_outgoing_number}
                          onChange={(event) => {
                            store.handleChange(event)
                          }}
                          name="dp_outgoing_number"
                          disabled={props.isReadOnly}
                        />
                      </Grid> : null}

                      <Box sx={{ position: "relative", ml: 3, mt: 3 }}>
                        <Tooltip title={"Добавить заказчика"}>
                          <IconButton
                            onClick={() => store.newСustomerClicked()}
                            sx={{ position: "absolute", top: 0, right: 0 }}
                            disabled={props.isReadOnly}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                        {store.customers_for_archive_object.map((cust, i) => (
                          <Grid item md={12} xs={12} sx={{ mb: 1 }} key={cust.id}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                              <Grid container spacing={1}>
                                <Grid item md={12} xs={12} display="flex" justifyContent="space-between" alignItems="center">
                                  <div style={{ maxHeight: 30, minHeight: 30 }}>Заказчик {i + 1}</div>
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    {i !== 0 && (
                                      <Tooltip title={"Удалить"}>
                                        <IconButton
                                          sx={{ maxHeight: 30 }}
                                          size="small"
                                          onClick={() => store.deleteCustomer(i)}
                                          disabled={props.isReadOnly}
                                        >
                                          <ClearIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </div>
                                </Grid>
                                <Grid item md={12} xs={12}>
                                  <CustomTextField
                                    id={`id_f_ArchiveObject_customer_${i}`}
                                    label={translate("label:ArchiveObjectAddEditView.customer")}
                                    value={cust.full_name}
                                    onChange={(event) => store.handleChangeCustomer(event, i)}
                                    name="full_name"
                                    disabled={props.isReadOnly}
                                  />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                  <CustomTextField
                                    helperText={store.errordescription}
                                    error={store.errordescription !== ""}
                                    id={`id_f_ArchiveObject_description_${i}`}
                                    label={translate("label:ArchiveObjectAddEditView.description")}
                                    value={cust.description}
                                    onChange={(event) => store.handleChangeCustomer(event, i)}
                                    name="description"
                                    disabled={props.isReadOnly}

                                  />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                  <CustomTextField
                                    helperText={store.errordp_outgoing_number}
                                    error={store.errordp_outgoing_number != ""}
                                    id={`id_f_ArchiveObject_dp_outgoing_number_${i}`}
                                    label={translate("label:ArchiveObjectAddEditView.dp_outgoing_number")}
                                    value={cust.dp_outgoing_number}
                                    onChange={(event) => store.handleChangeCustomer(event, i)}
                                    name="dp_outgoing_number"
                                    disabled={props.isReadOnly}

                                  />
                                </Grid>
                              </Grid>
                            </Paper>
                          </Grid>
                        ))}
                      </Box>
                      <Grid>
                        <Box display="flex" justifyContent={"flex-end"} p={2}>
                          <Box m={2}>
                            <CustomButton
                              variant="contained"
                              id="id_ArchiveObjectSaveButton"
                              onClick={() => {
                                store.onSaveClick((id: number) => {
                                  navigate("/user/ArchiveObject");
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
                              onClick={() => navigate("/user/ArchiveObject")}
                            >
                              {translate("common:cancel")}
                            </CustomButton>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {/* История разделения объекта - отображается только если есть данные */}
                    <DivisionHistory onObjectClick={handleDivisionObjectClick} />

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