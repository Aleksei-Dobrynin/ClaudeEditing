import React, { FC, useEffect } from "react";
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
  Paper,
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomButton from "components/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import FastInputapplication_paymentView from "features/ApplicationPayment/application_paymentTask/fastInput";
import FastInputapplication_paid_invoiceView
  from "features/ApplicationPaidInvoice/application_paid_invoiceAddEditView/fastInput";
import HistoryIcon from "@mui/icons-material/History";
import MtmLookup from "components/mtmLookup";
import MainStore from "MainStore";
import ObjectMapPopupView from "./MapPopupForm";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import FileField from "../../../components/FileField";
import PopupApplicationListView from "../../Application/PopupAplicationListView/PopupAplicationListView";
import PopupApplicationStore from "../../Application/PopupAplicationListView/store";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import BadgeButton from "../../../components/BadgeButton";
import TechCouncilForm from './TechCouncilForm'
import TechCouncilStore from "../../TechCouncil/TechCouncilAddEditView/store";

import TaskTabs from "./Tabs";


type CardApplicationProps = {
  hasAccess: boolean;
};

const CardApplication: FC<CardApplicationProps> = observer((props) => {
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

  // const [isDisabled, setIsDisabled] = React.useState<boolean>(false);

  // useEffect(() => {
  //   const result = !(MainStore.isAdmin || MainStore.isHeadStructure || store.task_assigneeIds.includes(LayoutStore.employee_id) || (store.application_resolved && !MainStore.isAdmin));
  //   setIsDisabled(result);
  // }, []);


  const calculateBackUrl = () => {
    if (store.backUrl === "all") {
      return `/user/all_tasks`
    } else if (store.backUrl === "my") {
      return `/user/my_tasks`
    } else if (store.backUrl === "structure") {
      return `/user/structure_tasks`
    } else {
      return `/user/structure_tasks`
    }
  }

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

      <Paper elevation={7} variant="outlined">
        <Card>
          <CardContent>
            {/* <TaskTabs /> */}
            <Grid container>
              <Grid item md={12} xs={12}>
                {/* <Box display="flex" justifyContent={"space-between"} alignItems={"center"} sx={{ mb: 1 }}>

                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                    <StyledRouterLink to={`/user/application/addedit?id=${store.application_id}`}>
                      # {store.application_number}
                    </StyledRouterLink>
                  </Typography>

                  <Box>
                    <CustomButton
                      customColor={"#718fb8"}
                      size="small"
                      variant="contained"
                      sx={{ mb: "5px", mr: 1 }}
                      disabled={!(store.is_done || store.is_main || (MainStore.isAdmin || MainStore.isHeadStructure || store.task_assigneeIds.includes(LayoutStore.employee_id)))}
                      onClick={handleClick}
                      endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    >
                      {`${translate("label:ApplicationAddEditView.status")}${store.Statuses.find(s => s.id === store.Application.status_id)?.name}`}
                    </CustomButton>
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
                        {store.id > 0 && store.Application.status_id > 0 && filteredStatuses.map(x => {
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
                            disabled={!x.is_allowed}
                          >
                            {x.name}
                          </MenuItem>
                            ;
                        })}
                      </Menu>
                    }
                    <Tooltip title={`${translate("label:HistoryTableListView.entityTitle")} `} arrow>
                      <IconButton
                        id="EmployeeList_Search_Btn"
                        onClick={() => { store.changeApplicationHistoryPanel(true) }}
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>



                <Divider /> */}

                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 1, mb: 1 }}>
                    {`${translate("Заказчик")}: `}
                    <span style={{ fontWeight: 'normal' }}>
                    {store.Customer?.full_name}, {store.Customer?.pin}
                  </span>
                  </Typography>
                  <BadgeButton
                    count={store.appCountsCustomer}
                    icon={<ContentPasteSearchIcon sx={{ color: "#FF652F" }}/>}
                    onClick={() => {
                      PopupApplicationStore.handleChange({ target: { name: "openCustomerApplicationDialog", value: !PopupApplicationStore.openCustomerApplicationDialog }})
                      PopupApplicationStore.handleChange({ target: { name: "common_filter", value: store.Customer?.pin }}, "filter");
                      PopupApplicationStore.handleChange({
                        target: {
                          name: "only_count",
                          value: false
                        }
                      }, "filter");
                    }}
                  />
                </Box>


                <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
                  {`${translate("Контакты")}: `}
                  {store.Customer?.sms_1 && <span style={{ fontWeight: 'normal', marginRight: 5 }}>{`${translate("label:CustomerAddEditView.sms_1")}: ${store.Customer?.sms_1}`}</span>}
                  {store.Customer?.sms_2 && <span style={{ fontWeight: 'normal', marginRight: 5 }}>{`${translate("label:CustomerAddEditView.sms_2")}: ${store.Customer?.sms_2}`}</span>}
                  {store.Customer?.email_1 && <span style={{ fontWeight: 'normal', marginRight: 5 }}>{`${translate("label:CustomerAddEditView.email_1")}: ${store.Customer?.email_1}`}</span>}
                  {store.Customer?.email_2 && <span style={{ fontWeight: 'normal' }}>{`${translate("label:CustomerAddEditView.email_2")}: ${store.Customer?.email_2}`}</span>}
                </Typography>

                {store.Customer.customerRepresentatives.length > 0 ? <>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
                    {`${translate("Представитель")}: `}
                    <span style={{ fontWeight: 'normal' }}>
                      {store.Customer.customerRepresentatives[0].last_name} &nbsp;
                      {store.Customer.customerRepresentatives[0].first_name} &nbsp;
                      {store.Customer.customerRepresentatives[0].second_name}&nbsp;
                      {store.Customer.customerRepresentatives[0].contact}
                    </span>
                  </Typography>
                </> : ""}

                <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
                  {`${translate("Услуга")}: `}
                  <span style={{ fontWeight: 'normal' }}>
                    {store.Application.service_name} ({store.Application.work_description})
                  </span>
                </Typography>
                {store.StructureTags.filter(x => x.structure_id === store.structure_id).length !== 0 && <Box display={"flex"}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, minWidth: 100 }}>
                    {`${translate("Тип услуги")}: `}
                  </Typography>
                  <LookUp
                    value={store.structure_tag_id}
                    onChange={(event) => store.changeStructureTag(event.target.value)}
                    name="structure_tag_id"
                    error={!!store.errorstructure_tag_id}
                    helperText={store.errorstructure_tag_id}
                    data={store.StructureTags.filter(x => x.structure_id === store.structure_id)}
                    id='structure_tag_id'
                    hideLabel
                    disabled={store.isDisabled}

                    label={translate('Тип услуги')}
                  />
                </Box>}




                <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
                  {`${translate("label:ApplicationAddEditView.registration_date")}: `}
                  <span style={{ fontWeight: 'normal' }}>
                    {dayjs(store.Application.registration_date).format('DD.MM.YYYY HH:mm')}
                  </span>
                </Typography>

                <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
                  {`${translate("label:ApplicationAddEditView.deadline")}: `}
                  <span style={{ fontWeight: 'normal' }}>
                    {dayjs(store.Application.deadline).format('DD.MM.YYYY')}
                  </span>
                </Typography>

                <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
                  {`${translate("label:ApplicationAddEditView.Status")}: `}
                  <span style={{ fontWeight: 'normal' }}>
                    {store.Application.status_name}
                  </span>
                </Typography>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, marginRight: 1 }}>
                    {`${translate("label:ApplicationAddEditView.Object_address")}: `}
                    <Box display={"flex"} flexDirection={"column"} mt={"10px"}>
                        {store.arch_objects.map((x, index) => {
                    return (
                      <Box display={"flex"} gap={"5px"} alignItems={"center"} ml={"10px"} >
                          <span style={{ fontWeight: "normal" }}>
                            {x.address}
                          </span>
                        <BadgeButton
                          count={store.counts && store.counts.length > 0 ?  store.counts[index] : 0}
                          icon={<ContentPasteSearchIcon sx={{ color: "#FF652F" }}/>}
                          onClick={() => {
                            PopupApplicationStore.handleChange({
                              target: {
                                name: "openCustomerApplicationDialog",
                                value: !PopupApplicationStore.openCustomerApplicationDialog
                              }
                            });
                            PopupApplicationStore.handleChange({
                              target: {
                                name: "common_filter",
                                value: x.address
                              }
                            }, "filter");
                            PopupApplicationStore.handleChange({
                              target: {
                                name: "only_count",
                                value: false
                              }
                            }, "filter");
                          }}
                        />
                      </Box>
                    )
                  })}
                    </Box>
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {store.object_xcoord !== 0 && store.object_ycoord !== 0 ?
                      <Chip
                        onClick={() => store.onEditMap()}
                        size="small"
                        label={translate("label:ApplicationTaskListView.Show_on_map")}
                        style={{ background: "green", color: "#ffffff" }}
                      />
                      :
                      <Chip
                        onClick={() => store.onEditMap()}
                        size="small"
                        label={translate("label:ApplicationTaskListView.Put_a_point")}
                        style={{ background: "red", color: "#ffffff" }}
                      />
                  }
                </Box>
                </Box>


                {/* <Box display={"flex"}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, marginRight: 1 }}>
                    {`${translate("label:ApplicationAddEditView.Object_district")}: `}
                  </Typography>
                  <Typography>
                    {Array.from(
                      new Set(store.arch_objects
                        .filter(obj => obj.district_name)
                        .map(obj => obj.district_name)
                      )
                    ).join(", ")}
                  </Typography>
                </Box> */}

                <Box display={"flex"}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, minWidth: 130 }}>
                    {`${translate("Район объекта")}: `}
                  </Typography>
                  <LookUp
                    value={store.district_id}
                    onChange={(event) => store.changeDistrict(event.target.value)}
                    name="district_id"
                    data={store.Districts}
                    id='district_id'
                    error={!!store.errordistrict_id}
                    helperText={store.errordistrict_id}
                    hideLabel
                    disabled={store.isDisabled}

                    label={translate('Район')}
                  />
                </Box>




                <Box display={"flex"} alignItems={"center"} sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, minWidth: 150 }}>
                    {`${translate("Площадь объекта")}: `}
                  </Typography>
                  <SmallTextField
                    value={store.object_square}
                    noFullWidth
                    disabled={store.isDisabled}
                    onChange={(event) => store.changeObjectSquare(event.target.value)}
                    name="object_square"
                    data-testid="id_f_application_task_object_square"
                    id='id_f_application_task_object_square'
                    label={""}
                    type="number"
                  />
                  <LookUp
                    value={store.unit_type_id}
                    onChange={(event) => store.changeUnitType(event.target.value)}
                    name="unit_type_id"
                    data={store.UnitTypes}
                    id='unit_type_id'
                    sx={{ ml: 1 }}
                    skipEmpty
                    disabled={store.isDisabled}
                    maxWidth={100}
                    error={!!store.errorunit_type_id}
                    helperText={store.errorunit_type_id}
                    hideLabel
                    label={translate('Район')}
                  />
                </Box>


                <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
                  {`${translate("Тэги")}: `}
                  {store.tags?.map(x => <Chip key={x.id} size="small" sx={{ mb: 1, mr: 1 }} label={store.Tags.find(y => y.id === x)?.name} />)}

                  <Tooltip title="Редактировать тэги">
                    <IconButton disabled={store.isDisabled} size="small" onClick={() => store.onEditTaskTags(true)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>

                {store.openPanelMtmTags && <Box display={"flex"} sx={{ mt: 1 }} alignItems={"center"}>
                  <MtmLookup
                    value={store.tagsForEdit}
                    onChange={(name, value) => store.changeTags(value)}
                    name="tags"
                    data={store.Tags}
                    disabled={store.isDisabled}

                    label={translate("label:arch_object_tagAddEditView.tags")}
                  />
                  <CustomButton
                    disabled={store.isDisabled}
                    sx={{ ml: 1 }}
                    onClick={() => store.saveTags()}
                    variant="contained">
                    {translate("common:save")}
                  </CustomButton>
                  <Tooltip title={translate("common:cancel")}>
                    <IconButton size="small" onClick={() => store.onEditTaskTags(false)}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </Box>}


                <Box display={"flex"}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 2, minWidth: 110 }}>
                    {`${translate("Тип объекта")}: `}
                  </Typography>
                  <LookUp
                    value={store.object_tag_id}
                    onChange={(event) => store.changeObjectTag(event.target.value)}
                    name="object_tag_id"
                    data={store.ObjectTags}
                    id='object_tag_id'
                    error={!!store.errorobject_tag_id}
                    helperText={store.errorobject_tag_id}
                    hideLabel
                    disabled={store.isDisabled}

                    label={translate('label:ApplicationAddEditView.object_tag_id')}
                  />
                </Box>

                <Box display={"flex"}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 2, minWidth: 260 }}>
                    {`${translate("label:tech_decisionListView.entityTitle")}: `}
                  </Typography>
                  <LookUp
                    value={store.tech_decision_id}
                    onChange={(event) => store.changeTechDecision(event.target.value)}
                    name="tech_decision_id"
                    data={store.tech_decisions}
                    id='tech_decision_id'
                    error={!!store.errortech_decision_id}
                    helperText={store.errortech_decision_id}
                    hideLabel
                    disabled={store.isDisabled}

                    label={translate('Район')}
                  />
                </Box>

                {((store.tech_decision_id > 0 && store.tech_decision_id != null) && (store.tech_decision_id == store.tech_decisions.find(x => x.code == "reject").id || (store.tech_decision_id == store.tech_decisions.find(x => x.code == "reject_nocouncil").id))) && <Box display={"flex"}>

                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, minWidth: 130 }}>
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
                      store.changeDocInputKey();
                    }}
                    onClear={() => {
                      store.handleChange({ target: { value: null, name: "File" } });
                      store.handleChange({ target: { value: null, name: "TechFileName" } });
                      store.changeDocInputKey();
                    }}
                  />
                </Box>}

                {store.taskEdited && <Box display={"flex"} justifyContent={"flex-end"} sx={{ mt: 1 }}>
                  <CustomButton onClick={() => store.saveApplicationTags()}
                    disabled={store.errorobject_tag_id !== "" || store.errorstructure_tag_id !== "" || store.errordistrict_id !== "" || store.isDisabled}
                  >Сохранить</CustomButton>
                </Box>}

              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>

      <ObjectMapPopupView />

      <TechCouncilForm
        openPanel={store.isOpenTechCouncil}
        onSaveClick={() => {
          TechCouncilStore.onCloseTechCouncil();
          store.isOpenTechCouncil = false}}
        idApplication={store.application_id}
        idService={store.Application.service_id}
      />
    </MainContent >
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`
const SmallTextField = styled(CustomTextField)`
  .MuiOutlinedInput-input{
    padding: 3px 5px;
    width: 70px;
  }
`
const MainContent = styled.div`
`


export default CardApplication