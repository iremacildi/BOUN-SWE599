import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';

const LightButton = styled(Button)(({ theme }) => ({
    color: '#ffffff',
    backgroundColor: '#000000',
    '&:hover': {
        backgroundColor: '#ffffff',
        color: '#000000',
        boxShadow: '0 0 0 0.2rem #000000',
    },
}));

export default LightButton;