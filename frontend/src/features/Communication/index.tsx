import { FC, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import { Container, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react"
import store from "./store"
import styled from "styled-components";
import ChevronCircleIcon from "./ChevronCircleIcon";
import TemplTemplateComms from 'features/TemplTemplateComms/TemplTemplateCommsAddEditView'
import TemplCommsAccessListView from "features/TemplCommsAccess/TemplCommsAccessListView";
import TemplCommsAccessFastInputView from "features/TemplCommsAccess/TemplCommsAccessAddEditView/fastInput";
import ScheduleCommunication from "./Tabs";
import TemplCommsEmailTabsViewView from "features/TemplCommsEmail/TemplCommsEmailListView/TabsView";


type CommunicationProps = {};

const CommunicationView: FC<CommunicationProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")

  useEffect(() => {
    if ((id != null) &&
      (id !== '') &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id))
    } else {
      navigate('/error-404')
    }
    return () => {
      store.clearStore()
    }
  }, [])


  return (
    <Container>

      <TitleWrapper>
        <TextCommunication id="Survey_EditCreate_Communication_Title">
          Comms title template
        </TextCommunication>
      </TitleWrapper>

      <AccordionWrapped>
        <AccordionSummaryWrapped
          expandIcon={<ChevronCircleIcon position="bottom" />}
          aria-controls="panel4bh-content"
          id="Survey_EditCreate_Communication_SetSurveyDates"
        >
          <AccordionSummaryDiv>
            <AccordionText id="Survey_EditCreate_Communication_SetSurveyDates_Text">
              Set survey dates
            </AccordionText>
          </AccordionSummaryDiv>
        </AccordionSummaryWrapped>
        <AccordionDetails>
          <TemplTemplateComms />
        </AccordionDetails>
      </AccordionWrapped>

      <AccordionWrapped>
        <AccordionSummaryWrapped
          expandIcon={<ChevronCircleIcon position="bottom" />}
          aria-controls="panel4bh-content"
          id="Survey_EditCreate_Communication_SurveyAccess"
        >
          <AccordionSummaryDiv>
            <AccordionText id="Survey_EditCreate_Communication_SurveyAccess_Text">
              Survey access
            </AccordionText>
          </AccordionSummaryDiv>
        </AccordionSummaryWrapped>
        <AccordionDetails>
          <TemplCommsAccessFastInputView 
            idMain={store.id}
          />
        </AccordionDetails>
      </AccordionWrapped>

      <AccordionWrapped>
        <AccordionSummary
          expandIcon={<ChevronCircleIcon position="bottom" />}
          aria-controls="panel4bh-content"
          id="Survey_EditCreate_Communication_ScheduleCommunications"
        >
          <AccordionSummaryDiv>
            <AccordionText id="Survey_EditCreate_Communication_ScheduleCommunications_Text">
              Schedule communications
            </AccordionText>
          </AccordionSummaryDiv>
        </AccordionSummary>
        <AccordionDetails>
          <ScheduleCommunication />
        </AccordionDetails>
      </AccordionWrapped>

      <AccordionWrapped>
        <AccordionSummary
          expandIcon={<ChevronCircleIcon position="bottom" />}
          aria-controls="panel4bh-content"
          id="Survey_EditCreate_Communication_SendReport"
        >
          <AccordionSummaryDiv>
            <AccordionText id="Survey_EditCreate_Communication_SendReport_Text">
              Send report when survey ends
            </AccordionText>
          </AccordionSummaryDiv>
        </AccordionSummary>
        <AccordionDetails>
        <TemplCommsEmailTabsViewView template_comms_id={store.id}/>
        </AccordionDetails>
      </AccordionWrapped>
    </Container>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const StyledContainer = styled(Container)`
  .MuiAccordion-root {
    border: 1px solid var(--colorNeutralBackground1);
  }
  .MuiAccordion-root.Mui-expanded {
    border: 1px solid var(--colorPaletteBlueBackground1);
  }
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 6px;
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--colorPaletteBlueBackground1);
    border-radius: 15px;
    border: 3px solid var(--colorPaletteBlueBackground1);
  }
`;

const TextCommunication = styled.span`
  font-size: 32px;
  font-weight: 600;
  line-height: 36px;
  text-align: left;
  color: var(--colorNeutralForeground1);
  margin: 0px;
`;

const AccordionText = styled.span`
  color: var(--colorNeutralForeground1);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`;

const AccordionWrapped = styled(Accordion)`
  margin: 0 0 20px 0;
  border-radius: 10px !important;
  box-shadow: none !important;
  &::before {
    content: none !important;
  }
`;

const AccordionSummaryWrapped = styled(AccordionSummary)``;

const AccordionSummaryDiv = styled.div`
  margin: 20px;
`;

export default CommunicationView