import { styled } from '@mui/material/styles';
import InputBase from "@mui/material/InputBase";

const CustomSelect = styled(InputBase)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(3)
    },
    "& .MuiInputBase-input": {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "1px solid #000000",
        fontSize: 16,
        padding: "10px 26px 10px 12px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        "&:hover": {
            border: "3px solid #000000",
            borderColor: "#000000",
            boxShadow: "0 0 0 0"
        },
    }
}));

export default CustomSelect;