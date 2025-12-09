import React, { FC, useEffect } from "react";
import {
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel, Radio, RadioGroup
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import CustomButton from "components/Button";

type org_structure_templatesListViewProps = {
  application_id: number;
  structure_id: number;
  openPanel: boolean;
  onBtnCancelClick: () => void;
};


const Org_structure_templatesPrintView: FC<org_structure_templatesListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (props.openPanel) {
      store.application_id = props.application_id;
      store.structure_id = props.structure_id;
      store.loadLanguages();
      store.loadorg_structure_template(props.structure_id);
    }
    return () => store.clearStore();
  }, [props.openPanel]);


  const columns: GridColDef[] = [

    {
      field: "template_name",
      headerName: translate("label:org_structure_templatesListView.template_id"),
      flex: 4,
      renderCell: (param) => (
        <div data-testid="table_org_structure_templates_column_name"> {param.row.template_name} </div>),
      renderHeader: (param) => (
        <div data-testid="table_org_structure_templates_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: "template_id",
      headerName: translate("label:org_structure_templatesListView.print"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_templates_column_name">
        <CustomButton onClick={() => {
          store.isOpenSelectLang = true;
          store.current_template_id = param.row.template_id;
        }} variant="contained">
          {translate("common:print")}
        </CustomButton>
      </div>),
      renderHeader: (param) => (
        <div data-testid="table_org_structure_templates_header_name">{param.colDef.headerName}</div>)
    }
  ];

  return (
    <Dialog open={props.openPanel} onClose={() => props.onBtnCancelClick()} maxWidth="md" fullWidth>
      <DialogContent>
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <PageGrid
            hideActions
            hideAddButton
            title={translate("label:org_structure_templatesListView.entityTitle")}
            columns={columns}
            data={store.data}
            tableName="org_structure_templates" />
        </Container>
      </DialogContent>
      <DialogActions>
        <CustomButton
          variant="contained"
          id="id_org_structure_templatesCancelButton"
          name={"org_structure_templatesAddEditView.cancel"}
          onClick={() => {
            props.onBtnCancelClick();
          }}
        >
          {translate("common:cancel")}
        </CustomButton>
      </DialogActions>

      <ConfirmationDialogRaw
        open={store.isOpenSelectLang}
        onClose={(v) => {
          store.isOpenSelectLang = false;
        }}
      />
    </Dialog>
  );
});

interface ConfirmationDialogRawProps {
  open: boolean;
  onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, open, ...other } = props;
  const [value, setValue] = React.useState(null);
  const radioGroupRef = React.useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const translate = t;

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>{translate("common:chooseLanguage")}</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="language"
          name="language"
          value={value}
          onChange={handleChange}
        >{store.Languages.map((l) => (
          <FormControlLabel
            id={l.id}
            key={l.id}
            value={l.code}
            control={<Radio />}
            label={l.name}
            onClick={() => store.current_language_code = l.code}
          />
        ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <CustomButton
          variant="contained"
          size="small"
          id="id_CancelButton"
          onClick={() => {
            setValue(null)
            props.onClose()
            store.printDocument(store.current_template_id, store.current_language_code)}}
        >
          {translate("common:ok")}
        </CustomButton>
        <CustomButton
          variant="contained"
          size="small"
          id="id_CancelButton"
          onClick={() => {
            setValue(null)
            props.onClose()
          }}
        >
          {translate("common:cancel")}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}

export default Org_structure_templatesPrintView;
