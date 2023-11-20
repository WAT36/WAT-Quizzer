import { Paper, styled } from '@mui/material';

interface ItemProps {}

export const Item = ({}: ItemProps) => {
  return styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }));
};
