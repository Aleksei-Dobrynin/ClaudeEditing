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

type document_approverTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Basedocument_approverView: FC<document_approverTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="document_approverForm" id="document_approverForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="document_approver_TitleName">
                  {translate('label:document_approverAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.department_id}
                      onChange={(event) => store.handleChange(event)}
                      name="department_id"
                      data={store.org_structures}
                      id='id_f_document_approver_department_id'
                      label={translate('label:document_approverAddEditView.department_id')}
                      helperText={store.errors.department_id}
                      error={!!store.errors.department_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.position_id}
                      onChange={(event) => store.handleChange(event)}
                      name="position_id"
                      data={store.structure_posts}
                      id='id_f_document_approver_position_id'
                      label={translate('label:document_approverAddEditView.position_id')}
                      helperText={store.errors.position_id}
                      error={!!store.errors.position_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_required}
                      onChange={(event) => store.handleChange(event)}
                      name="is_required"
                      label={translate('label:document_approverAddEditView.is_required')}
                      id='id_f_document_approver_is_required'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.approval_order}
                      onChange={(event) => store.handleChange(event)}
                      name="approval_order"
                      data-testid="id_f_document_approver_approval_order"
                      id='id_f_document_approver_approval_order'
                      label={translate('label:document_approverAddEditView.approval_order')}
                      helperText={store.errors.approval_order}
                      error={!!store.errors.approval_order}
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

export default Basedocument_approverView;
