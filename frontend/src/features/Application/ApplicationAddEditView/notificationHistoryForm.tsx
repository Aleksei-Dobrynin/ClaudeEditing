import { FC, useEffect, useState } from "react";
import store from "./store";
import { observer } from "mobx-react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { getnotificationLogsByApplicationId } from "../../../api/notificationLog";
import dayjs from "dayjs";

type HistoryPopupFormProps = {
  openPanel: boolean;
  onBtnCancelClick: () => void;
  onBtnOkClick: () => void;
}

const HistoryPopupForm: FC<HistoryPopupFormProps> = observer((props) => {
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (props.openPanel) {
          const response = await getnotificationLogsByApplicationId(store.id);
          if ((response.status === 201 || response.status === 200) && response?.data) {
            setData(response.data);
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [props.openPanel]);


  return (
    <Dialog maxWidth={"md"} open={props.openPanel} onClose={props.onBtnCancelClick}>

      <DialogContent>
        <h2>{translate("label:ApplicationAddEditView.notify_history")}</h2>
        {data.length > 0 ? <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{translate("Телефон")}</TableCell>
                <TableCell>{translate("label:ApplicationAddEditView.notify_history_type_message")}</TableCell>
                <TableCell>{translate("label:ApplicationAddEditView.notify_history_text_message")}</TableCell>
                <TableCell>{translate("label:ApplicationAddEditView.notify_history_date_message")}</TableCell>
                <TableCell>{translate("Статус")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((x) => (
                <TableRow id={x.id}>
                  <TableCell>{x.phone}</TableCell>
                  <TableCell>{x.type}</TableCell>
                  <TableCell>{x.message}</TableCell>
                  <TableCell>{dayjs(x.created_at).format("DD.MM.YYYY HH:mm")}</TableCell>
                  <TableCell>{x.statusName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> : <h4>{translate("label:ApplicationAddEditView.notify_history_none")}</h4>}

      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_HistoryCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:close")}
          </CustomButton>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
});

export default HistoryPopupForm;
