import React, { FC, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper, Slider,
  Tooltip,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import EditIcon from "@mui/icons-material/Create";
import LayoutStore from "layouts/MainLayout/store";
import styled from "styled-components";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import CustomButton from "components/Button";
import ObjectMapPopupView from "./MapPopupForm";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import PopupApplicationStore from "../../Application/PopupAplicationListView/store";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import BadgeButton from "../../../components/BadgeButton";
import PersonIcon from "@mui/icons-material/Person";
import DomainIcon from "@mui/icons-material/Domain";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import LinearProgress from "@mui/material/LinearProgress";
import { LayersControl, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import MaskedAutocomplete from "../../../components/MaskedAutocomplete";
import GisSearch from "../../../components/2gisSearch";
import TextField from '@mui/material/TextField';

const { BaseLayer } = LayersControl;

type ApplicationInfoCardsProps = {
  hasAccess: boolean;
};

const ApplicationInfoCards: FC<ApplicationInfoCardsProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const startDate = dayjs(store.Application.registration_date);
  const endDate = dayjs(store.Application.deadline);
  const today = dayjs();

  const totalDays = endDate.diff(startDate, "day") + 1;
  const passedDays = today.diff(startDate, "day") + 1;
  const remainingDays = Math.max(totalDays - passedDays, 0);

  const mapRef = useRef(null);

  const updateWmsParams = (e) => {
    if (store.coordsInEditing) {
      store.setCoords(e.latlng.lat, e.latlng.lng);
    }
  };

  const createCustomIcon = (text?: string, color?: string) => {

    const displayText = text || "";
    const displayColor = color || "#FF0000";

    const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" xml:space="preserve">
      <path d="M26 12c0 8-11 17-11 17S4 20 4 12C4 5.9 8.9 1 15 1s11 4.9 11 11" fill="${displayColor}"/>
      <circle cx="15" cy="12" r="10" fill="#FFFFFF"/>
      <text x="15" y="16" font-size="7" text-anchor="middle" fill="#000000" font-family="Arial">${displayText}</text>
    </svg>`;

    const encodedSvg = btoa(unescape(encodeURIComponent(svgIcon)));

    return new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
      iconSize: [40, 40],
      iconAnchor: [20, 60]
    });
  };

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="medium" sx={{ textAlign: "right" }}>{value}</Typography>
    </Box>
  );

  const calculateBackUrl = () => {
    if (store.backUrl === "all") {
      return `/user/all_tasks`;
    } else if (store.backUrl === "my") {
      return `/user/my_tasks`;
    } else if (store.backUrl === "structure") {
      return `/user/structure_tasks`;
    } else {
      return `/user/structure_tasks`;
    }
  };

  let filteredStatuses = store.Statuses.reduce((acc, s) => {
    let matchingRoad = store.ApplicationRoads.find(ar =>
      ar.from_status_id === store.Application.status_id &&
      ar.to_status_id === s.id &&
      ar.is_active === true
    );
    if (matchingRoad) {
      acc.push({
        ...s,
        is_allowed: matchingRoad.is_allowed
      });
    }
    return acc;
  }, []);

  return (
    <MainContent>
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={12}>
              <Card elevation={3}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon />
                    <Typography variant="h6" fontWeight="bold">
                      Заказчик
                    </Typography>
                  </Box>

                  <Box sx={{ width: "100%" }}>
                    <InfoRow label="ФИО" value={store.Customer?.full_name || "-"} />
                    <InfoRow
                      label="PIN"
                      value={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span>{store.Customer?.pin}</span>
                          <BadgeButton
                            count={store.appCountsCustomer}
                            icon={<ContentPasteSearchIcon sx={{ color: "#FF652F", width: 14, height: 14 }} />}
                            onClick={() => {
                              PopupApplicationStore.handleChange({
                                target: {
                                  name: "openCustomerApplicationDialog",
                                  value: !PopupApplicationStore.openCustomerApplicationDialog
                                }
                              });
                              PopupApplicationStore.handleChange(
                                {
                                  target: {
                                    name: "common_filter",
                                    value: store.Customer?.pin
                                  }
                                },
                                "filter"
                              );
                              PopupApplicationStore.handleChange(
                                {
                                  target: {
                                    name: "only_count",
                                    value: false
                                  }
                                },
                                "filter"
                              );
                            }}
                          />
                        </Box>
                      }
                    />
                    {store.Customer?.sms_1 && <InfoRow label="Телефон" value={store.Customer.sms_1} />}
                    {store.Customer?.email_1 && <InfoRow label="Email" value={store.Customer.email_1} />}
                    {store.Customer.customerRepresentatives.length > 0 && (
                      <InfoRow
                        label="Представитель"
                        value={`${store.Customer.customerRepresentatives[0].last_name} ${store.Customer.customerRepresentatives[0].first_name}`}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12}>
              <Card elevation={3}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  {/* Заголовок с иконкой */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DomainIcon />
                    <Typography variant="h6" fontWeight="bold">
                      Объект
                    </Typography>
                  </Box>

                  <Box sx={{ width: "100%" }}>
                    {/* Адреса */}
                    {store.arch_objects.map((obj, index) => (
                      <InfoRow
                        key={obj.id}
                        label="Адрес"
                        value={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {obj.address}
                            <BadgeButton
                              count={store.counts && store.counts.length > 0 ? store.counts[index] : 0}
                              icon={<ContentPasteSearchIcon sx={{ color: "#FF652F", width: 14, height: 14 }} />}
                              onClick={() => {
                                PopupApplicationStore.handleChange({
                                  target: {
                                    name: "openCustomerApplicationDialog",
                                    value: !PopupApplicationStore.openCustomerApplicationDialog
                                  }
                                });
                                PopupApplicationStore.handleChange(
                                  {
                                    target: {
                                      name: "common_filter",
                                      value: obj.address
                                    }
                                  },
                                  "filter"
                                );
                                PopupApplicationStore.handleChange(
                                  {
                                    target: {
                                      name: "only_count",
                                      value: false
                                    }
                                  },
                                  "filter"
                                );
                              }}
                            />
                          </Box>
                        }
                      />
                    ))}

                    {/* Координаты */}
                    {/*<InfoRow*/}
                    {/*  label="Координаты"*/}
                    {/*  value={*/}
                    {/*    <Chip*/}
                    {/*      onClick={() => store.onEditMap()}*/}
                    {/*      size="small"*/}
                    {/*      label={*/}
                    {/*        store.object_xcoord !== 0 && store.object_ycoord !== 0*/}
                    {/*          ? translate("label:ApplicationTaskListView.Show_on_map")*/}
                    {/*          : translate("label:ApplicationTaskListView.Put_a_point")*/}
                    {/*      }*/}
                    {/*      sx={{*/}
                    {/*        backgroundColor: store.object_xcoord !== 0 && store.object_ycoord !== 0 ? "green" : "red",*/}
                    {/*        color: "#fff",*/}
                    {/*        cursor: "pointer"*/}
                    {/*      }}*/}
                    {/*    />*/}
                    {/*  }*/}
                    {/*/>*/}

                    
                    <InfoRow label="Описание работ" value={store.Application?.work_description || "-"} />

                    {/* Район */}
                    <InfoRow
                      label="Район"
                      value={
                        <LookUp
                          value={store.district_id}
                          onChange={(event) => store.changeDistrict(event.target.value)}
                          name="district_id"
                          data={store.Districts}
                          id="district_id"
                          error={!!store.errordistrict_id}
                          helperText={store.errordistrict_id}
                          hideLabel
                          disabled={store.isDisabled}
                          label={translate("Район")}
                        />
                      }
                    />

                    {/* Площадь */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                        Площадь объекта
                      </Typography>
                      <Box>
                        <SmallTextField
                          value={store.object_square}
                          noFullWidth
                          disabled={store.isDisabled}
                          onChange={(event) => store.changeObjectSquare(event.target.value)}
                          name="object_square"
                          data-testid="id_f_application_task_object_square"
                          id="id_f_application_task_object_square"
                          label={""}
                          type="number"
                        />
                        <LookUp
                          value={store.unit_type_id}
                          onChange={(event) => store.changeUnitType(event.target.value)}
                          name="unit_type_id"
                          data={store.UnitTypes}
                          id="unit_type_id"
                          skipEmpty
                          disabled={store.isDisabled}
                          maxWidth={100}
                          error={!!store.errorunit_type_id}
                          helperText={store.errorunit_type_id}
                          hideLabel
                          label={translate("Район")}
                        />
                      </Box>
                    </Box>

                    {/* Тэги */}
                    <InfoRow
                      label="Тэги"
                      value={
                        <>
                          {store.tags?.map((x) => (
                            <Chip
                              key={x.id}
                              size="small"
                              sx={{ mb: 1, mr: 1 }}
                              label={store.Tags.find((y) => y.id === x)?.name}
                            />
                          ))}
                          <Tooltip title="Редактировать тэги">
                            <IconButton
                              disabled={store.isDisabled}
                              size="small"
                              onClick={() => store.onEditTaskTags(true)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      }
                    />

                    {/* Тип объекта */}
                    <InfoRow
                      label="Тип объекта"
                      value={
                        <LookUp
                          value={store.object_tag_id}
                          onChange={(event) => store.changeObjectTag(event.target.value)}
                          name="object_tag_id"
                          data={store.ObjectTags}
                          id="object_tag_id"
                          error={!!store.errorobject_tag_id}
                          helperText={store.errorobject_tag_id}
                          hideLabel
                          disabled={store.isDisabled}
                          label={translate("label:ApplicationAddEditView.object_tag_id")}
                        />
                      }
                    />

                    {/* Тех. решение */}
                    <InfoRow
                      label="Техническое решение"
                      value={
                        <LookUp
                          value={store.tech_decision_id}
                          onChange={(event) => store.changeTechDecision(event.target.value)}
                          name="tech_decision_id"
                          data={store.tech_decisions}
                          id="tech_decision_id"
                          error={!!store.errortech_decision_id}
                          helperText={store.errortech_decision_id}
                          hideLabel
                          disabled={store.isDisabled}
                          label={translate("Район")}
                        />
                      }
                    />

                    {/* Тип услуги */}
                    {store.StructureTags.filter((x) => x.structure_id === store.structure_id).length !== 0 && (
                      <InfoRow
                        label="Тип услуги"
                        value={
                          <LookUp
                            value={store.structure_tag_id}
                            onChange={(event) => store.changeStructureTag(event.target.value)}
                            name="structure_tag_id"
                            error={!!store.errorstructure_tag_id}
                            helperText={store.errorstructure_tag_id}
                            data={store.StructureTags.filter((x) => x.structure_id === store.structure_id)}
                            id="structure_tag_id"
                            hideLabel
                            disabled={store.isDisabled}
                            label={translate("Тип услуги")}
                          />
                        }
                      />
                    )}

                    {/* Кнопка сохранить */}
                    {store.taskEdited && (
                      <Box display="flex" justifyContent="flex-end" sx={{ mt: 1 }}>
                        <CustomButton
                          onClick={() => store.saveApplicationTags()}
                          disabled={
                            store.errorobject_tag_id !== "" ||
                            store.errorstructure_tag_id !== "" ||
                            store.errordistrict_id !== "" ||
                            store.isDisabled
                          }
                        >
                          Сохранить
                        </CustomButton>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={12}>
              <Card elevation={3}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1, marginRight: 1 }}>
                    {`${translate("label:ApplicationAddEditView.Object_address")}: `}
                    <span style={{ fontWeight: "normal" }}>
            {store.arch_objects.map(x => x.address).join(", ")}
          </span>
                  </Typography>
                  {store.newCoordAddres !== "" &&
                    <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1, marginRight: 1 }}>
                      {`${translate("Новый адрес")}: `}
                      <span style={{ fontWeight: "normal" }}>
            {store.newCoordAddres}
          </span>
                    </Typography>}
                  <Grid container spacing={3}>
                    <Grid item md={9}>
                      <MapContainer
                        ref={(ref) => {
                          if (ref && mapRef.current !== ref) {
                            mapRef.current = ref;
                            ref.on("click", updateWmsParams);
                          }
                        }}
                        center={[42.87, 74.60] as LatLngExpression}
                        zoom={12}
                        style={{ height: "700px", width: "100%" }}>
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
                        {store.object_xcoord !== 0 && store.object_ycoord !== 0 &&
                          <Marker position={[store.object_xcoord, store.object_ycoord]}>
                            <Popup>
                              <div>
                                <strong>Адрес:</strong> {store.object_address}
                              </div>
                            </Popup>
                          </Marker>}

                        {store.mapLayers?.length > 0 && store.mapLayers.map((layer, index) => {
                          const customIcon = createCustomIcon(layer.type);
                          if (!layer.point || !layer.address) {
                            return;
                          }
                          return (
                            <Marker key={index} position={[layer.point[0], layer.point[1]]} icon={customIcon}>
                              <Popup>
                                <div>
                                  <strong>Адрес:</strong> {`${layer.address}`}
                                </div>
                              </Popup>
                            </Marker>
                          );
                        })}

                        {store.mapDutyPlanObject?.length > 0 && store.mapDutyPlanObject.map((layer, index) => {
                          const customIcon = createCustomIcon(layer.number, "#0000FF");
                          if (!layer.point || !layer.address) {
                            return;
                          }
                          const files = JSON.parse(layer.archive_folders);
                          return (
                            <Marker key={index} position={[layer.point[0], layer.point[1]]} icon={customIcon}>
                              <Popup>
                                <div>
                                  <strong>Номер документа:</strong> {`${layer.number}`}<br />
                                  <strong>Адрес:</strong> {`${layer.address}`}<br />
                                  <a
                                    href={`https://2gis.kg/bishkek/geo/${layer.point[1]}%2C${layer.point[0]}?m=${layer.point[1]}%2C${layer.point[0]}%2F14.6`}
                                    target="_blank"
                                    rel="noopener noreferrer">Открыть в 2gis</a><br />
                                  <br />
                                  <div style={{ maxHeight: "200px", overflow: "auto", border: "1px solid black" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                      <thead>
                                      <tr>
                                        <th style={{ border: "1px solid black", padding: "5px" }}>Имя папки</th>
                                        <th style={{ border: "1px solid black", padding: "5px" }}>Имя файла</th>
                                      </tr>
                                      </thead>
                                      <tbody>
                                      {files.filter(item => item.folder_name && item.file_name).map((item, index) => (
                                        <tr key={index}>
                                          <td style={{
                                            border: "1px solid black",
                                            padding: "5px"
                                          }}>{item.folder_name}</td>
                                          <td
                                            style={{ border: "1px solid black", padding: "5px" }}>{item.file_name}</td>
                                        </tr>
                                      ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </Popup>
                            </Marker>
                          );
                        })}

                      </MapContainer>
                    </Grid>
                    <Grid item md={3}>
                      <Grid container spacing={1}>
                        <Grid item md={12}>
                          <MaskedAutocomplete
                            data={store.DarekSearchList ?? []}
                            value={0}
                            label={translate("label:ArchObjectAddEditView.identifier")}
                            name="darek_eni"
                            onChange={(newValue: any) => {
                              store.darek_eni = newValue.propcode;
                              store.identifier = newValue.propcode;
                              store.searchFromDarek(newValue.propcode);
                            }}
                            freeSolo={true}
                            fieldNameDisplay={(option) => option?.propcode}
                            onInputChange={(event, value) => {
                              store.darek_eni = "";
                              if (value?.length > 12) {
                                store.identifier = value;
                                store.getSearchListFromDarek(value);
                              }
                            }}
                            mask="0-00-00-0000-0000-00-000"
                          />
                        </Grid>
                        <Grid item md={12}>
                          <GisSearch
                            id="id_f_ArchObject_address"
                            label={translate("label:ArchObjectAddEditView.address")}
                            onChange={store.handleAddressChange}
                            value={store.address}
                          />
                        </Grid>
                        <Grid item md={12}>
                          <CustomTextField
                            helperText={store.errordutyPlanObjectNumber}
                            error={store.errordutyPlanObjectNumber != ""}
                            id="id_f_dutyPlanObjectNumber"
                            label={translate("Поиск по объектам дежурного плана")}
                            value={store.dutyPlanObjectNumber}
                            onChange={(event) => {
                              store.handleChange(event);
                              store.loadDutyPlanObjects();
                            }}
                            name="dutyPlanObjectNumber"
                          />
                        </Grid>
                        <Grid item md={11}>
                          <Typography>Радиус поиска от точки (м): {store.radius} </Typography>
                          <Slider
                            value={store.radius}
                            onChange={(e, newValue) => {
                              store.radius = newValue as number;
                              store.loadDutyPlanObjects();
                            }}
                            disabled={store.object_xcoord == 0 && store.object_ycoord == 0}
                            valueLabelDisplay="auto"
                            min={100}
                            max={1000}
                            step={100}
                          />
                        </Grid>
                        <Grid item md={12}>
                          {store.coordsInEditing ? <CustomButton
                              variant="contained"
                              disabled={!store.coordsEdited}
                              id="id_ApplicationSaveButton"
                              onClick={() => {
                                store.saveCoords();
                              }}
                            >
                              {translate("common:save")}
                            </CustomButton> :
                            <CustomButton
                              variant="contained"
                              id="id_ApplicationSaveButton"
                              onClick={() => {
                                store.changeEditCoord(true);
                              }}
                            >
                              {translate((store.object_xcoord !== 0 && store.object_ycoord !== 0) ? "Изменить точку" : "Поставить точку")}
                            </CustomButton>}
                        </Grid>
                      </Grid>

                    </Grid>
                  </Grid>
                  <Box display="flex" justifyContent={"space-between"} sx={{ width: "100%" }}>
                    <Box>
                      {store.object_xcoord !== 0 && store.object_ycoord !== 0 &&
                        <a
                          style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                          target="_blank"
                          href={`https://2gis.kg/bishkek/geo/${store.object_ycoord}%2C${store.object_xcoord}?m=${store.object_ycoord}%2C${store.object_xcoord}%2F14.6`}>
                          {translate("common:openIn2GIS")}
                        </a>}
                      {store.darek_eni?.length !== 0 &&
                        <a
                          style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                          target="_blank"
                          href={`/user/DarekView?eni=${store.darek_eni}`}>
                          {translate("common:openInDarekOnEni")}
                        </a>}
                      {store.object_xcoord !== 0 && store.object_ycoord !== 0 &&
                        <a
                          style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                          target="_blank"
                          href={`/user/DarekView?coordinate=${store.object_xcoord},${store.object_ycoord}`}>
                          {translate("common:openInDarekOnLatLng")}
                        </a>}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ObjectMapPopupView />
    </MainContent>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StyledRouterLink = styled(RouterLink)`
    &:hover {
        text-decoration: underline;
    }

    color: #0078DB;
`;
const SmallTextField = styled(CustomTextField)`
    .MuiOutlinedInput-input {
        padding: 3px 5px;
        width: 70px;
    }
`;
const MainContent = styled.div`
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    padding-right: 10px;
`;


export default ApplicationInfoCards;