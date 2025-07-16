import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import Ckeditor from "../../../components/ckeditor/ckeditor";
import LookUp from "../../../components/LookUp";
import store from "../ApplicationWorkDocumentAddEditView/store";
import CustomTextField from "../../../components/TextField";
import Divider from "@mui/material/Divider";

type PopupFormProps = {
  openPanel: boolean;
  id?: number;
  idMain?: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
  isShowDocumentType?: boolean;
}

const StructureTemplatesPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.task_id = props.idMain
      store.loadStructureTemplatess();
      store.loadLanguages();
      store.doLoad(0)
    } else {
      store.clearStore()
    }
  }, [props.openPanel]);

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="md" fullWidth>
      <DialogTitle>{translate("label:StructureTemplatesAddEditView.entityTitle")}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* <Grid item md={6} xs={6}>
            <LookUp
              value={store.template_id}
              onChange={(event) => {
                store.handleChange(event);
                store.loadS_DocumentTemplateTranslations();
              }}
              name="template_id"
              data={store.Templates}
              id="template_id"
              label={translate("label:StructureTemplatesAddEditView.template_id")}
              error={!!store.errors.template_id}
              helperText={store.errors.template_id}
            />
          </Grid>
          <Grid item md={6} xs={6}>
            <LookUp
              value={store.language_id}
              onChange={(event) => {
                store.handleChange(event);
                store.document_body = store.DocumentTemplates.find(d => d.idLanguage == store.language_id)?.template;
              }}
              name="language_id"
              data={store.Languages}
              id="language_id"
              label={translate("label:StructureTemplatesAddEditView.language_id")}
              error={!!store.errors.language_id}
              helperText={store.errors.language_id}
            />
          </Grid> */}
          <Divider />
          <Grid item md={12} xs={12}>
            <CustomTextField
              value={store.document_name}
              onChange={(event) => store.handleChange(event)}
              name="document_name"
              multiline
              id="document_name"
              label={translate("label:ApplicationWorkDocumentAddEditView.document_name")}
              helperText={store.errors.document_name}
              error={!!store.errors.document_name}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <CustomTextField
              value={store.comment}
              onChange={(event) => store.handleChange(event)}
              name="comment"
              multiline
              id="comment"
              label={translate("label:ApplicationWorkDocumentAddEditView.comment")}
              helperText={store.errors.comment}
              error={!!store.errors.comment}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <LookUp
              value={store.id_type}
              onChange={(event) => {
                store.handleChange(event);
                store.metadata = JSON.parse(store.DocumentTypes.find(t => t.id == event.target.value)?.metadata);
              }}
              name="id_type"
              data={store.DocumentTypes}
              id="id_type"
              label={translate("Тип документа")}
              error={!!store.errors.id_type}
              helperText={store.errors.id_type}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Ckeditor
              value={store.document_body ?? ''}
              onChange={(event) => {
                store.document_body = event.target.value;
              }}
              name={`template_`}
              id={`id_f_S_DocumentTemplateTranslation_template_`}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_StructureTemplatesSaveButton"
            name={"StructureTemplatesAddEditView.save"}
            onClick={() => {
              if(store.document_name == "" || !store.document_name){
                store.errors.document_name = "Обязательное поле"
                return
              }else{
                store.errors.document_name = ""
                store.onSaveTemplateClick((id: number) => props.onSaveClick(id))
              }
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_StructureTemplatesCancelButton"
            color={"secondary"}
            sx={{ color: "white", backgroundColor: "#DE350B !important" }}
            name={"StructureTemplatesAddEditView.cancel"}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
});

export default StructureTemplatesPopupForm;
