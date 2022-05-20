import { Fragment, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CustomButton from '../Components/CustomButton';
import { useSession, Text, CombinedDataProvider } from "@inrupt/solid-ui-react";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ParaglidingIcon from '@mui/icons-material/Paragliding';

export default function PopupWelcome() {
    const { session } = useSession();
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <CombinedDataProvider
            datasetUrl={session.info.webId}
            thingUrl={session.info.webId}
        >
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {"Welcome "}
                    <Text properties={[
                        "http://xmlns.com/foaf/0.1/name",
                        "http://www.w3.org/2006/vcard/ns#fn",
                    ]} />
                    {"!"}
                </DialogTitle>
                <DialogContent sx={{ width: 220 }}>
                    <DialogContentText>
                        It's great to see you here! <CelebrationIcon />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <CustomButton variant="contained" onClick={handleClose} endIcon={<ParaglidingIcon />}>
                        IDC...
                    </CustomButton>
                    <CustomButton variant="contained" onClick={handleClose} endIcon={<EmojiEmotionsIcon />}>
                        Hello!
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </CombinedDataProvider>
    );
}
