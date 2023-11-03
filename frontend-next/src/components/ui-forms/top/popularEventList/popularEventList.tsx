import React from 'react';
import { Card, CardContent, Link, List, ListItem, ListItemText } from '@mui/material';
import { GetPopularEventResponse } from '../../../../../interfaces/api/response';

interface PopularEventListProps {
  eventList: GetPopularEventResponse[];
}

export const PopularEventList = ({ eventList }: PopularEventListProps) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <List>
          {eventList.map((x, index) => (
            <ListItem key={index}>
              <ListItemText>
                {x.link && x.link !== '' ? (
                  <Link href={x.link} color="inherit">
                    {x.name}
                  </Link>
                ) : (
                  x.name
                )}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
