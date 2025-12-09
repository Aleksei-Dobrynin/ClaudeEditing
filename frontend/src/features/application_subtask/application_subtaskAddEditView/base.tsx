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


type application_subtaskTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baseapplication_subtaskView: FC<application_subtaskTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 1 }}>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        <StyledRouterLink to={`/user/application/addedit?id=${store.application_id}`}>
          <Typography sx={{ fontSize: '16px' }}>Заявка №{store.application_number}</Typography>
        </StyledRouterLink>
        <StyledRouterLink to={`/user/application_task/addedit?id=${store.application_task_id}`}>
          <Typography sx={{ fontSize: '16px' }}>{store.application_task_name}</Typography>
        </StyledRouterLink>
        <Typography sx={{ color: 'text.primary', fontSize: '16px' }}>{store.name}</Typography>
      </Breadcrumbs>

      {store.id > 0 && store.task_statuses.map(x => {
        return <CustomButton disabled={store.status_id === x.id} variant="contained" sx={{ mr: 1, mb: 1 }} onClick={() => store.changeStatus(store.id, x.id)}>
          {x.name}
        </CustomButton>
      })}

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
                <Grid container >

                  <Grid container spacing={3} md={6} xs={6}>
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
                        rows={5}
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
        </Grid>
        <Grid item md={5}>
          {store.id > 0 && <FastInputapplication_subtask_assigneeView idMain={store.id} />}
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
