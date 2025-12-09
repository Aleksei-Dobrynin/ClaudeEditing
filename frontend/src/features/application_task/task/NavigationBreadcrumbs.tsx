import React, { FC, useEffect, useState } from "react";
import { 
  Breadcrumbs, 
  Typography, 
  Box, 
  IconButton,
  Chip,
  Tooltip,
  Button
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

// Types
interface BreadcrumbItem {
  label: string;
  path?: string; // path необязателен для последнего элемента
  icon?: React.ReactNode;
  params?: Record<string, any>;
}

interface NavigationBreadcrumbsProps {
  items?: BreadcrumbItem[];
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

// Styled components
const BreadcrumbsContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 8px 0;
`;

const StyledLinkButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #0078DB;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  min-width: auto;
  text-transform: none;
  font-weight: 400;
  
  &:hover {
    text-decoration: underline;
    color: #005fa3;
    background-color: transparent;
  }
`;

const CurrentPageText = styled(Typography)`
  font-size: 14px;
  color: text.primary;
  font-weight: 500;
`;

// Navigation History Manager (singleton)
class NavigationHistoryManager {
  private static instance: NavigationHistoryManager;
  private history: BreadcrumbItem[][] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 10;
  
  private constructor() {
    // Load from sessionStorage if available
    const stored = sessionStorage.getItem('navigationHistory');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.history = parsed.history || [];
        this.currentIndex = parsed.currentIndex || -1;
      } catch (e) {
        console.error('Failed to parse navigation history:', e);
      }
    }
  }
  
  static getInstance(): NavigationHistoryManager {
    if (!NavigationHistoryManager.instance) {
      NavigationHistoryManager.instance = new NavigationHistoryManager();
    }
    return NavigationHistoryManager.instance;
  }
  
  push(items: BreadcrumbItem[]): void {
    // Remove items after current index if we're not at the end
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    // Add new item
    this.history.push(items);
    this.currentIndex++;
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
      this.currentIndex = this.history.length - 1;
    }
    
    this.saveToStorage();
  }
  
  canGoBack(): boolean {
    return this.currentIndex > 0;
  }
  
  goBack(): BreadcrumbItem[] | null {
    if (this.canGoBack()) {
      this.currentIndex--;
      this.saveToStorage();
      return this.history[this.currentIndex];
    }
    return null;
  }
  
  getCurrent(): BreadcrumbItem[] | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }
  
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.saveToStorage();
  }
  
  private saveToStorage(): void {
    try {
      sessionStorage.setItem('navigationHistory', JSON.stringify({
        history: this.history,
        currentIndex: this.currentIndex
      }));
    } catch (e) {
      console.error('Failed to save navigation history:', e);
    }
  }
}

