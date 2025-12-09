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

type faq_questionTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basefaq_questionView: FC<faq_questionTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="faq_questionForm" id="faq_questionForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="faq_question_TitleName">
                  {translate('label:faq_questionAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.title}
                      onChange={(event) => store.handleChange(event)}
                      name="title"
                      data-testid="id_f_faq_question_title"
                      id='id_f_faq_question_title'
                      label={translate('label:faq_questionAddEditView.title')}
                      helperText={store.errors.title}
                      error={!!store.errors.title}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.answer}
                      onChange={(event) => store.handleChange(event)}
                      name="answer"
                      data-testid="id_f_faq_question_answer"
                      id='id_f_faq_question_answer'
                      label={translate('label:faq_questionAddEditView.answer')}
                      helperText={store.errors.answer}
                      error={!!store.errors.answer}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.video}
                      onChange={(event) => store.handleChange(event)}
                      name="video"
                      data-testid="id_f_faq_question_video"
                      id='id_f_faq_question_video'
                      label={translate('label:faq_questionAddEditView.video')}
                      helperText={store.errors.video}
                      error={!!store.errors.video}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_visible}
                      onChange={(event) => store.handleChange(event)}
                      name="is_visible"
                      label={translate('label:faq_questionAddEditView.is_visible')}
                      id='id_f_faq_question_is_visible'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.settings}
                      onChange={(event) => store.handleChange(event)}
                      name="settings"
                      data-testid="id_f_faq_question_settings"
                      id='id_f_faq_question_settings'
                      label={translate('label:faq_questionAddEditView.settings')}
                      helperText={store.errors.settings}
                      error={!!store.errors.settings}
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

export default Basefaq_questionView;
