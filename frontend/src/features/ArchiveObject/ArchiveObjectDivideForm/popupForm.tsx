import { FC, useEffect } from 'react';
import ArchiveObjectAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import PickFilesToDivideForm from './PickFilesToDivide';
import { useNavigate } from 'react-router-dom';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (ids: number[]) => void;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth={"lg"} fullWidth>
      <DialogTitle>{translate('label:ArchiveObjectAddEditView.entityTitle')} - Разделение объекта</DialogTitle>
      <DialogContent>
        <ArchiveObjectAddEditBaseView
          isPopup={true}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton
          variant="contained"
          id="id_ArchiveObjectSaveButton"
          onClick={() => {
            store.onSaveClick((ids: number[]) => {
              // Переход к первому созданному объекту или показ списка
              if (ids && ids.length > 0) {
                // Можно перейти к первому объекту
                navigate(`/user/ArchiveObject/addedit?id=${ids[0]}`);
                window.location.reload();
                
                // Или показать уведомление о количестве созданных объектов
                // MainStore.setSnackbar(`Создано объектов: ${ids.length}`, "success");
              }
              props.onBtnCancelClick(); // Закрыть диалог
            })
          }}
        >
          {translate("common:save")}
        </CustomButton>
        <CustomButton
          variant="contained"
          id="id_ArchiveObjectCancelButton"
          onClick={() => props.onBtnCancelClick()}
        >
          {translate("common:cancel")}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
})

export default PopupForm