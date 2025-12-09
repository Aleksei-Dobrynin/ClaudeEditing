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
// import ApplicationWorkDocumentListView from "../../ApplicationWorkDocument/ApplicationWorkDocumentListView";
import FastInputapplication_subtaskView from 'features/application_subtask/application_subtaskAddEditView/fastInput';
import Contragent_interactionListView from "features/contragent_interaction/contragent_interaction_taskListView";
import dayjs from 'dayjs';
import ApplacationCard from "features/Application/ApplicationCardViev"


type application_taskTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baseapplication_taskView: FC<application_taskTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl'>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        <StyledRouterLink to={`/user/application/addedit?id=${store.application_id}`}>
          <Typography sx={{ fontSize: '16px' }}>Заявка №{store.application_number}</Typography>
        </StyledRouterLink>
        <Typography sx={{ color: 'text.primary', fontSize: '16px' }}>{store.name}</Typography>
      </Breadcrumbs>

      {store.id > 0 && store.task_statuses.map(x => {
        return <CustomButton disabled={store.status_id === x.id} variant="contained" sx={{ mr: 1, mb: 1 }} onClick={() => store.changeStatus(x.id)}>
          {x.name}
        </CustomButton>
      })}
      <Grid sx={{ alignItems: "stretch" }} container spacing={2}>
        <Grid item md={props.isPopup ? 6 : 6}>
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
                  <Grid container >

                    <Grid container spacing={3} md={6} xs={6}>

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


                    {/* <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_required}
                      onChange={(event) => store.handleChange(event)}
                      name="is_required"
                      label={translate('label:application_taskAddEditView.is_required')}
                      id='id_f_application_task_is_required'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.order}
                      onChange={(event) => store.handleChange(event)}
                      name="order"
                      data-testid="id_f_application_task_order"
                      id='id_f_application_task_order'
                      type="number"
                      label={translate('label:application_taskAddEditView.order')}
                      helperText={store.errors.order}
                      error={!!store.errors.order}
                    />
                  </Grid> */}
                      {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.progress}
                      onChange={(event) => store.handleChange(event)}
                      name="progress"
                      data-testid="id_f_application_task_progress"
                      type="number"
                      id='id_f_application_task_progress'
                      label={translate('label:application_taskAddEditView.progress')}
                      helperText={store.errors.progress}
                      error={!!store.errors.progress}
                    />
                  </Grid> */}
                    </Grid>
                    <Grid container md={6} xs={6}>
                      {store.application_id > 0 && <ApplacationCard
                        id_application={store.application_id}
                      />}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </form>
          </Box>
        </Grid>
        <Grid container item md={6} spacing={2}>
          <Grid item md={12}>
            {store.id > 0 && <FastInputapplication_task_assigneeView idMain={store.id} />}
          </Grid>
          <Grid item md={12}>
            {store.id > 0 && <FastInputapplication_subtaskView idMain={store.id} application_id={store.application_id} />}
          </Grid>
        </Grid>
        {/* <Grid item md={12}>
          {store.id > 0 && <ApplicationWorkDocumentListView idTask={store.id} />}
        </Grid> */}
        <Grid item md={12}>
          {store.id > 0 && <Contragent_interactionListView task_id={store.id} application_id={store.application_id} />}
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

export default Baseapplication_taskView;
