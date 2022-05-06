import * as React from 'react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CustomButton from '../Components/CustomButton';
import CustomTextField from '../Components/CustomTextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import { maxHeight } from '@mui/system';
import CustomSelect from '../Components/CustomSelect';

export default function PopupAddBookmark() {
    const [open, setOpen] = React.useState(false);
    const [label, setLabel] = React.useState(0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setLabel(event.target.value);
    };

    const handleSave = () => {
        alert("saved!");
        setOpen(false);
    };

    const handleDelete = () => {
        alert("label deleted!");
    };

    return (
        <React.Fragment>
            <CustomButton onClick={handleClickOpen}>Add New Bookmark</CustomButton>
            <Dialog open={open} onClose={handleClose} >
                <DialogTitle>Add New Bookmark</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <Grid container direction="row" id="addmargin">
                        <Grid container item direction="column" lg={2} justifyContent="center" alignItems="flex-start">
                            <InputLabel id="bookmarkname">Name</InputLabel>
                        </Grid>
                        <Grid container item direction="column" lg={10} justifyContent="center" alignItems="flex-start">
                            <CustomTextField
                                size="small"
                                name="bookmarkname"
                                required
                                fullWidth
                                id="bookmarkname"
                                placeholder="Bookmark Name"
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" id="addmargin">
                        <Grid container item direction="column" lg={2} justifyContent="center" alignItems="flex-start">
                            <InputLabel id="bookmarkurl">URL</InputLabel>
                        </Grid>
                        <Grid container item direction="column" lg={10} justifyContent="center" alignItems="flex-start">
                            <CustomTextField
                                size="small"
                                name="bookmarkurl"
                                required
                                fullWidth
                                id="bookmarkurl"
                                placeholder="Bookmark URL"
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" id="addmargin">
                        <Grid container item direction="column" lg={2} justifyContent="center" alignItems="flex-start">
                            <InputLabel id="bookmarktype">Type</InputLabel>
                        </Grid>
                        <Grid container item direction="column" lg={10} justifyContent="center" alignItems="flex-start">
                            <CustomTextField
                                size="small"
                                name="bookmarktype"
                                required
                                fullWidth
                                id="bookmarktype"
                                placeholder="Bookmark Type"
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" id="addmargin">
                        <Grid container item direction="column" lg={3} justifyContent="center" alignItems="flex-start">
                            <Select
                                id="selectlabel"
                                value={label}
                                onChange={handleChange}
                                sx={{ maxHeight: 40 }}
                                input={<CustomSelect />}
                            >
                                <MenuItem value={0}>Labels</MenuItem>
                                <MenuItem value={10}>NoSQL</MenuItem>
                                <MenuItem value={20}>Work</MenuItem>
                                <MenuItem value={30}>School</MenuItem>
                                <MenuItem value={40}>Programming</MenuItem>
                            </Select>
                        </Grid>
                        <Grid container item direction="column" lg={9} justifyContent="center" alignItems="flex-start">
                            <Chip label="Deletable" onDelete={handleDelete} />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" id="addmargintop">
                        <Grid container item justifyContent="flex-start">
                            <InputLabel id="bookmarkcomment">Comment</InputLabel>
                        </Grid>
                        <Grid container item justifyContent="center" alignItems="flex-end">
                            <CustomTextField
                                size="small"
                                name="bookmarkcomment"
                                required
                                fullWidth
                                id="bookmarkcomment"
                                placeholder="Comment"
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row">
                        <Grid container item justifyContent="flex-end" alignItems="flex-end" lg={12}>
                            <CustomButton id="addmarginright" onClick={handleClose}>Cancel</CustomButton>
                            <CustomButton id="addmarginright" onClick={handleSave}>Save</CustomButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    );
}
