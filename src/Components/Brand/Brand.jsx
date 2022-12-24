import { Autocomplete, Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Countries from "../../Utils/Countries";
import Error from "../Error/Error";

function Brand() {
  const [country, setCountry] = useState(null);
  return (
    <ErrorBoundary FallbackComponent={<Error />}>
      <Box>
        <Grid container>
          <Grid item xs={12} sm={6} md={6}>
            <Autocomplete
              id="country"
              options={Countries}
              autoHighlight
              sx={{ width: 247 }}
              value={country}
              getOptionLabel={(option) => option.name}
              name="country"
              onChange={(_, newValue) => {
                setCountry(newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                  {option.name}
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label="Your country" inputProps={{ ...params.inputProps, autoComplete: "new-password" }} required />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl>
              <InputLabel id="businessType">Business Type</InputLabel>
              <Select labelId="businessType" label="Business Type">
                <MenuItem value={1}>Coaching</MenuItem>
                <MenuItem value={2}>College</MenuItem>
                <MenuItem value={3}>Digital Marketing Agency</MenuItem>
                <MenuItem value={4}>E-commerce</MenuItem>
                <MenuItem value={5}>Freelancer</MenuItem>
                <MenuItem value={6}>Large Business</MenuItem>
                <MenuItem value={7}>School</MenuItem>
                <MenuItem value={8}>Small Business</MenuItem>
                <MenuItem value={9}>Startup</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField type="number" label="Number of accounts you use" />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl>
              <InputLabel id="whereFoundUs">Where did you found us?</InputLabel>
              <Select labelId="whereFoundUs" label="Where did you found us?">
                <MenuItem value={1}>Google</MenuItem>
                <MenuItem value={2}>Facebook</MenuItem>
                <MenuItem value={3}>Youtube</MenuItem>
                <MenuItem value={4}>Friends</MenuItem>
                <MenuItem value={5}>LinkedIn</MenuItem>
                <MenuItem value={6}>Pinterest</MenuItem>
                <MenuItem value={7}>Email</MenuItem>
                <MenuItem value={8}>WhatsApp</MenuItem>
                <MenuItem value={9}>Instagram</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </ErrorBoundary>
  );
}

export default Brand;
