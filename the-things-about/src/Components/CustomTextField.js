import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#000000',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#000000',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#000000',
        },
        '&:hover fieldset': {
            borderColor: '#000000',
            borderWidth: 3
        },
        '&.Mui-focused fieldset': {
            borderColor: '#000000',
            borderWidth: 3
        },
    },
});

export default CustomTextField;