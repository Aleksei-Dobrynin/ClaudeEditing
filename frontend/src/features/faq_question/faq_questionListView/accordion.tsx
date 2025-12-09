import { FC, useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Faq_questionPopupForm from './../faq_questionAddEditView/popupForm'
import styled from 'styled-components';
import { ExpandMore } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { API_URL } from 'constants/config';


type faq_questionListViewProps = {
};


const AccordionQuestionListView: FC<faq_questionListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadfaq_questions()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'title',
      headerName: translate("label:faq_questionListView.title"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_title"> {param.row.title} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_title">{param.colDef.headerName}</div>)
    },
    {
      field: 'answer',
      headerName: translate("label:faq_questionListView.answer"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_answer"> {param.row.answer} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_answer">{param.colDef.headerName}</div>)
    },
    {
      field: 'video',
      headerName: translate("label:faq_questionListView.video"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_video"> {param.row.video} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_video">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_visible',
      headerName: translate("label:faq_questionListView.is_visible"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_is_visible"> {param.row.is_visible} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_is_visible">{param.colDef.headerName}</div>)
    },
    {
      field: 'settings',
      headerName: translate("label:faq_questionListView.settings"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_settings"> {param.row.settings} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_settings">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <Container maxWidth='xl' sx={{ mt: 4, mb: 2 }}>
      <h1>{translate("label:faq_questionListView.Frequently_asked_questions")}</h1>
      {store.data.filter((x) => x.is_visible).map((x, i) => (
        <AccordionWrapped defaultExpanded={i === 0} sx={{ mb: 1, borderRadius: "30px" }}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <div dangerouslySetInnerHTML={{ __html: x.title }}></div>
            {/* <Typography>{x.title}</Typography> */}
          </AccordionSummary>
          <AccordionDetails>
            <div dangerouslySetInnerHTML={{ __html: x.answer }}></div>
            <Box display={"flex"} justifyContent={"center"}>
              {x.video && <ReactPlayer controls url={`${API_URL}Videos/${x.video}`} />}
            </Box>
          </AccordionDetails>
        </AccordionWrapped>))}
    </Container>
  );
})



export default AccordionQuestionListView

const AccordionWrapped = styled(Accordion)`
  margin: 0 0 20px 0;
  border-radius: 10px !important;
  box-shadow: none !important;
  &::before {
    content: none !important;
  }
`;