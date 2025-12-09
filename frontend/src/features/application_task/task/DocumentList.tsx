import { observer } from "mobx-react";
import * as React from "react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FormControlLabel, Radio } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import ApplicationWorkDocumentListView from "../../ApplicationWorkDocument/ApplicationWorkDocumentListView";
import Uploaded_application_documentListView
  from "../../UploadedApplicationDocument/uploaded_application_documentListView";
import Outgoing_Uploaded_application_documentListView
  from "../../UploadedApplicationDocument/uploaded_application_documentListView/index_outgoing";
import Typography from "@mui/material/Typography";
import Saved_application_documentListView from "features/saved_application_document/saved_documents";
import Org_structure_templatesGridPrintView from "features/org_structure_templates/my_templates/indexGrid"



type Props = {
  idTask?: number;
  idApplication?: number;
}

const DocumentList: FC<Props> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [selectedValue, setSelectedValue] = React.useState('b');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);

  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
    style: { fontSize: "10px" }
  });
  return (
    <>
      <FormControl >
        <RadioGroup
          row
          aria-labelledby="demo-form-control-label-placement"
          name="position"
          defaultValue="top"
        >
          <FormControlLabel
            value="topLeft"
            control={<Radio {...controlProps('b')} />}
            labelPlacement="top"
            label={<Typography sx={styles.typography}>{translate("label:ApplicationWorkDocumentListView.radioTwoTitle")}</Typography>}
          />
          <FormControlLabel
            value="topLeft"
            control={<Radio {...controlProps('c')} />}
            labelPlacement="top"
            label={<Typography sx={styles.typography}>{translate("label:ApplicationWorkDocumentListView.radioThreeTitle")}</Typography>}
          />
          <FormControlLabel
            value="top"
            control={<Radio {...controlProps('a')} />}
            labelPlacement="top"
            label={<Typography sx={styles.typography}>{translate("label:ApplicationWorkDocumentListView.radioOneTitle")}</Typography>}
          />

          <FormControlLabel
            value="topLeft"
            control={<Radio {...controlProps('d')} />}
            labelPlacement="top"
            label={<Typography sx={styles.typography}>{translate("Шаблоны ЕО")}</Typography>}
          />
          <FormControlLabel
            value="topLeft"
            control={<Radio {...controlProps('e')} />}
            labelPlacement="top"
            label={<Typography sx={styles.typography}>{translate("Шаблоны отдела")}</Typography>}
          />
        </RadioGroup>
      </FormControl>
      {selectedValue === "a" ? <ApplicationWorkDocumentListView idTask={props.idTask} fromTasks idApplication={props.idApplication} /> :
        selectedValue === "b" ? <><Outgoing_Uploaded_application_documentListView idMain={props.idApplication} columns={1} />
        </> :
          selectedValue === "c" ? <Uploaded_application_documentListView fromTasks idMain={props.idApplication} /> :
            selectedValue === "d" ? <Saved_application_documentListView application_id={props.idApplication} /> :
              selectedValue === "e" ? <Org_structure_templatesGridPrintView application_id={props.idApplication} /> : null}
    </>
  )
})

const styles = {
  typography: {
    fontSize: 15,
    fontWeight: 'bold',
  }
};

export default DocumentList;