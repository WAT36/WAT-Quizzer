import React from 'react';
import { CardContent, Link, List, ListItem, ListItemText } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { GetPopularEventResponse } from 'quizzer-lib';

interface PopularEventListProps {
  eventList: GetPopularEventResponse[];
}

export const PopularEventList = ({ eventList }: PopularEventListProps) => {
  return (
    <Card variant="outlined" attr="margin-vertical">
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
