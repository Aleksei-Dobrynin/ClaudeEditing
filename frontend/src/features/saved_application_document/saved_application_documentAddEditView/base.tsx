import React, { FC } from "react";
import dayjs from 'dayjs';
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
import Ckeditor from "components/ckeditor/ckeditor";
import RichTextEditor from "components/richtexteditor/RichTextWithTabs";

type saved_application_documentTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basesaved_application_documentView: FC<saved_application_documentTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <form data-testid="saved_application_documentForm" id="saved_application_documentForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <div>
                <CardHeader title={
                  <span id="saved_application_document_TitleName">
                    {translate('label:saved_application_documentAddEditView.entityTitle')}
                  </span>
                } />
                {store.created_by == null ?
                  <span style={{ marginLeft: '20px', marginBottom: "20px" }}>Дата создания документа отсутствует</span>
                  :
                  <div style={{ marginBottom: "10px" }}>
                    <span style={{ marginLeft: '20px' }}>Документ обновлен: {dayjs(store.updated_at).format('DD-MM-YYYY HH:mm')}</span>
                    <span style={{ marginLeft: '60px' }}>Сотрудник обновивший документ: {store.updated_by_name}</span>
                  </div>

                }
              </div>
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <RichTextEditor
                      id={"RichTextEditorDocument"}
                      name={"body"}
                      value={store.body}
                      changeValue={(value, name) => store.handleChange({ target: { value: value, name: "body" } })}
                      minHeight={500}
                    />
                    {/* <Ckeditor
                      value={store.body}
                      onChange={(event) => store.handleChange(event)}
                      name="body"
                      withoutPlaceholder
                      data-testid="id_f_saved_application_document_body"
                      id='id_f_saved_application_document_body'
                    /> */}
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

export default Basesaved_application_documentView;
