import React from 'react';
import { CardContent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { DbHealthCheckState } from '../../../../../interfaces/state';

interface DbHealthCheckCardProps {
  dbHealthCheckState: DbHealthCheckState;
}

export const DbHealthCheckCard = ({ dbHealthCheckState }: DbHealthCheckCardProps) => {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="span" color="common.black">
            DB接続状況：
          </Typography>
          <Typography variant="h6" component="span" color={dbHealthCheckState.color}>
            {dbHealthCheckState.status}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
