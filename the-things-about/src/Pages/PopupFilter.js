import { useState } from 'react'
import CustomTableMini from '../Components/CustomTableMini';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, IconButton, FormControl, Chip, Grid } from '@mui/material';
import CustomButton from '../Components/CustomButton';
import { useSession, Text, CombinedDataProvider } from "@inrupt/solid-ui-react";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { getFriendsList } from '../Functions';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import CustomTextField from '../Components/CustomTextField';
import AddIcon from '@mui/icons-material/Add';

export default function PopupFilter(props) {
    const { session } = useSession();
    const [searchText, setSearchText] = useState('');
    const [friendsList, setFriendsList] = useState(() => {
        (async () => {
            var _friendsList = [];
            _friendsList = await getFriendsList(props.fetcher, props.store, props.me);
            console.log(_friendsList)
            setFriendsList(_friendsList)
        })();
    });
    const [webids, setWebids] = useState([]);

    const handleTextChange = () => (event) => {
        setSearchText(event.target.value);
    };

    const handleDelete = (webidToDelete) => () => {
        setWebids((webids) => webids.filter((webid) => webid !== webidToDelete));
    };

    const handleSearch = () => {
        webids.push(searchText);
        setSearchText('');
    }

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Name',
        }
    ];

    return (
        <CombinedDataProvider
            datasetUrl={session.info.webId}
            thingUrl={session.info.webId}
        >
            <Dialog
                open={props.open}
                onClose={props.handleClose}
            >
                <DialogTitle>
                    <Text properties={[
                        "http://xmlns.com/foaf/0.1/name",
                        "http://www.w3.org/2006/vcard/ns#fn",
                    ]} />
                    {"'s friends"}
                </DialogTitle>
                <DialogContent sx={{ width: 420 }}>
                    {friendsList ?
                        <>
                            <DialogContentText>Here are your cool friends! <ElectricBoltIcon /><br />
                                Please select the ones you want to include their pods in your search.
                            </DialogContentText><br />
                            <CustomTableMini rows={friendsList} headCells={headCells} />
                        </>
                        :
                        <DialogContentText>
                            <SentimentDissatisfiedIcon /><br />
                            You should definitely find some "solid" friends!
                        </DialogContentText>
                    }
                    <DialogContentText>Enter WebIds other than your friends'</DialogContentText>
                    <Grid style={{ height: '35px', width: 'inherit' }}>
                        <FormControl sx={{ height: 'inherit', width: 'inherit' }} variant="outlined">
                            <CustomTextField
                                style={{ height: '35px' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleSearch()} style={{ height: '30px', width: '30px' }}>
                                                <AddIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    type: ('text'),
                                    value: (searchText),
                                    onChange: (handleTextChange()),
                                    onKeyPress: ((event) => {
                                        if (event.key === 'Enter') {
                                            handleSearch()
                                        }
                                    }),
                                    style: { height: '35px', padding: '0px', margin: '0px' },
                                }}
                            />
                        </FormControl>
                    </Grid>
                    {
                        webids.map((webid) => (
                            <Chip label={webid} onDelete={handleDelete(webid)} style={{ margin: '5px' }} />
                        ))
                    }
                </DialogContent>
                <DialogActions>
                    <CustomButton variant="contained" onClick={props.handleClose} endIcon={<DirectionsRunIcon />}>
                        That's all
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </CombinedDataProvider >
    );
}
