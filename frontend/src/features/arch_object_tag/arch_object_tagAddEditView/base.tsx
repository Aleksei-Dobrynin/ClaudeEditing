import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Typography,
  Container,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import MtmLookup from "components/mtmLookup";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import InfoIcon from '@mui/icons-material/Info';

type arch_object_tagTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Arch_object_tagAddEditBaseView: FC<arch_object_tagTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="arch_object_tagForm" id="arch_object_tagForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="arch_object_tag_TitleName">
                  {translate('label:arch_object_tagAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <MtmLookup
                      value={store.id_tag}
                      // onChange={(event) => store.changeTags(event)}
                      onChange={(name, value) => store.changeTags(value)}
                      name="type_id"
                      data={store.tags}
                      label={translate("label:arch_object_tagAddEditView.type_id")}
                    />
                  </Grid>


                  {store.id_object > 0 && <Grid item md={12} xs={12}>

                    <Stack direction="row" alignItems="center" gap={1}>
                      <InfoIcon />
                      <Typography variant="body1">{store.tags.find(x => x.id == store.id_tag)?.description}</Typography>
                    </Stack>

                  </Grid>
                  }
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

export default Arch_object_tagAddEditBaseView;
