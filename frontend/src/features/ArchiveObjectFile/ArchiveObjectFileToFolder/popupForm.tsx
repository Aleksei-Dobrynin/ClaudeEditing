import { FC, useEffect } from 'react';
import ArchiveObjectFileAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import PopupFormAddFolder from "features/archive_folder/archive_folderAddEditView/popupForm"

type PopupFormProps = {
  openPanel: boolean;
  fileIds: number[];
  object_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const PopupFormToFolder: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.object_id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth={"sm"} fullWidth>
      <DialogTitle>{translate('label:ArchiveObjectFileAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <PopupFormAddFolder
          openPanel={store.openAddFolder}
          object_id={props.object_id}
          id={0}
          onBtnCancelClick={() => {
            store.openAddFolder = false;
          }}
          onSaveClick={async (id) => {
            store.loadArchiveFolders().then(x => {
              store.openAddFolder = false;
              store.handleChange({
                target: { name: "archive_folder_id", value: id }
              });
            });
          }}
        />
        <ArchiveObjectFileAddEditBaseView
          isPopup={true}
        >
        </ArchiveObjectFileAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            disabled={store.archive_folder_id == null || store.archive_folder_id == 0}
            id="id_ArchiveObjectFileSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id), props.fileIds)
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_ArchiveObjectFileCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default PopupFormToFolder