// Hook for managing breadcrumbs
export const useNavigationBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const historyManager = NavigationHistoryManager.getInstance();
  
  const generateBreadcrumbs = (
    currentPath: string, 
    params?: URLSearchParams
  ): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t("common:home", "Главная"), path: "/user" }
    ];
    
    // Parse path and generate breadcrumbs based on route structure
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    if (pathSegments[0] === 'user') {
      if (pathSegments[1] === 'application_task') {
        // Tasks navigation
        const backParam = params?.get('back');
        
        if (backParam === 'all') {
          breadcrumbs.push({ 
            label: t("label:ApplicationTaskListView.AllTasks", "Все задачи"), 
            path: "/user/all_tasks" 
          });
        } else if (backParam === 'my') {
          breadcrumbs.push({ 
            label: t("label:ApplicationTaskListView.MyTasks", "Мои задачи"), 
            path: "/user/my_tasks" 
          });
        } else {
          breadcrumbs.push({ 
            label: t("label:ApplicationTaskListView.StructureTasks", "Задачи отдела"), 
            path: "/user/structure_tasks" 
          });
        }
        
        if (pathSegments[2] === 'addedit') {
          const id = params?.get('id');
          if (id && id !== '0') {
            breadcrumbs.push({ 
              label: t("label:ApplicationTaskListView.Task", "Задача") + ` #${id}` 
            });
          }
        }
      } else if (pathSegments[1] === 'application') {
        breadcrumbs.push({ 
          label: t("label:ApplicationListView.entityTitle", "Заявки"), 
          path: "/user/applications" 
        });
        
        if (pathSegments[2] === 'addedit') {
          const id = params?.get('id');
          if (id && id !== '0') {
            breadcrumbs.push({ 
              label: t("label:ApplicationAddEditView.entityTitle", "Заявка") + ` #${id}` 
            });
          } else {
            breadcrumbs.push({ 
              label: t("common:create", "Создание") 
            });
          }
        }
      }
    }
    
    return breadcrumbs;
  };
  
  const pushBreadcrumbs = (items: BreadcrumbItem[]) => {
    historyManager.push(items);
  };
  
  const goBack = () => {
    const previousBreadcrumbs = historyManager.goBack();
    if (previousBreadcrumbs && previousBreadcrumbs.length > 1) {
      const lastItem = previousBreadcrumbs[previousBreadcrumbs.length - 2];
      if (lastItem.path) {
        navigate(lastItem.path);
      }
    }
  };
  
  return {
    generateBreadcrumbs,
    pushBreadcrumbs,
    goBack,
    canGoBack: historyManager.canGoBack()
  };
};

// Main component
const NavigationBreadcrumbs: FC<NavigationBreadcrumbsProps> = observer(({
  items,
  onBack,
  showBackButton = true,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { generateBreadcrumbs, pushBreadcrumbs, goBack, canGoBack } = useNavigationBreadcrumbs();
  
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  
  useEffect(() => {
    if (items && items.length > 0) {
      // Use provided items
      setBreadcrumbItems(items);
      pushBreadcrumbs(items);
    } else {
      // Generate breadcrumbs from current location
      const params = new URLSearchParams(location.search);
      const generated = generateBreadcrumbs(location.pathname, params);
      setBreadcrumbItems(generated);
      pushBreadcrumbs(generated);
    }
  }, [location, items]);
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (canGoBack) {
      goBack();
    } else if (breadcrumbItems.length > 1) {
      // Go to previous breadcrumb
      const previousItem = breadcrumbItems[breadcrumbItems.length - 2];
      if (previousItem.path) {
        navigate(previousItem.path);
      }
    } else {
      // Default back navigation
      navigate(-1);
    }
  };
  
  const handleBreadcrumbClick = (item: BreadcrumbItem, e: React.MouseEvent) => {
    e.preventDefault();
    if (item.path) {
      navigate(item.path);
    }
  };
  
  if (breadcrumbItems.length === 0) {
    return null;
  }
  
  return (
    <BreadcrumbsContainer className={className}>
      {showBackButton && (
        <Tooltip title={t("common:back", "Назад")}>
          <IconButton 
            onClick={handleBack}
            size="small"
            sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '4px 8px'
            }}
          >
            <KeyboardBackspaceIcon />
          </IconButton>
        </Tooltip>
      )}
      
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ flex: 1 }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;
          
          if (isLast) {
            return (
              <CurrentPageText key={index}>
                {item.icon && <Box component="span" sx={{ mr: 0.5 }}>{item.icon}</Box>}
                {item.label}
              </CurrentPageText>
            );
          }
          
          return (
            <StyledLinkButton
              key={index}
              onClick={(e) => handleBreadcrumbClick(item, e)}
              variant="text"
            >
              {isFirst && <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              {!isFirst && item.icon && <Box component="span" sx={{ mr: 0.5 }}>{item.icon}</Box>}
              {item.label}
            </StyledLinkButton>
          );
        })}
      </Breadcrumbs>
    </BreadcrumbsContainer>
  );
});

export default NavigationBreadcrumbs;