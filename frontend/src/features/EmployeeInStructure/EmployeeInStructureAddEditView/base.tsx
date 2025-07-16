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
  Container
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import AutocompleteCustom from 'components/Autocomplete';
import DateField from "../../../components/DateField";
import dayjs from "dayjs";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth="xl" style={{ marginTop: 20 }}>
      <Grid container>

        <form id="EmployeeInStructureForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="EmployeeInStructure_TitleName">
                  {translate("label:EmployeeInStructureAddEditView.entityTitle")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <AutocompleteCustom
                      value={store.employee_id}
                      onChange={(event) => store.handleChange(event)}
                      name="employee_id"
                      disabled={store.id > 0}
                      data={store.Employees}
                      id="id_f_employee_id"
                      label={translate("label:EmployeeInStructureAddEditView.employee_id")}
                      helperText={store.erroremployee_id}
                      error={!!store.erroremployee_id}
                      fieldNameDisplay={(employee) => `${employee.last_name} ${employee.first_name} ${employee.second_name}`}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_start ? dayjs(store.date_start) : null}
                      onChange={(event) => store.handleChange(event)}
                      name="date_start"
                      id="id_f_date_start"
                      label={translate("label:EmployeeInStructureAddEditView.date_start")}
                      helperText={store.errordate_start}
                      error={!!store.errordate_start}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_end ? dayjs(store.date_end) : null}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                      id="id_f_date_end"
                      label={translate("label:EmployeeInStructureAddEditView.date_end")}
                      helperText={store.errordate_end}
                      error={!!store.errordate_end}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.post_id}
                      onChange={(event) => store.handleChange(event)}
                      name="post_id"
                      data={store.StructurePost}
                      id="id_f_post_id"
                      label={translate("label:EmployeeInStructureAddEditView.post_id")}
                      helperText={store.errorpost_id}
                      error={!!store.errorpost_id}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
});


export default BaseView;
