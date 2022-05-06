import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const CustomButton = styled(Button)({
    color: '#ffffff',
    backgroundColor: '#000000',
    '&:hover': {
        backgroundColor: '#ffffff',
        color: '#000000',
        boxShadow: '0 0 0 0.2rem #000000'
    },
    '&.Mui-disabled': {
        background: "rgba(0, 0, 0, 0.12)",
        color: "#ffffff"
      }
});

export default CustomButton;