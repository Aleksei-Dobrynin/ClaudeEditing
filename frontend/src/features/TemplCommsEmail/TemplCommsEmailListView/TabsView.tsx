import React, { FC, useEffect } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import TemplCommsEmailPopupForm from './../TemplCommsEmailAddEditView/popupForm'
import styled from 'styled-components';
import TemplCommsEmailAddEditView from '../TemplCommsEmailAddEditView';


type TemplCommsEmailTabsViewViewProps = {
  template_comms_id: number;
};


const TemplCommsEmailTabsViewView: FC<TemplCommsEmailTabsViewViewProps> = observer((props) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.template_comms_id !== props.template_comms_id) {
      store.template_comms_id = props.template_comms_id
    }
    store.loadTemplCommsEmails()
    return () => store.clearStore()
  }, [props.template_comms_id])


  const columns: GridColDef[] = [
    {
      field: 'language_idNavName',
      headerName: translate("label:TemplCommsEmailListView.language_id"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsEmail_column_language_id"}> {param.row.language_idNavName} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsEmail_header_language_id"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'body_email',
      headerName: translate("label:TemplCommsEmailListView.body_email"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsEmail_column_body_email"}> {param.row.body_email} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsEmail_header_body_email"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'subject_email',
      headerName: translate("label:TemplCommsEmailListView.subject_email"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsEmail_column_subject_email"}> {param.row.subject_email} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsEmail_header_subject_email"}>{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:TemplCommsEmailListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsEmail(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsEmail" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:TemplCommsEmailListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsEmail(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsEmail" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="scrollable"
        scrollButtons
      >
        {store.data.map((element, i) => (
          <CustomTab
            // onClick={() => store.changeLastLanguage(language.language_id)}
            $selected={value === i}
            key={element.language_id}
            label={
              <span>
                {element.id}
              </span>
            }
            {...a11yProps(i)}
          />
        ))}
      </Tabs>


      {store.data.map((element, i: number) => (
        <CustomTabPanel key={element.language_id} value={value} index={i}>
          <TemplCommsEmailAddEditView id={element.id} onSaveClicked={() => {}} onCancelClicked={() => {}} />
        </CustomTabPanel>
      ))}

    </Container>
  );
})

const CustomTab = styled(Tab) <{ $selected: boolean | undefined }>`
  border-radius: 5px 5px 0 0 !important;
  margin-right: 10px !important;
  background-color: ${(props) =>
    props.$selected
      ? "var(--colorNeutralBackground1)"
      : "var(--colorPaletteGrayBackground1)"} !important;
  color: ${(props) =>
    props.$selected
      ? "var(--colorNeutralForeground1)"
      : "var(--colorNeutralForeground2)"} !important;
  border: ${(props) =>
    props.$selected
      ? "1px solid var(--colorBrandForeground1)"
      : "1px solid var(--colorPaletteBlueBackground1)"} !important;
  border-bottom: 0 !important;
  text-transform: none !important;
`;


type ScrollButtonComponents = {
  direction: "left" | "right";
  disabled: boolean;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <StyledBox>{children}</StyledBox>}
    </div>
  );
};

const StyledBox = styled(Box)`
  .rsw-editor {
    border-radius: 0 0 4px 4px;
    min-height: auto !important;
  }
  .rsw-ce {
    min-height: auto !important;
    padding: 16px 11px;
  }
`;


const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};


export default TemplCommsEmailTabsViewView
