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

type CustomSvgIconTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseCustomSvgIconView: FC<CustomSvgIconTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="CustomSvgIconForm" id="CustomSvgIconForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="CustomSvgIcon_TitleName">
                  {translate('label:CustomSvgIconAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_CustomSvgIcon_name"
                      id='id_f_CustomSvgIcon_name'
                      label={translate('label:CustomSvgIconAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.svgPath}
                      onChange={(event) => store.handleChange(event)}
                      name="svgPath"
                      data-testid="id_f_CustomSvgIcon_svgPath"
                      id='id_f_CustomSvgIcon_svgPath'
                      label={translate('label:CustomSvgIconAddEditView.svgPath')}
                      helperText={store.errors.svgPath}
                      error={!!store.errors.svgPath}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.usedTables}
                      onChange={(event) => store.handleChange(event)}
                      name="usedTables"
                      data-testid="id_f_CustomSvgIcon_usedTables"
                      id='id_f_CustomSvgIcon_usedTables'
                      label={translate('label:CustomSvgIconAddEditView.usedTables')}
                      helperText={store.errors.usedTables}
                      error={!!store.errors.usedTables}
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

export default BaseCustomSvgIconView;
