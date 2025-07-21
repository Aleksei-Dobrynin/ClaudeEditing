import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Divider,
  Collapse,
  IconButton,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { FormStyles } from '../styles/FormStyles';

interface FormSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  noPadding?: boolean;
  noMargin?: boolean;
  elevated?: boolean;
}

const SectionContainer = styled(Box, {
  shouldForwardProp: (prop) => !['elevated', 'noPadding', 'noMargin'].includes(prop as string),
})<{ elevated?: boolean; noPadding?: boolean; noMargin?: boolean }>(({ theme, elevated, noPadding, noMargin }) => ({
  marginBottom: noMargin ? 0 : theme.spacing(3),
  padding: noPadding ? 0 : theme.spacing(3),
  backgroundColor: elevated ? '#fff' : 'transparent',
  borderRadius: elevated ? FormStyles.sizes.borderRadius : 0,
  boxShadow: elevated ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': elevated ? {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
  } : {},
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    '& .section-title': {
      color: theme.palette.primary.main,
    },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  transition: 'color 0.2s ease-in-out',
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

const SectionContent = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(1),
}));

const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultExpanded = true,
  noPadding = false,
  noMargin = false,
  elevated = false,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const handleToggle = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
  };

  const headerContent = title && (
    <SectionHeader onClick={handleToggle}>
      <Box>
        <SectionTitle className="section-title">{title}</SectionTitle>
        {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
      </Box>
      {collapsible && (
        <IconButton size="small" onClick={handleToggle}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      )}
    </SectionHeader>
  );

  const content = (
    <SectionContent>
      {children}
    </SectionContent>
  );

  return (
    <SectionContainer elevated={elevated} noPadding={noPadding} noMargin={noMargin}>
      {headerContent}
      {title && !elevated && <StyledDivider />}
      {collapsible ? (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {content}
        </Collapse>
      ) : (
        content
      )}
    </SectionContainer>
  );
};

export default FormSection;