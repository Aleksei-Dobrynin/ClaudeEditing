import React, { FC, useEffect, useRef } from "react";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router";
import { Box, Card, CardContent, Divider, Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import dayjs from "dayjs";
import UploadedApplicationDocumentDownloadView
  from "../../UploadedApplicationDocument/uploaded_application_documentDownloadView";
import CustomTextField from "components/TextField";
import { MapContainer, Marker, Polygon, Popup, TileLayer, LayersControl } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import LookUp from "../../../components/LookUp";
import CustomButton from "../../../components/Button";
import UploadFileForm from "./uploadFileForm";
import LegalRecordsForm from "./legalRecordsForm";
import DownloadIcon from "@mui/icons-material/Download";
import MainStore from "../../../MainStore";
import FileField from "../../../components/FileField";

type TechCouncilProps = {};

const { BaseLayer } = LayersControl;

const TechCouncilAddEditView: FC<TechCouncilProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");
  const mapRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      if (id !== null && id !== "" && !isNaN(Number(id))) {
        try {
          await store.doLoad(Number(id));
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
          navigate("/error-404");
        }
      } else {
        navigate("/error-404");
      }
    };

    loadData();

    return () => {
      store.clearStore();
    };
  }, []);

  return (
    <Grid container>
      <Grid item md={2} xs={12}>
        <Paper>
          <Box sx={{ height: "calc(100vh - 140px)", overflowY: "auto" }}>
            {store.application_cases.map(app_case => {
              return <>
                <div
                  key={app_case.id}
                  style={{ cursor: "pointer", padding: "16px" }}
                  onClick={() => {
                    store.clearStore();
                    store.doLoad(app_case.id);
                    navigate(`/user/TechCouncilApplication?id=${app_case.id}`);
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    {translate("label:TechCouncilAddEditView.application")} №{app_case.application_number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>{translate("label:TechCouncilAddEditView.date_decision")}:</strong> {new Date(app_case.tech_decision_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>{translate("label:TechCouncilAddEditView.customer")}:</strong> {app_case.full_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>{translate("label:TechCouncilAddEditView.address")}:</strong> {app_case.address}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    <strong>{translate("label:TechCouncilAddEditView.decision_type_id")}:</strong> {app_case.tech_decision_name}
                  </Typography>
                </div>
                <Divider />
              </>;
            })}
          </Box>
        </Paper>
      </Grid>
      <Grid item md={3} xs={12}>
        <Paper elevation={7} variant="outlined">
          <Card>
            <CardContent>
              <Grid container>
                <Grid item md={12} xs={12}>
                  <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                    <StyledRouterLink to={`/user/application/addedit?id=${store.Application.id}`}>
                      # {store.Application.number}
                    </StyledRouterLink>
                  </Typography>
                  <Divider />
                  <Typography sx={{ fontSize: "16px", fontWeight: "bold", mt: 1, mb: 1 }}>
                    {`${translate("Заказчик")}: `}
                    <span style={{ fontWeight: "normal" }}>
                      {store.Customer?.full_name}, {store.Customer?.pin}
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1 }}>
                    {`${translate("Контакты")}: `}
                    {store.Customer?.sms_1 && <span style={{
                      fontWeight: "normal",
                      marginRight: 5
                    }}>{`${translate("label:CustomerAddEditView.sms_1")}: ${store.Customer?.sms_1}`}</span>}
                    {store.Customer?.sms_2 && <span style={{
                      fontWeight: "normal",
                      marginRight: 5
                    }}>{`${translate("label:CustomerAddEditView.sms_2")}: ${store.Customer?.sms_2}`}</span>}
                    {store.Customer?.email_1 && <span style={{
                      fontWeight: "normal",
                      marginRight: 5
                    }}>{`${translate("label:CustomerAddEditView.email_1")}: ${store.Customer?.email_1}`}</span>}
                    {store.Customer?.email_2 && <span
                      style={{ fontWeight: "normal" }}>{`${translate("label:CustomerAddEditView.email_2")}: ${store.Customer?.email_2}`}</span>}
                  </Typography>
                  {store.Customer.customerRepresentatives.length > 0 ? <>
                    <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1 }}>
                      {`${translate("Представитель")}: `}
                      <span style={{ fontWeight: "normal" }}>
                        {store.Customer.customerRepresentatives[0].last_name} &nbsp;
                        {store.Customer.customerRepresentatives[0].first_name} &nbsp;
                        {store.Customer.customerRepresentatives[0].second_name}&nbsp;
                        {store.Customer.customerRepresentatives[0].contact}
                      </span>
                    </Typography>
                  </> : ""}
                  <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1 }}>
                    {`${translate("Услуга")}: `}
                    <span style={{ fontWeight: "normal" }}>
                      {store.Application.service_name} ({store.Application.work_description})
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1 }}>
                    {`${translate("label:ApplicationAddEditView.registration_date")}: `}
                    <span style={{ fontWeight: "normal" }}>
                      {dayjs(store.Application.registration_date).format("DD.MM.YYYY HH:mm")}
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1 }}>
                    {`${translate("label:ApplicationAddEditView.deadline")}: `}
                    <span style={{ fontWeight: "normal" }}>
                      {dayjs(store.Application.deadline).format("DD.MM.YYYY")}
                    </span>
                  </Typography>

                  <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1 }}>
                    {`${translate("label:ApplicationAddEditView.Status")}: `}
                    <span style={{ fontWeight: "normal" }}>
                      {store.Application.status_name}
                    </span>
                  </Typography>

                  <Box display={"flex"}>
                    <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 2, minWidth: 250 }}>
                      {`${translate("label:TechCouncilAddEditView.decision_technical_council")}: `}
                    </Typography>
                    <LookUp
                      value={store.Application?.tech_decision_id}
                      onChange={(event) => store.changeTechDecision(event.target.value)}
                      name="tech_decision_id"
                      data={store.tech_decisions}
                      id="tech_decision_id"
                      error={!!store.errortech_decision_id}
                      helperText={store.errortech_decision_id}
                      hideLabel
                      label={translate("Район")}
                    />
                  </Box>

                  {((store.Application?.tech_decision_id > 0 &&
                    store.Application?.tech_decision_id != null) &&
                    (store.Application?.tech_decision_id == store.tech_decisions.find(x => x.code == "reject").id ||
                      (store.Application?.tech_decision_id == store.tech_decisions.find(x => x.code == "reject_nocouncil").id))) &&
                    <Box display={"flex"}>

                      <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1, minWidth: 130 }}>
                        {`${translate("Документ заключения техсовета")}: `}
                      </Typography>
                      <FileField
                        value={store.TechFileName}
                        helperText={store.errorTechFileName}
                        error={!!store.errorTechFileName}
                        inputKey={store.idTechDocumentinputKey}
                        fieldName="TechFileName"
                        idFile={store.idTechDocumentinputKey}
                        onChange={(event) => {
                          if (event.target.files.length == 0) return;
                          store.handleChange({ target: { value: event.target.files[0], name: "File" } });
                          store.handleChange({ target: { value: event.target.files[0].name, name: "TechFileName" } });
                          store.changeTechDocInputKey();
                        }}
                        onClear={() => {
                          store.handleChange({ target: { value: null, name: "File" } });
                          store.handleChange({ target: { value: null, name: "TechFileName" } });
                          store.changeTechDocInputKey();
                        }}
                      />
                    </Box>}
                  {store.taskEdited && <Box display={"flex"} justifyContent={"flex-end"} sx={{ mt: 1 }}>
                    <CustomButton
                      onClick={() => store.saveApplicationTags()}
                    >Сохранить</CustomButton>
                  </Box>}
                </Grid>
              </Grid>
              <MapContainer
                ref={mapRef}
                center={[42.87, 74.60] as LatLngExpression}
                zoom={11}
                style={{ height: "450px", width: "100%" }}>
                <LayersControl position="topright">
                  <BaseLayer checked name="Схема">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                  </BaseLayer>
                  <BaseLayer name="Спутник">
                    <TileLayer
                      maxZoom={24}
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
                    />
                  </BaseLayer>
                </LayersControl>
                {store.arch_objects.map((obj, i) => obj.geometry?.length > 0 &&
                  <Polygon positions={obj.geometry} color="blue">
                    <Popup>
                      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        <table style={{ width: "auto", borderCollapse: "collapse" }}>
                          <thead>
                            <tr>
                              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Адрес</th>
                              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Код ЕНИ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {obj.addressInfo?.map((item, index) => (
                              <tr key={index}>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.address}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item?.propcode}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Popup>
                  </Polygon>)}


                {store.arch_objects.map((obj, i) => obj.xcoordinate !== null && obj.ycoordinate !== null
                  && obj.xcoordinate !== 0 && obj.ycoordinate !== 0 &&
                  <Marker position={[obj.xcoordinate, obj.ycoordinate]}>
                    <Popup>
                      <div>
                        <strong>Адрес:</strong> {obj.address}
                      </div>
                    </Popup>
                  </Marker>)}
              </MapContainer>
              <Box>
                {(() => {
                  let obj = store.arch_objects[store.arch_objects.length - 1];
                  return (
                    <>
                      {obj?.xcoordinate !== 0 && obj?.ycoordinate !== 0 &&
                        <a
                          style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                          target="_blank"
                          href={`https://2gis.kg/bishkek/geo/${obj?.ycoordinate}%2C${obj?.xcoordinate}?m=${obj?.ycoordinate}%2C${obj?.xcoordinate}%2F14.6`}>
                          {translate("common:openIn2GIS")}
                        </a>}
                      {obj?.identifier == null && obj?.identifier?.length !== 0 &&
                        <a
                          style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                          target="_blank"
                          href={`/user/DarekView?eni=${obj?.identifier}`}>
                          {translate("common:openInDarekOnEni")}
                        </a>}
                      {obj?.xcoordinate !== 0 && obj?.ycoordinate !== 0 &&
                        <a
                          style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                          target="_blank"
                          href={`/user/DarekView?coordinate=${obj?.xcoordinate},${obj?.ycoordinate}`}>
                          {translate("common:openInDarekOnLatLng")}
                        </a>}
                    </>
                  );
                })()}
                <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                  <StyledRouterLink
                    to={`/user/ArchiveObject`}
                    onClick={(e) => {
                      MainStore.BackUrl = `/user/TechCouncilApplication?id=${store.id}`;
                      navigate(`/user/ArchiveObject`);
                    }}
                  >
                    {translate("label:TechCouncilAddEditView.to_archive_object")}
                  </StyledRouterLink>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </Grid>
      <Grid item md={4} xs={12}>
        {store.Application.id !== 0 && <UploadedApplicationDocumentDownloadView
          idMain={store.Application.id}
          hideAddButton={true} />}
      </Grid>
      <Grid item md={3} xs={12}>
        <Paper elevation={7} variant="outlined">
          <Card>
            <CardContent>
              <h1 data-testid={`uploaded_application_documentHeaderTitle`}>
                {translate("label:TechCouncilAddEditView.approval_sheet")}
              </h1>
              {store.techCouncilData.map((item) => (
                <Grid container spacing={2} key={item.id} sx={{ mb: 8 }}>
                  <Grid item md={12} xs={12}>
                    <Typography variant="h5">{item.structure_name}</Typography>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errordecision_type_id}
                      error={store.errordecision_type_id !== ""}
                      data={store.decision_types}
                      id="id_f_decision_type_id"
                      label={translate("label:TechCouncilAddEditView.decision_type_id")}
                      value={item.decision_type_id}
                      onChange={(event) => store.handleTechCouncilChange(event, item.id)}
                      name="decision_type_id"
                      disabled={store.first_structure_id !== item.structure_id && !MainStore.isSecretary}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.currentId === item.id && store.errordecision}
                      error={store.currentId === item.id && store.errordecision !== ""}
                      label={translate("label:TechCouncilAddEditView.decision")}
                      value={item.decision}
                      id={"decision"}
                      name={"decision"}
                      onChange={(event) => store.handleTechCouncilChange(event, item.id)}
                      disabled={store.first_structure_id !== item.structure_id && !MainStore.isSecretary}
                      multiline={true}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      label={translate("label:TechCouncilAddEditView.date_decision")}
                      value={item.date_decision ? dayjs(item.date_decision).format("DD.MM.YYYY") : ""}
                      id={"date_decision"}
                      name={"date_decision"}
                      onChange={(event) => store.handleChange(event)}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      label={translate("label:TechCouncilAddEditView.employee_name")}
                      value={item.employee_name}
                      id={"decision"}
                      name={"decision"}
                      onChange={(event) => store.handleChange(event)}
                      disabled={true}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    {Array.isArray(item.files) && item.files?.length > 0 &&
                      <Typography variant="h5">{translate("label:TechCouncilAddEditView.files")}</Typography>}
                    {Array.isArray(item.files) && item.files?.map((file) => (
                      <div key={file.file_id} data-testid="table_uploaded_application_document_column_file_name">
                        {file.file_name}
                        {file.file_id && (
                          <Tooltip title="Скачать">
                            <IconButton
                              size="small"
                              onClick={() => store.downloadFile(file.file_id, file.file_name)}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    ))}
                  </Grid>
                  <Grid item md={12} xs={12}>
                    {Array.isArray(item.legal_records) && item.legal_records?.length > 0 &&
                      <Typography variant="h5">{translate("label:TechCouncilAddEditView.legalRecords")}</Typography>}
                    {Array.isArray(item.legal_records) && item.legal_records?.map((file) => (
                      <div key={file.file_id} data-testid="table_uploaded_application_document_column_file_name">
                        {file.application_legal_record_id}
                      </div>
                    ))}
                  </Grid>
                  <Grid item md={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                    {(store.first_structure_id == item.structure_id || MainStore.isSecretary) && <CustomButton
                      variant="contained"
                      size="small"
                      id="id_TechCouncilSaveButton"
                      onClick={() => {
                        store.sign(() => {
                          store.onSaveClick((item.id));
                          store.currentId = item.id;
                        })

                      }}
                    >
                      {translate("Подписать и сохранить")}
                    </CustomButton>}
                    {(store.first_structure_id == item.structure_id || MainStore.isSecretary) && <CustomButton
                      variant="contained"
                      size="small"
                      id="id_TechCouncilSaveButton"
                      onClick={() => {
                        store.openFilePanel(item.id, item.application_id, item.structure_id);
                      }}
                    >
                      {translate("common:addFile")}
                    </CustomButton>}
                    {/* {(store.first_structure_id == item.structure_id || MainStore.isSecretary) && <CustomButton
                      variant="contained"
                      size="small"
                      id="id_TechCouncilSaveButton"
                      onClick={() => {
                        store.openLegalRecords(item.id, item.application_id, item.structure_id, item.legal_records);
                      }}
                    >
                      {translate("label:TechCouncilAddEditView.add_legal_record")}
                    </CustomButton>} */}
                  </Grid>
                </Grid>
              ))}
            </CardContent>
            <UploadFileForm
              openPanel={store.isOpenFilePanel}
              application_id={store.fileAdd_application_id}
              structure_id={store.fileAdd_structure_id}
              onBtnCancelClick={() => store.closeFilePanel()}
            />
            <LegalRecordsForm
              openPanel={store.isOpenLegalRecordsPanel}
              application_id={store.fileAdd_application_id}
              structure_id={store.fileAdd_structure_id}
              onBtnCancelClick={() => store.closeLegalRecords()}
            />
          </Card>
        </Paper>
      </Grid>
    </Grid>
  );
});

const StyledRouterLink = styled(RouterLink)`
    &:hover {
        text-decoration: underline;
    }

    color: #0078DB;
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default TechCouncilAddEditView;