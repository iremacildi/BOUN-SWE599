import { useState } from 'react'
import CustomTableMini from '../Components/CustomTableMini';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CustomButton from '../Components/CustomButton';
import { useSession, Text, CombinedDataProvider } from "@inrupt/solid-ui-react";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { getFriendsList } from '../Functions';

export default function PopupFilter(props) {
    const { session } = useSession();
    const [friendsList, setFriendsList] = useState(() => {
        (async () => {
            var _friendsList = [];
            _friendsList = await getFriendsList(props.fetcher, props.store, props.me);
            console.log(_friendsList)
            setFriendsList(_friendsList)
        })();
    });

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
                    <DialogContentText>
                        <SentimentDissatisfiedIcon /><br />
                        You should definitely find some "solid" friends!
                    </DialogContentText>
                    <CustomTableMini rows={friendsList} headCells={headCells} />
                </DialogContent>
                <DialogActions>
                    <CustomButton variant="contained" onClick={props.handleClose} endIcon={<DirectionsRunIcon />}>
                        Go get it!
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </CombinedDataProvider>
    );
}
