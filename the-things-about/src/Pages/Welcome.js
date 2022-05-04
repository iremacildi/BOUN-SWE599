import { useEffect, useState } from 'react'
import { Button, Grid, Typography, Link } from '@mui/material';
import logo from '../img/TTAlogo.png'
import LightButton from '../Components/LightButton';

function Welcome() {

  return (
    <Grid container className="center" spacing={2} columns={16} direction="row" alignItems="center">
      <Grid>
        <Grid container item lg={16} justifyContent="center" alignItems="center" id="addmargin">
          <img width="200" src={logo} alt="TTA Logo" />
        </Grid>
        <Grid container item lg={16} justifyContent="center" alignItems="center" id="addmargin">
          <Typography align="center">
            Save and tag your bookmarks or add comments. <br />
            Then find the things about the keywords you searched.
          </Typography>
        </Grid>
        <Grid container item lg={16} justifyContent="center" alignItems="center" id="addmargin">
          <LightButton href="/login">Login</LightButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Welcome;