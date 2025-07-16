import { FC, useEffect, useState } from 'react';
import store from "./store"
import { observer } from "mobx-react"
import { Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import { ContactTypes } from "constants/constant";
import CustomTextField from "components/TextField";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from "@mui/material";
import Ckeditor from "components/ckeditor/ckeditor";
import layoutStore from 'layouts/MainLayout/store'
import MainStore from 'MainStore';


type RejectCabinetFormProps = {
  openPanel: boolean;
  number: string;
  appId: number;
  onBtnCancelClick: () => void;
  onBtnOkClick: () => void;
}

const RejectCabinetForm: FC<RejectCabinetFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  useEffect(() => {
    if (props.openPanel) {
      store.loadIncomingDocuments(props.appId);
    }
  }, [props.openPanel, props.appId]);

  let fullName = layoutStore.last_name + " " + layoutStore.last_name; //TODO

  let fullText = `<h2>
    Уведомление об отказе в рассмотрении заявления
</h2>
<p>
    &nbsp;
</p>
<p>
    Настоящим уведомляем, что Ваше заявление  №${props.number} о не может быть рассмотрено по существу в связи с:
</p>
<ol>
    <li>
        Несоответствием представленных документов требованиям законодательства, а именно:
        <ul>
            <li>
                отсутствием ______________;
            </li>
            <li>
                неполнотой представленных сведений в части _____________;
            </li>
            <li>
                несоответствием формы документа _______________.
            </li>
        </ul>
    </li>
    <li>
        Необходимостью предоставления дополнительных документов:
        <span class="documentlist">{}</span>
        <span class="documentlist">{}</span>
    </li>
</ol>
<p>
    Предлагаем Вам устранить указанные недостатки и повторно обратиться с заявлением в установленном порядке.
</p>
<p>
    &nbsp;
</p>
<p>
    С уважением,
</p>
<p>
    Регистратор Единого Окна -&nbsp; ${fullName}
</p>`;

  const [description, setDescription] = useState(fullText);

  useEffect(() => {
    console.log(description)
    const selectedDocs = store.incomingDocuments.filter(doc =>
      store.selectedDocumentIds.includes(doc.id)
    );
    const docsHtml = selectedDocs.length > 0
      ? `<ul>${selectedDocs.map(doc => `<li>${doc.doc_name}</li>`).join('')}</ul>`
      : '&nbsp;';
    const updated = description.replace(
      /<span class="documentlist">\s*&nbsp;\s*<\/span>[\s\S]*?<span class="documentlist">\s*&nbsp;\s*<\/span>/i,
      `<span class="documentlist">&nbsp;</span>${docsHtml}<span class="documentlist">&nbsp;</span>`
    );
    setDescription(updated);
  }, [store.selectedDocumentIds]);

  useEffect(() => {
    if (props.openPanel) {
    } else {
    }
  }, [props.openPanel])


  return (
    <Dialog maxWidth={"lg"} open={props.openPanel} onClose={props.onBtnCancelClick}>

      <DialogContent>
        <h2></h2>

        <Ckeditor
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          withoutPlaceholder
          name={`description`}
          id={`id_f_release_description`}
        />

        {store.incomingDocuments?.length > 0 && <Box>
          <h3>{translate("Выберите документы, которые необходимо заменить")}:</h3>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{translate("Документ")}</TableCell>
                  <TableCell>{translate("Дата загрузки")}</TableCell>
                  <TableCell>{translate("Выбрать")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {store.incomingDocuments.map((doc: any) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.doc_name}</TableCell>
                    <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={store.selectedDocumentIds.includes(doc.id)}
                        onChange={() => store.handleToggle(doc.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>}

      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_SmsSaveButton"
            onClick={() => {
              //TODO
              MainStore.openDigitalSign(
                0,
                async () => {
                  await store.signAndRejectToCabinet(description);
                  MainStore.onCloseDigitalSign();
                },
                () => MainStore.onCloseDigitalSign(),
              );

            }}
          >
            {translate("Подписать и отправить заказчику")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_SmsCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default RejectCabinetForm
