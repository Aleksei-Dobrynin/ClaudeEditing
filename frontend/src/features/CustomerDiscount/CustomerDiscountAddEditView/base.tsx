import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container, IconButton, Box
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import CustomTextField from "components/TextField";
import AutocompleteCustomer from "./AutocompleteCustomer";
import CloseIcon from "@mui/icons-material/Close";

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

        <form id="CustomerDiscountForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="CustomerDiscount_TitleName">
                  {translate('label:CustomerDiscountAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AutocompleteCustomer />
                      <IconButton sx={{ ml: 1 }} onClick={() => {
                        store.customer_id = 0;
                      }}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription != ''}
                      id='id_f_CustomerDiscount_description'
                      label={translate('label:CustomerDiscountAddEditView.description')}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
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
