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
import MtmLookup from "components/mtmLookup";

type archive_file_tagsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basearchive_file_tagsView: FC<archive_file_tagsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="archive_file_tagsForm" id="archive_file_tagsForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                "Тэги"
              } />
              <Divider />
              <CardContent>

                <Grid item md={12} xs={12}>
                  <MtmLookup
                    value={store.tags}
                    onChange={(name, value) => store.changeTags(value)}
                    name="tags"
                    data={store.archive_doc_tags}
                    label={translate("label:arch_object_tagAddEditView.tags")}
                  />
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

export default Basearchive_file_tagsView;
