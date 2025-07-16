import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box, Typography, Chip, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

type application_taskProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  task_id: number;
  onAddTaskClicked: () => void;
};

const OtherTasksFastInputView: FC<application_taskProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const translate = t;

  useEffect(() => {
    if (props.task_id !== 0 && storeList.task_id !== props.task_id) {
      storeList.task_id = props.task_id;
      storeList.loadapplication_tasks();
    }
  }, [props.task_id]);

  useEffect(() => {
    return () => storeList.clearStore()
  }, []);

  const columns = [
    {
      field: 'name',
      width: 5, //or number from 1 to 12
      headerName: translate("label:application_taskAddEditView.name"),
      renderCell: (field) => <StyledRouterLink href={`/user/application_task/addedit?id=${field.entity.id}`}>{field.value} </StyledRouterLink>
    },
    {
      field: 'structure_idNavName',
      width: 4, //or number from 1 to 12
      headerName: translate("label:application_taskAddEditView.structure_id"),
    },
    {
      field: 'status_idNavName',
      width: 2, //or number from 1 to 12
      headerName: translate("label:application_taskAddEditView.status_id"),
      renderCell: (field) => <Chip size="small" label={field.value} style={{ background: field.entity.status_back_color, color: field.entity.status_text_color }} />
    },
  ];

  return (
    <Paper elevation={7} variant="outlined" sx={{ mt: 2 }}>
      <Card>
        <CardContent>
          <Box id="application_task_TitleName" sx={{ m: 1 }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
              {translate("label:application_taskAddEditView.otherTasks")}
            </Typography>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_EmployeeContact_" + col.field;
              if (col.width == null) {
                return (
                  <Grid id={id} item xs>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
              } else
                return (
                  <Grid id={id} item xs={col.width} sx={{ mt: 1, mb: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
            })}
            {/* <Grid item xs={1}></Grid> */}
          </Grid>
          <Divider />

          {storeList.data.map((entity) => {
            return (
              <>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                  id="id_EmployeeContact_row"
                >
                  {columns.map((col) => {
                    const id = "id_EmployeeContact_" + col.field + "_value";
                    if (col.width == null) {
                      if (col.renderCell == null) {
                        return (
                          <Grid key={id} item xs id={id} sx={{ mt: 1, mb: 1 }}>
                            {entity[col.field]}
                          </Grid>
                        );
                      } else {
                        return (
                          <Grid key={id} item xs id={id} sx={{ mt: 1, mb: 1 }}>
                            {col.renderCell({ value: entity[col.field], entity })}
                          </Grid>
                        );
                      }
                    } else
                      if (col.renderCell == null) {
                        return (
                          <Grid key={id} item xs={col.width} id={id} sx={{ mt: 1, mb: 1 }}>
                            {entity[col.field]}
                          </Grid>
                        );
                      } else {
                        return (
                          <Grid key={id} item xs={col.width} id={id} sx={{ mt: 1, mb: 1 }}>
                            {col.renderCell({ value: entity[col.field], entity })}
                          </Grid>
                        );
                      }
                  })}
                </Grid >
                <Divider />
              </>
            );
          })}

          <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
            <CustomButton
              variant="contained"
              size="small"
              id="id_application_taskAddButton"
              onClick={() => {
                props.onAddTaskClicked()
              }}
            >
              {translate("common:add")}
            </CustomButton>
          </Grid>

        </CardContent>
      </Card>
    </Paper >
  );
});

const StyledRouterLink = styled.a`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`

export default OtherTasksFastInputView;
