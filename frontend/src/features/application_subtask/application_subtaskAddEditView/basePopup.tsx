import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import CustomButton from "components/Button";
import styled from "styled-components";
import FastInputapplication_subtask_assigneeView from "features/application_subtask_assignee/application_subtask_assigneeAddEditView/fastInput";
import ApplacationCard from "features/Application/ApplicationCardViev"
import CreateIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import AutocompleteCustom from "components/Autocomplete";


type application_subtaskTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baseapplication_subtaskView: FC<application_subtaskTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 1 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="application_subtaskForm" id="application_subtaskForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="application_subtask_TitleName">
                  {translate('label:application_subtaskAddEditView.entityTitleOne')}
                </span>
              } />
              <Divider />
              <CardContent>

                <Grid container spacing={3} md={12} xs={12}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_application_subtask_name"
                      id='id_f_application_subtask_name'
                      label={translate('label:application_subtaskAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      rows={3}
                      multiline
                      data-testid="id_f_application_subtask_description"
                      id='id_f_application_subtask_description'
                      label={translate('label:application_subtaskAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="type_id"
                      data={store.task_types}
                      id='id_f_application_task_type_id'
                      label={translate('label:application_taskAddEditView.type_id')}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {`${translate("Исполнители")}: `}
                    </Typography>
                    {store.assignees.map(x => <Chip key={x.id} label={x.employee_name} onDelete={() => store.deleteAssign(x.id)} />)}

                    {store.addAssignePopup ? <Box display={"flex"} alignItems={"center"} sx={{ m: 2 }}>
                      <Box sx={{ width: "500px" }}>
                        <AutocompleteCustom
                          value={store.structure_employee_id}
                          onChange={(event) => store.handleChange(event)}
                          name="structure_employee_id"
                          data={store.employeeInStructure}
                          fieldNameDisplay={(field) => field.employee_name + " - " + field.post_name}
                          data-testid="id_f_application_task_assignee_structure_employee_id"
                          id='id_f_application_task_assignee_structure_employee_id'
                          label={translate('label:application_task_assigneeAddEditView.structure_employee_id')}
                          helperText={store.errors.structure_employee_id}
                          error={!!store.errors.structure_employee_id}
                        />
                      </Box>
                      <Tooltip title="Сохранить">
                        <IconButton onClick={() => store.onAddAssigneeDoneClick()}>
                          <DoneIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Отменить">
                        <IconButton onClick={() => store.onAddAssigneeCancelClick()}>
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                      :
                      <Tooltip title="Добавить исполнителья">
                        <IconButton onClick={() => store.onAddAssign()}>
                          <CreateIcon />
                        </IconButton>
                      </Tooltip>}





                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})

const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`


export default Baseapplication_subtaskView;
