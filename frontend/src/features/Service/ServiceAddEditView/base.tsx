import React, { FC } from "react";
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store";
import { observer } from "mobx-react";
import TextField from "components/TextField";
import SelectField from "components/SelectField";
import CustomCheckbox from "components/Checkbox";
import DateField from "components/DateField";
import FormSection from "components/FormSection";
import FormFieldGroup from "components/FormFieldGroup";

type ServiceAddEditBaseViewProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ServiceAddEditBaseViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Box sx={{ width: '100%' }}>
      <FormSection 
        title={!props.isPopup ? translate('label:ServiceAddEditView.entityTitle') : undefined}
        elevated={!props.isPopup}
      >
        {/* Основная информация */}
        <FormFieldGroup columns={2}>
          <TextField
            id='id_f_Service_name'
            name="name"
            label={translate('label:ServiceAddEditView.name')}
            value={store.name}
            onChange={(event) => store.handleChange(event)}
            error={!!store.errorname}
            helperText={store.errorname}
            required
            showCharacterCount
            maxLength={255}
          />
          
          <TextField
            id='id_f_Service_short_name'
            name="short_name"
            label={translate('label:ServiceAddEditView.short_name')}
            value={store.short_name}
            onChange={(event) => store.handleChange(event)}
            error={!!store.errorshort_name}
            helperText={store.errorshort_name}
            showCharacterCount
            maxLength={100}
          />
        </FormFieldGroup>

        <FormFieldGroup columns={2}>
          <TextField
            id='id_f_Service_code'
            name="code"
            label={translate('label:ServiceAddEditView.code')}
            value={store.code}
            onChange={(event) => store.handleChange(event)}
            error={!!store.errorcode}
            helperText={store.errorcode}
            showCharacterCount
            maxLength={50}
          />
          
          <CustomCheckbox
            value={store.is_active}
            onChange={(event) => store.handleChange(event)}
            name="is_active"
            label={translate('label:ServiceAddEditView.is_active')}
            id='id_f_ServiceAddEditView_is_active'
          />
        </FormFieldGroup>

        <TextField
          id='id_f_Service_description'
          name="description"
          label={translate('label:ServiceAddEditView.description')}
          value={store.description}
          onChange={(event) => store.handleChange(event)}
          error={!!store.errordescription}
          helperText={store.errordescription}
          multiline
          rows={4}
          showCharacterCount
          maxLength={1000}
        />

        {/* Параметры услуги */}
        <Box mt={3} mb={2}>
          <FormFieldGroup columns={2}>
            <TextField
              id='id_f_Service_day_count'
              name="day_count"
              label={translate('label:ServiceAddEditView.day_count')}
              value={store.day_count}
              onChange={(event) => store.handleChange(event)}
              error={!!store.errorday_count}
              helperText={store.errorday_count}
              type="number"
              required
            />
            
            <TextField
              id='id_f_Service_price'
              name="price"
              label={translate('label:ServiceAddEditView.price')}
              value={store.price}
              onChange={(event) => store.handleChange(event)}
              error={!!store.errorprice}
              helperText={store.errorprice}
              type="number"
            />
          </FormFieldGroup>
        </Box>

        {/* Связанные справочники */}
        <Box mt={3} mb={2}>
          <FormFieldGroup columns={{ xs: 1, md: 3 }}>
            <SelectField
              id='id_f_Service_workflow_id'
              name="workflow_id"
              label={translate('label:ServiceAddEditView.workflow_id')}
              value={store.workflow_id}
              onChange={(event) => store.handleChange(event)}
              options={store.Workflows.map(item => ({
                value: item.id,
                label: item.name
              }))}
              error={!!store.errorworkflow_id}
              helperText={store.errorworkflow_id}
              searchable
              clearable
              required
              placeholder={translate('')}
            />
            
            <SelectField
              id='id_f_Service_law_document_id'
              name="law_document_id"
              label={translate('label:ServiceAddEditView.law_document_id')}
              value={store.law_document_id}
              onChange={(event) => store.handleChange(event)}
              options={store.LawDocuments.map(item => ({
                value: item.id,
                label: item.name
              }))}
              error={!!store.errorlaw_document_id}
              helperText={store.errorlaw_document_id}
              searchable
              clearable
              required
              placeholder={translate('')}
            />
            
            <SelectField
              id='id_f_Service_id_structure'
              name="structure_id"
              label={translate('label:ServiceAddEditView.structure_id')}
              value={store.structure_id}
              onChange={(event) => store.handleChange(event)}
              options={store.Structures.map(item => ({
                value: item.id,
                label: item.name
              }))}
              error={!!store.errorstructure_id}
              helperText={store.errorstructure_id}
              searchable
              clearable
              required
              placeholder={translate('')}
            />
          </FormFieldGroup>
        </Box>

        {/* Даты */}
        <Box mt={3}>
          <FormFieldGroup columns={2}>
            <DateField
              id="id_f_ServiceAddEditView_date_start"
              name="date_start"
              label={translate("label:ServiceAddEditView.date_start")}
              value={store.date_start}
              onChange={(event) => store.handleChange(event)}
              error={!!store.errordate_start}
              helperText={store.errordate_start}
              showQuickSelect
              clearable
            />
            
            <DateField
              id="id_f_ServiceAddEditView_date_end"
              name="date_end"
              label={translate("label:ServiceAddEditView.date_end")}
              value={store.date_end}
              onChange={(event) => store.handleChange(event)}
              error={!!store.errordate_end}
              helperText={store.errordate_end}
              minDate={store.date_start}
              showQuickSelect
              clearable
            />
          </FormFieldGroup>
        </Box>
      </FormSection>
      
      {props.children}
    </Box>
  );
});

export default BaseView;