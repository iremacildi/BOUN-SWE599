import { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
import CustomTextField from './CustomTextField';

function SearchBar(props) {
    const [searchText, setSearchText] = useState('');

    const handleTextChange = () => (event) => {
        setSearchText(event.target.value);
    };

    return (
        <FormControl sx={{ width: 'inherit' }} variant="outlined">
            <CustomTextField
                label="Find the things about..."
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => props.func(searchText)}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                    type: ('text'),
                    value: (searchText),
                    onChange: (handleTextChange()),
                    onKeyPress: ((event) => {
                        if (event.key === 'Enter') {
                            props.func(searchText)
                        }
                    })
                }} />
        </FormControl>)
}

export default SearchBar;