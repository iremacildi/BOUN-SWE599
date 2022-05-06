import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
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