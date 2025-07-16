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
import CustomTextField from "components/TextField";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>
      <Grid container>

        <form id="ApplicationInvoiceForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ApplicationInvoice_TitleName">
                  {translate('label:ApplicationInvoiceAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorsum}
                      error={store.errorsum !== ''}
                      id='id_f_ApplicationInvoice_sum'
                      label={translate('label:ApplicationInvoiceAddEditView.sum')}
                      value={store.sum}
                      onChange={(event) => store.handleChange(event)}
                      name="sum"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errornds}
                      error={store.errornds !== ''}
                      id='id_f_ApplicationInvoice_nds'
                      label={translate('label:ApplicationInvoiceAddEditView.nds')}
                      value={store.nds}
                      onChange={(event) => store.handleChange(event)}
                      name="nds"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errornsp}
                      error={store.errornsp !== ''}
                      id='id_f_ApplicationInvoice_nsp'
                      label={translate('label:ApplicationInvoiceAddEditView.nsp')}
                      value={store.nsp}
                      onChange={(event) => store.handleChange(event)}
                      name="nsp"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordiscount}
                      error={store.errordiscount !== ''}
                      id='id_f_ApplicationInvoice_discount'
                      label={translate('label:ApplicationInvoiceAddEditView.discount')}
                      value={store.discount}
                      onChange={(event) => store.handleChange(event)}
                      name="discount"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errortotal_sum}
                      error={store.errortotal_sum !== ''}
                      id='id_f_ApplicationInvoice_total_sum'
                      label={translate('label:ApplicationInvoiceAddEditView.total_sum')}
                      value={store.total_sum}
                      onChange={(event) => store.handleChange(event)}
                      name="total_sum"
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
})


export default BaseView;
