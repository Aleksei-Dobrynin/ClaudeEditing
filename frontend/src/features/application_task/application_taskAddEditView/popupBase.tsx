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
  Box,
  Typography,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import DateField from 'components/DateField';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import TreeLookUp from "components/TreeLookup";
import FastInputapplication_task_assigneeView from "features/application_task_assignee/application_task_assigneeAddEditView/fastInput";
import CustomButton from "components/Button";
import styled from "styled-components";
import FastInputapplication_subtaskView from 'features/application_subtask/application_subtaskAddEditView/fastInput';
import Contragent_interactionListView from "features/contragent_interaction/contragent_interaction_taskListView";
import dayjs from 'dayjs';
import ApplacationCard from "features/Application/ApplicationCardViev"
import FileField from "../../../components/FileField";
import AutocompleteCustom from "components/Autocomplete";
import CreateIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";

type application_taskTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BasePopupapplication_taskView: FC<application_taskTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl'>
      <Grid sx={{ alignItems: "stretch" }} container spacing={2}>
        <Grid item md={12}>
          <Box>
            <form data-testid="application_taskForm" id="application_taskForm" autoComplete='off'>
              <Card component={Paper} elevation={5}>
                <CardHeader title={
                  <span id="application_task_TitleName">
                    {translate('label:application_taskAddEditView.entityTitleOne')}
                  </span>
                } />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>


                    <Grid item md={12} xs={12}>
                      <CustomTextField
                        value={store.name}
                        onChange={(event) => store.handleChange(event)}
                        name="name"
                        data-testid="id_f_application_task_name"
                        id='id_f_application_task_name'
                        label={translate('label:application_taskAddEditView.name')}
                        helperText={store.errors.name}
                        error={!!store.errors.name}
                      />
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <TreeLookUp
                        value={store.structure_id}
                        onChange={(event) => {
                          store.handleChange(event)
                          store.setStructureID(event.target.value - 0)
                        }}
                        name="structure_id"
                        data={store.org_structures}

                        id='id_f_application_task_structure_id'
                        label={translate('label:application_taskAddEditView.structure_id')}
                      />
                      {!!store.errors.structure_id &&
                        <span style={{
                          color: "#f44336",
                          fontSize: "0.75rem",
                          marginLeft: 15,
                          fontFamily: "Roboto",
                          fontWeight: 400
                        }}>{store.errors.structure_id}</span>}
                    </Grid>

                    {store.id > 0 ? "" : <Grid item md={12} xs={12}>
                      <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {`${translate("Исполнители")}: `}
                      </Typography>
                      {store.assignees.map(x => <Chip key={x.id} label={x.employee_name} onDelete={() => store.deleteAssign(x.id)} />)}

                      {store.addAssignePopup ? <Box display={"flex"} alignItems={"center"} sx={{ mt: 2 }}>
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
                        {/* <Tooltip title="Сохранить">
                          <IconButton onClick={() => store.onAddAssigneeDoneClick()}>
                            <DoneIcon />
                          </IconButton>
                        </Tooltip> */}
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
                    </Grid>}

                    <Grid item md={12} xs={12} sx={{ mt: 5 }}>
                      <DateField
                        value={store.deadline != null ? dayjs(new Date(store.deadline)) : null}
                        onChange={(event) => store.handleChange(event)}
                        name="deadline"
                        id="deadline"
                        label={translate("label:application_taskAddEditView.deadline")}
                        helperText={store.errors.deadline}
                        error={!!store.errors.deadline}
                      />
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <CustomTextField
                        value={store.comment}
                        onChange={(event) => store.handleChange(event)}
                        name="comment"
                        multiline
                        rows={5}
                        data-testid="id_f_application_task_comment"
                        id='id_f_application_task_comment'
                        label={translate('label:application_taskAddEditView.comment')}
                        helperText={store.errors.comment}
                        error={!!store.errors.comment}
                      />
                    </Grid>
                    {/* <Grid item md={12} xs={12}>
                      <LookUp
                        value={store.type_id}
                        onChange={(event) => store.handleChange(event)}
                        name="type_id"
                        data={store.task_types}
                        id='id_f_application_task_type_id'
                        label={translate('label:application_taskAddEditView.type_id')}
                      />
                    </Grid> */}

                    <Grid item md={12} xs={12}>
                      <FileField
                        value={store.FileName}
                        helperText={store.errors.FileName}
                        error={!!store.errors.FileName}
                        inputKey={store.idDocumentinputKey}
                        fieldName="FileName"
                        onChange={(event) => {
                          if (event.target.files.length == 0) return
                          store.handleChange({ target: { value: event.target.files[0], name: "File" } })
                          store.handleChange({ target: { value: event.target.files[0].name, name: "FileName" } })
                        }}
                        onClear={() => {
                          store.handleChange({ target: { value: null, name: "File" } })
                          store.handleChange({ target: { value: '', name: "FileName" } })
                          store.changeDocInputKey()
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </form>
          </Box>
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

export default BasePopupapplication_taskView;
