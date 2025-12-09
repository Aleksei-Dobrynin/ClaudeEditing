// components/dashboard-beta/widgets/ReferenceWidget/index.tsx

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  Assignment as AssignmentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Support as SupportIcon,
  ArrowForward as ArrowForwardIcon,
  Article as ArticleIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ReferenceWidgetProps, ReferenceSection } from '../../types/dashboard';
import WidgetWrapper from '../../components/WidgetWrapper';

const getIcon = (iconName?: string) => {
  const icons: Record<string, React.ReactNode> = {
    description: <DescriptionIcon />,
    gavel: <GavelIcon />,
    assignment: <AssignmentIcon />,
    article: <ArticleIcon />,
    phone: <PhoneIcon />,
    email: <EmailIcon />,
    support: <SupportIcon />
  };
  return icons[iconName || 'article'] || <ArticleIcon />;
};

const ReferenceWidget: React.FC<ReferenceWidgetProps> = ({
  sections,
  layout = 'horizontal'
}) => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();

  const defaultSections: ReferenceSection[] = [
    {
      id: 'docs',
      title: t('label:dashboard.reference.title'),
      items: [
        {
          id: '1',
          title: t('label:dashboard.reference.documentRequirements'),
          icon: 'description',
          href: '/user'
        },
        {
          id: '2',
          title: t('label:dashboard.reference.fillingSamples'),
          icon: 'assignment',
          href: '/user'
        },
        {
          id: '3',
          title: t('label:dashboard.reference.regulatoryBase'),
          icon: 'gavel',
          href: '/user'
        }
      ]
    },
    // {
    //   id: 'support',
    //   title: t('label:dashboard.reference.technicalSupport'),
    //   items: [
    //     {
    //       id: '4',
    //       title: '+996 (312) 66-xx-xx',
    //       icon: 'phone',
    //       description: 'Горячая линия'
    //     },
    //     {
    //       id: '5',
    //       title: 'support@bga.kg',
    //       icon: 'email',
    //       description: 'Email поддержки'
    //     }
    //   ]
    // }
  ];

  const displaySections = sections?.length > 0 ? sections : defaultSections;

  const renderSection = (section: ReferenceSection) => (
    <Card key={section.id} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
          {section.title}
        </Typography>
        
        {section.items?.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {section.id === 'docs' 
                ? t('label:dashboard.reference.description')
                : t('label:dashboard.reference.supportDescription')
              }
            </Typography>

            <List dense disablePadding>
              {section.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    disableGutters
                    sx={{
                      py: 1,
                      cursor: item.href ? 'pointer' : 'default',
                      borderRadius: 1,
                      '&:hover': item.href ? {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      } : {},
                    }}
                    onClick={() => item.href && (window.location.href = item.href)}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                      {getIcon(item.icon)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: item.href ? 500 : 400 }}>
                            {item.title}
                          </Typography>
                          {item.href && (
                            <ArrowForwardIcon 
                              fontSize="small" 
                              sx={{ 
                                opacity: 0.6,
                                transition: 'transform 0.2s',
                                '.MuiListItem-root:hover &': {
                                  transform: 'translateX(4px)',
                                }
                              }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={item.description}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  {index < section.items?.length - 1 && (
                    <Divider variant="inset" component="li" sx={{ ml: 5 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </>
        )}

        {section.id === 'support' && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SupportIcon />}
            >
              {t('label:dashboard.reference.contactSupport')}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {layout === 'horizontal' ? (
        <Grid container spacing={3}>
          {displaySections.map(section => (
            <Grid item xs={12} md={6} key={section.id}>
              {renderSection(section)}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {displaySections.map(section => renderSection(section))}
        </Box>
      )}
    </Box>
  );
};

export default ReferenceWidget;