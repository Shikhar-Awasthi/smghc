import { Box, Checkbox, Grid, Paper, Stack, TextField } from "@mui/material";
import { Facebook as FacebookIcon, Instagram as InstagramIcon, YouTube as YouTubeIcon } from "@mui/icons-material";
import React from "react";

function Reels() {
  return (
    <Paper>
      <Stack direction="row">
        <Box>
          <Stack direction={"column"}>
            <Box>
              <Checkbox icon={<FacebookIcon sx={{ color: "#cdcdcd" }} />} checkedIcon={<FacebookIcon sx={{ color: "#1877f2" }} />} />
            </Box>
            <Box>
              <Checkbox icon={<InstagramIcon sx={{ color: "#cdcdcd" }} />} checkedIcon={<InstagramIcon sx={{ color: "#ff7a00" }} />} />
            </Box>
            <Box>
              <Checkbox icon={<YouTubeIcon sx={{ color: "#cdcdcd" }} />} checkedIcon={<YouTubeIcon sx={{ color: "#f00" }} />} />
            </Box>
          </Stack>
        </Box>
        <Box>
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <TextField label="Title" name="title" />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField label="Description" name="description" multiline minRows={2} />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField label="Tags" name="tags" />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Paper>
  );
}

export default Reels;
