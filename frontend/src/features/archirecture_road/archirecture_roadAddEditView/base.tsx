import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type archirecture_roadTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basearchirecture_roadView: FC<archirecture_roadTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="archirecture_roadForm" id="archirecture_roadForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="archirecture_road_TitleName">
                  {translate('label:archirecture_roadAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.from_status_id}
                      onChange={(event) => store.handleChange(event)}
                      name="from_status_id"
                      data={store.architecture_statuses}
                      id='id_f_archirecture_road_from_status_id'
                      label={translate('label:archirecture_roadAddEditView.from_status_id')}
                      helperText={store.errors.from_status_id}
                      error={!!store.errors.from_status_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.to_status_id}
                      onChange={(event) => store.handleChange(event)}
                      name="to_status_id"
                      data={store.architecture_statuses}
                      id='id_f_archirecture_road_to_status_id'
                      label={translate('label:archirecture_roadAddEditView.to_status_id')}
                      helperText={store.errors.to_status_id}
                      error={!!store.errors.to_status_id}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                      label={translate('label:archirecture_roadAddEditView.is_active')}
                      id='id_f_archirecture_road_is_active'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rule_expression}
                      onChange={(event) => store.handleChange(event)}
                      name="rule_expression"
                      data-testid="id_f_archirecture_road_rule_expression"
                      id='id_f_archirecture_road_rule_expression'
                      label={translate('label:archirecture_roadAddEditView.rule_expression')}
                      helperText={store.errors.rule_expression}
                      error={!!store.errors.rule_expression}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_archirecture_road_description"
                      id='id_f_archirecture_road_description'
                      label={translate('label:archirecture_roadAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.validation_url}
                      onChange={(event) => store.handleChange(event)}
                      name="validation_url"
                      data-testid="id_f_archirecture_road_validation_url"
                      id='id_f_archirecture_road_validation_url'
                      label={translate('label:archirecture_roadAddEditView.validation_url')}
                      helperText={store.errors.validation_url}
                      error={!!store.errors.validation_url}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.post_function_url}
                      onChange={(event) => store.handleChange(event)}
                      name="post_function_url"
                      data-testid="id_f_archirecture_road_post_function_url"
                      id='id_f_archirecture_road_post_function_url'
                      label={translate('label:archirecture_roadAddEditView.post_function_url')}
                      helperText={store.errors.post_function_url}
                      error={!!store.errors.post_function_url}
                    />
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

export default Basearchirecture_roadView;
