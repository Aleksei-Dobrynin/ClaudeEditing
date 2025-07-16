import React, { FC } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  InputLabel,
  NativeSelect,
  Paper,
  Radio,
  RadioGroup
} from "@mui/material";
import DateField from "../../../components/DateField";
import store from "./store";
import { ScheduleNav } from "../../../constants/CustomSubscribtion";
import TimeField from "../../../components/TimeField";
import CustomCheckbox from "../../../components/Checkbox";
import TextField from "../../../components/TextField";
import Typography from "@mui/material/Typography";
import AutocompleteCustom from "../../../components/Autocomplete";
import LookUp from "../../../components/LookUp";
import MainStore from "../../../MainStore";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container title={translate("label:CustomSubscribtionAddEditView.entityTitle")}>
      <Container>
        <Grid container md={7} xs={12}>
          <form id="id_CustomSubscribtionForm" name="name_CustomSubscribtionForm" autoComplete="off" noValidate>
            <Paper elevation={7} style={{ width: "100%" }}>
              <Card>
                <CardHeader
                  title={<span
                    id="id_f_CustomSubscribtion_title_name">{translate("label:CustomSubscribtionAddEditView.entityTitle")}</span>} />
                <Divider />
                <CardContent>
                  <Grid container xs={12} spacing={3} style={{ margin: 0 }}>
                    {MainStore.isAdmin && <Grid item md={12} xs={12}>
                      <LookUp
                        value={store.idStructurePost}
                        onChange={(event) => store.handleChange(event)}
                        name="idStructurePost"
                        data={store.StructurePost}
                        id="id_f_idStructurePost"
                        label={translate("label:CustomSubscribtionAddEditView.idStructurePost")}
                        helperText={store.erroridStructurePost}
                        error={!!store.erroridStructurePost}
                      />
                    </Grid>}
                    <Grid item md={12} xs={12}>
                      <DateField
                        label={translate("label:CustomSubscribtionAddEditView.activeDateStart")}
                        name="activeDateStart"
                        id="id_f_CustomSubscribtion_activeDateStart"
                        onChange={(event) => store.handleChange(event)}
                        value={store.activeDateStart}
                        helperText={store.erroractiveDateStart}
                        error={store.erroractiveDateStart !== ""}
                      />
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <DateField
                        label={translate("label:CustomSubscribtionAddEditView.activeDateEnd")}
                        name="activeDateEnd"
                        id="id_f_CustomSubscribtion_activeDateEnd"
                        onChange={(event) => store.handleChange(event)}
                        value={store.activeDateEnd}
                        helperText={store.erroractiveDateEnd}
                        error={store.erroractiveDateEnd !== ""}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <RadioGroup aria-label="idSchedule" name="idSchedule" value={store.idSchedule + ""}
                                  onChange={(e) => {
                                    store.clearStoreWhithChangeRadio();
                                    store.handleChange(e);
                                    store.setSchedule(e);
                                  }}
                      >
                        {store.ScheduleTypes?.map((book: ScheduleNav) => (
                          <FormControlLabel
                            value={"" + book.id} control={<Radio />}
                            label={translate("label:CustomSubscribtionData." + book.code)} />
                        ))}
                      </RadioGroup>
                    </Grid>

                    {store.selectedSchedule === "once" && <>
                      <Grid item md={12} xs={12}>
                        <DateField
                          label={translate("label:CustomSubscribtionAddEditView.dayStart")}
                          name="dayStart"
                          id="id_f_CustomSubscribtion_dayStart"
                          onChange={(e) => store.handleChange(e)}
                          value={store.dayStart}
                          helperText={store.errordayStart}
                          error={store.errordayStart !== ""}
                        />
                      </Grid>
                    </>}
                    {store.scheduleItem?.code !== "once" &&
                      <>
                        <Grid item md={12} xs={12}>
                          <InputLabel
                            error={store.erroridRepeatType === "" ? false : true}
                            id="id_f_CustomSubscribtion_idRepeatType-label">{translate("label:CustomSubscribtionAddEditView.idRepeatType")}</InputLabel>
                          <NativeSelect
                            id="idRepeatType"
                            value={store.idRepeatType ? store.idRepeatType : "0" }
                            name="idRepeatType"
                            variant="outlined"
                            required
                            onChange={(e) => {
                              store.setCurrentRepeatTypeIsPeriod(e);
                              store.handleChange(e);
                            }}
                          >
                            <option key={"idRepeatType0"} aria-label="None" value="0" />
                            {
                              store.RepeatTypes == null ? "" : store.RepeatTypes.map((book) => (
                                <option key={"idRepeatType" + book.id} value={book.id}>{book.name}</option>
                              ))}
                          </NativeSelect>

                        </Grid>
                      </>
                    }
                    <Grid item md={12} xs={12}>
                      <TimeField
                        id="id_f_CustomSubscribtion_timeStart"
                        label={translate("label:CustomSubscribtionAddEditView.timeStart")}
                        name="timeStart"
                        onChange={(e) => store.handleChange(e)}
                        value={store.timeStart}
                        helperText={store.errortimeStart}
                        error={store.errortimeStart !== ""}
                      />
                    </Grid>

                    {store.scheduleItem?.code !== "once" && store.currentRepeatTypeIsPeriod === true &&
                      <Grid item md={12} xs={12}>
                        <TimeField
                          id="id_f_CustomSubscribtion_timeEnd"
                          label={translate("label:CustomSubscribtionAddEditView.timeEnd")}
                          name="timeEnd"
                          onChange={(e) => store.handleChange(e)}
                          value={store.timeEnd}
                          helperText={store.errortimeStart}
                          error={store.errortimeStart !== ""}
                        />
                      </Grid>}

                    {store.scheduleItem?.code === "daysPerWeek" ?
                      <Grid item md={12} xs={12}>
                        {store.errorweekDay !== "" ? <Typography sx={{width: "100%", color: "red"}}>{store.errorweekDay}</Typography> : null}
                        <FormControlLabel
                          label={""}
                          control={
                            <CustomCheckbox
                              id={"monday"}
                              name="monday"
                              onChange={(e) => store.handleChange(e)}
                              value={store.monday}
                              label={translate("label:CustomSubscribtionAddEditView.monday")}
                            />
                          }

                        />
                        <FormControlLabel
                          label={""}
                          control={
                            <CustomCheckbox
                              label={translate("label:CustomSubscribtionAddEditView.tuesday")}
                              name="tuesday"
                              onChange={(e) => store.handleChange(e)}
                              value={store.tuesday}
                              id={"1"}
                            />
                          }
                        />
                        <FormControlLabel
                          label={""}
                          control={
                            <CustomCheckbox
                              label={translate("label:CustomSubscribtionAddEditView.wednesday")}
                              name="wednesday"
                              onChange={(e) => store.handleChange(e)}
                              value={store.wednesday}
                              id={"1"}
                            />
                          }
                        />
                        <FormControlLabel
                          label={""}
                          control={
                            <CustomCheckbox
                              label={translate("label:CustomSubscribtionAddEditView.thursday")}
                              name="thursday"
                              onChange={(e) => store.handleChange(e)}
                              value={store.thursday}
                              id={"1"}
                            />
                          }
                        />
                        <FormControlLabel
                          label={""}
                          control={
                            <CustomCheckbox
                              name="friday"
                              onChange={(e) => store.handleChange(e)}
                              value={store.friday}
                              id={"1"}
                              label={translate("label:CustomSubscribtionAddEditView.friday")}
                            />
                          }
                        />
                        <FormControlLabel
                          label={""}
                          control={
                            <CustomCheckbox
                              label={translate("label:CustomSubscribtionAddEditView.saturday")}
                              name="saturday"
                              onChange={(e) => store.handleChange(e)}
                              value={store.saturday}
                              id={"1"}
                            />
                          }
                        />
                        <FormControlLabel
                          label={""}
                          control={
                            <CustomCheckbox
                              label={translate("label:CustomSubscribtionAddEditView.sunday")}
                              name="sunday"
                              onChange={(e) => store.handleChange(e)}
                              value={store.sunday}
                              id={"1"}
                            />
                          }
                        />
                      </Grid>
                      : ""}

                    {store.scheduleItem?.code === "daysPerMonth" ? <>

                        <Grid container alignContent={"center"} mt={"10px"}>
                          <Grid item md={1} xs={1}>
                            <Radio
                              checked={store.monthIsWeekDay}
                              onChange={(e) => {
                                store.setMonthIsWeekDay();
                              }}
                              value={store.monthIsWeekDay}
                              name="radioDateOfMonth"
                            />
                          </Grid>


                          <Grid item md={11} xs={11}>
                            <InputLabel
                              id="demo-simple-select-error-label">{translate("label:CustomSubscribtionAddEditView.dateOfMonth")}</InputLabel>
                            <NativeSelect
                              sx={{ width: "100%" }}
                              id="dateOfMonth"
                              value={store.dateOfMonth}
                              name="dateOfMonth"
                              variant="outlined"
                              disabled={!store.monthIsWeekDay}
                              onChange={(e) => {
                                store.handleChange(e);
                              }}
                            >
                              <option key={"monthDays" + 0} aria-label="None" value="0" />
                              {
                                Array.from({ length: 31 }, (_, i) => i + 1).map((number) => (
                                  <option key={"dateOfMonth" + number} value={number}>{number}</option>
                                ))}
                            </NativeSelect>
                          </Grid>
                        </Grid>

                        <Grid container alignContent={"center"}>
                          <Grid item md={1} xs={1}>
                            <Radio
                              checked={store.weekIsOfMonth}
                              onChange={(e) => {
                                store.setWeekIsOfMonth();
                              }}
                              value={store.weekIsOfMonth}
                              name="radioWeekOfMonth"
                            />
                          </Grid>

                          <Grid item md={6} xs={6}>
                            <InputLabel
                              id="demo-simple-select-error-label">{translate("label:CustomSubscribtionAddEditView.weekOfMonth")}</InputLabel>
                            <NativeSelect
                              sx={{ width: "90%" }}
                              id="weekOfMonth"
                              value={store.weekOfMonth}
                              name="weekOfMonth"
                              variant="outlined"
                              disabled={!store.weekIsOfMonth}
                              onChange={(e) => {
                                store.handleChange(e);
                              }}
                            >
                              <option key={"weekDays" + 0} aria-label="None" value="0" />
                              {
                                ["1-я", "2-я", "3-я", "4-я", "5-я"].map((week, index) => (
                                  <option key={"weekOfMonth" + week} value={(index + 1) + ""}>{week}</option>
                                ))}
                            </NativeSelect>
                          </Grid>

                          <Grid item md={5} xs={5}>
                            <InputLabel
                              id="demo-simple-select-error-label">{translate("label:CustomSubscribtionAddEditView.weekDay")}</InputLabel>
                            <NativeSelect
                              sx={{ width: "90%" }}
                              disabled={!store.weekIsOfMonth}
                              id="weekDay"
                              value={store.weekDay}
                              name="weekDay"
                              variant="outlined"
                              onChange={(e) => {
                                store.handleChangeWeek(e);
                              }}
                            >
                              <option key={"monthDays" + 0} aria-label="None" value="0" />
                              {
                                [
                                  { name: "monday", text: translate("label:CustomSubscribtionAddEditView.monday") },
                                  { name: "tuesday", text: translate("label:CustomSubscribtionAddEditView.tuesday") },
                                  { name: "wednesday", text: translate("label:CustomSubscribtionAddEditView.wednesday") },
                                  { name: "thursday", text: translate("label:CustomSubscribtionAddEditView.thursday") },
                                  { name: "friday", text: translate("label:CustomSubscribtionAddEditView.friday") },
                                  { name: "saturday", text: translate("label:CustomSubscribtionAddEditView.saturday") },
                                  { name: "sunday", text: translate("label:CustomSubscribtionAddEditView.sunday") }
                                ]
                                  .map((week, index) => (
                                    <option key={"weekDay" + week} value={week.name}>{week.text}</option>
                                  ))}
                            </NativeSelect>
                          </Grid>
                        </Grid>
                      </>
                      : ""}
                    <Grid item md={12} xs={12}>
                      <TextField
                        label={translate("label:CustomSubscribtionAddEditView.body")}
                        name="body"
                        id="id_f_CustomSubscribtion_body"
                        onChange={(e) => store.handleChange(e)}
                        value={store.body}
                        helperText={store.errorbody}
                        error={store.errorbody !== ""}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <InputLabel
                        id="demo-simple-select-error-label">{translate("label:CustomSubscribtionAddEditView.idDocumentNavName")}</InputLabel>
                      <NativeSelect
                        sx={{ width: "100%" }}
                        id="idDocument"
                        value={store.idDocument}
                        name="idDocument"
                        variant="outlined"
                        onChange={(e) => {
                          store.handleChange(e);
                        }}
                      >
                        <option key={"dicuments" + 0} aria-label="None" value="0" />
                        {
                          store.DocumentNav.map((doc, index) => (
                            <option key={"Document" + doc.id} value={doc.id}>{doc.name}</option>
                          ))}
                      </NativeSelect>
                    </Grid>

                    <Grid item md={12} xs={12} flex={"column"}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography >{translate("label:CustomSubscribtionAddEditView.ContactTypes")}</Typography>
                        {store.erroridSubscribtionType !== "" && <Typography sx={{color:"red"}}>{store.erroridSubscribtionType}</Typography>}
                      </Box>
                      <Grid item md={12} xs={12} pt={"10px"}>
                      {store.ContactTypes?.map((item, index) => {
                        return (
                          <FormControlLabel
                            key={item.id}
                            label={""}
                            required = {true}
                            sx={{mr: "20px"}}
                            control={
                              <CustomCheckbox
                                id={item.name}
                                name={String(item.id)}
                                onChange={(e) => store.handleChangeIdSubscriptionContactType(e)}
                                value={store.getValueIdSubscriptionContactType(item.id)}
                                label={item.name}
                              />
                            }
                          />
                        );
                      })
                      }
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid>
                  </Grid>
                </CardContent>
                {props.children}
              </Card>
            </Paper>
          </form>
        </Grid>
      </Container>
    </Container>
  );
});


export default BaseView;