import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CustomButton from '../Components/CustomButton';
import { useSession, Text, CombinedDataProvider } from "@inrupt/solid-ui-react";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export default function PopupFilter(props) {
    const { session } = useSession();

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
                <DialogContent sx={{ width: 220 }}>
                    <DialogContentText>
                        <SentimentDissatisfiedIcon /><br/>
                        You should definitely find some "solid" friends!
                    </DialogContentText>
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
