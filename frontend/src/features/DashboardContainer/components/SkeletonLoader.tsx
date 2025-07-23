// components/dashboard-beta/shared/SkeletonLoader.tsx

import React from 'react';
import {
  Skeleton,
  Box,
  Card,
  CardContent,
  Grid
} from '@mui/material';

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'grid' | 'statistics' | 'custom';
  count?: number;
  height?: number;
  children?: React.ReactNode;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 1,
  height = 200,
  children
}) => {
  if (children) {
    return <>{children}</>;
  }

  const renderCardSkeleton = () => (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={height} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="30%" />
        </Box>
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
          <Skeleton variant="rectangular" width={80} height={32} />
        </Box>
      ))}
    </Box>
  );

  const renderGridSkeleton = () => (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderStatisticsSkeleton = () => (
    <Grid container spacing={2}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
              <Skeleton variant="text" width="40%" height={48} />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  switch (type) {
    case 'list':
      return renderListSkeleton();
    case 'grid':
      return renderGridSkeleton();
    case 'statistics':
      return renderStatisticsSkeleton();
    case 'card':
    default:
      return (
        <>
          {Array.from({ length: count }).map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {renderCardSkeleton()}
            </Box>
          ))}
        </>
      );
  }
};

export default SkeletonLoader;