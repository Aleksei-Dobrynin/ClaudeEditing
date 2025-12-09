import { FC, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react";
import store from "./store";
import Contragent_interaction_docAddEditBaseView from './base';
import CustomButton from 'components/Button';
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

type PopupFormProps = {
  openPanel: boolean;
  currentId: number;
  idMain: number;
  existingDocuments: any[];
  onBtnCancelClick: () => void;
  onSaveClick: () => void;
  onDeleteDocument: (id: number) => void;
  onDownloadFile: (fileId: number, fileName: string) => void;
};

const Contragent_interaction_docPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      // Передаем idMain как interactionId в doLoad
      store.doLoad(props.currentId, props.idMain);
    }
  }, [props.openPanel, props.idMain, props.currentId]);

  const handleSave = () => {
    store.onSaveClick(() => {
      // После успешного сохранения вызываем колбэк родителя
      props.onSaveClick();
    });
  };

  const handleCancel = () => {
    props.onBtnCancelClick();
  };

  const columns = [
    {
      field: 'file_name',
      headerName: translate("label:contragent_interaction_docListView.file_id"),
    },
  ];

  return (
    <Dialog
      open={props.openPanel}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {store.id === 0
          ? translate('label:contragent_interaction_docAddEditView.addNewDocument')
          : translate('label:contragent_interaction_docAddEditView.entityTitle')
        }
      </DialogTitle>

      <DialogContent>


        {/* Форма добавления/редактирования документа */}
        <Box>
          {store.id === 0 && (
            <Box sx={{ mb: 2 }}>
              <strong>{translate('label:contragent_interaction_docAddEditView.addNewDocument')}</strong>
            </Box>
          )}
          <Contragent_interaction_docAddEditBaseView isPopup={true} />
        </Box>
      </DialogContent>

      <DialogActions>
        <CustomButton
          variant="contained"
          id="id_contragent_interaction_docSaveButton"
          name="contragent_interaction_docAddEditView.save"
          onClick={handleSave}
        >
          {translate("common:save")}
        </CustomButton>
        <CustomButton
          variant="contained"
          id="id_contragent_interaction_docCancelButton"
          name="contragent_interaction_docAddEditView.cancel"
          onClick={handleCancel}
        >
          {translate("common:cancel")}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
});

export default Contragent_interaction_docPopupForm;