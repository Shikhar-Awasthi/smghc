import React, { useCallback, useMemo, useState } from "react";
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, Grid, IconButton, Paper, Radio, RadioGroup, Stack, TextField, Tooltip, Typography } from "@mui/material";
import {
  FacebookOutlined as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  MoreHoriz as MoreHorizIcon,
  MoreVert as MoreVertIcon,
  Pinterest as PinterestIcon,
  Storefront as StorefrontIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { grey } from "@mui/material/colors";

const useStyles = {
  baseStyle: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 16,
    borderColor: "#aecbfa",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#1a73e8",
    outline: "none",
    cursor: "pointer",
    transition: "border .24s ease-in-out",
  },
  focusedStyle: {
    borderColor: "#aecbfa",
  },
  acceptStyle: {
    borderColor: "#00e676",
  },
  rejectStyle: {
    borderColor: "#ff1744",
  },
  thumbsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  thumb: {
    display: "inline-flex",
    flexDirection: "column",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 110,
    height: 110,
    padding: 4,
    boxSizing: "border-box",
    position: "relative",
  },
  thumbInner: {
    display: "flex",
    minWidth: 0,
    height: "100%",
    overflow: "hidden",
  },
  thumbText: {
    fontSize: 10,
    overflow: "hidden",
    height: "1rem",
    whiteSpace: "nowrap",
  },
};
function Post() {
  const classes = useStyles;
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState("gbp");
  const onDrop = useCallback((acceptedFiles) => {
    let newFiles = acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }));
    setFiles(newFiles);
    console.log(newFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } = useDropzone({ onDrop });

  const style = useMemo(
    () => ({ ...classes.baseStyle, ...(isFocused ? classes.focusedStyle : {}), ...(isDragAccept ? classes.acceptStyle : {}), ...(isDragReject ? classes.rejectStyle : {}) }),
    //eslint-disable-next-line
    [isFocused, isDragReject, isDragAccept]
  );

  const changePreview = (e) => {
    setPreview(e.target.value);
  };

  return (
    <Paper>
      <Stack direction="row">
        <Box>
          <Stack direction="column">
            <Box>
              <Checkbox icon={<PinterestIcon sx={{ color: "#cdcdcd" }} />} checkedIcon={<PinterestIcon sx={{ color: "#e60023" }} />} />
            </Box>
            <Box>
              <Checkbox icon={<TwitterIcon sx={{ color: "#cdcdcd" }} />} checkedIcon={<TwitterIcon sx={{ color: "#1D9BF0" }} />} />
            </Box>
            <Box>
              <Checkbox icon={<FacebookIcon sx={{ color: "#cdcdcd" }} />} checkedIcon={<FacebookIcon sx={{ color: "#1877f2" }} />} />
            </Box>
            <Box>
              <Checkbox icon={<InstagramIcon sx={{ color: "#cdcdcd" }} />} checkedIcon={<InstagramIcon sx={{ color: "#ff7a00" }} />} />
            </Box>
            <Box>
              <Checkbox icon={<LinkedInIcon sx={{ color: "#cdcdcd" }} />} checkedIcon={<LinkedInIcon sx={{ color: "#0a66c2" }} />} />
            </Box>
            <Box>
              <Checkbox icon={<StorefrontIcon sx={{ color: "#cdcdcd" }} />} checkedIcon={<StorefrontIcon sx={{ color: "#517ddf" }} />} />
            </Box>
          </Stack>
        </Box>
        <Box hidden>
          <Grid container spacing={2}>
            <div {...getRootProps({ style, className: "dropzone disabled" })}>
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop the files here...</p> : <p>Drag n drop or select the files by clicking</p>}
            </div>
            <aside style={classes.thumbsContainer}>
              {files.map((file, index) => (
                <div style={classes.thumb} key={file.name}>
                  <Tooltip title={file.name}>
                    <div style={classes.thumbInner}>
                      <img src={file.preview} alt="Preview" onLoad={() => URL.revokeObjectURL(file.preview)} />
                    </div>
                  </Tooltip>
                </div>
              ))}
            </aside>
            <Grid item xs={12} sm={12} md={12}>
              <TextField multiline minRows={3} label="Description" fullWidth />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField multiline minRows={2} label="Tags" fullWidth />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField label="Link" fullWidth />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Paper>
            <Stack direction="row" justifyContent={"center"} alignItems="center">
              <RadioGroup row name="preview">
                <Radio icon={<StorefrontIcon />} checkedIcon={<StorefrontIcon sx={{ color: "#517eef" }} />} value="gbp" checked={preview === "gbp"} onChange={changePreview} />
                <Radio icon={<PinterestIcon />} checkedIcon={<PinterestIcon sx={{ color: "#e60023" }} />} value="pin" checked={preview === "pin"} onChange={changePreview} />
                <Radio icon={<InstagramIcon />} checkedIcon={<InstagramIcon sx={{ color: "rgb(229, 60, 95)" }} />} checked={preview === "ig"} value="ig" onChange={changePreview} />
                <Radio icon={<FacebookIcon />} checkedIcon={<FacebookIcon sx={{ color: "#1877f2" }} />} value="fb" checked={preview === "fb"} onChange={changePreview} />
                <Radio icon={<TwitterIcon />} checkedIcon={<TwitterIcon sx={{ color: "#1D9BF0" }} />} value="tw" checked={preview === "tw"} onChange={changePreview} />
              </RadioGroup>
              {/* <IconButton></IconButton> */}
            </Stack>
            <Card sx={{ maxWidth: 400 }} hidden={preview !== "gbp"}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: "#ff7f50" }}>A</Avatar>}
                action={
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                }
                title="Digital Marketing Agency"
                subheader="1 hour ago"
              />
              <CardMedia component={"img"} image="https://lh3.googleusercontent.com/geougc/AF1QipMXEAmCetOMbPEDWbiZj4bhwX2AyssRiW2cV_AW=h305-no" sx={{ aspectRatio: "calc(4 / 3)" }} />
              <CardContent>
                <Typography variant="body2" color="#3c4043">
                  Face mask
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained">Learn more</Button>
              </CardActions>
            </Card>
            <Card sx={{ maxWidth: 400 }} hidden={preview !== "pin"}>
              <CardMedia component={"img"} image="https://lh3.googleusercontent.com/geougc/AF1QipMXEAmCetOMbPEDWbiZj4bhwX2AyssRiW2cV_AW=h305-no" />
              <CardContent>
                <Typography variant="body2" color={"#111"} fontWeight={600}>
                  {"Face mask".substring(0, 50)}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ maxWidth: 400 }} hidden={preview !== "igm"}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: "#ff7f50" }}>A</Avatar>}
                action={
                  <IconButton>
                    <MoreHorizIcon />
                  </IconButton>
                }
                title="Digital Marketing Agency"
              />
              <CardMedia component={"img"} image="https://lh3.googleusercontent.com/geougc/AF1QipMXEAmCetOMbPEDWbiZj4bhwX2AyssRiW2cV_AW=h305-no" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  ADMISSIONS OPEN (Session 2022-23) <br />
                  <br />
                  The Millennium School Sitapur Road Lucknow giving the best Infrastructure and environment to their students for better Growth. <br />
                  <br />
                  Affiliated by C.B.S.E School and Seperate Hostel for Girls and Boys. <br />
                  AVAIL YOUR OFFER
                </Typography>
                <Typography variant="subtitle2" color={grey[400]}>
                  10 days ago
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ maxWidth: 300 }} hidden={preview !== "fb"}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: "#ff7f50" }}>A</Avatar>}
                action={
                  <IconButton>
                    <MoreHorizIcon />
                  </IconButton>
                }
                title="Digital Marketing Agency"
                subheader="1 hour ago"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  ADMISSIONS OPEN (Session 2022-23)
                  <br />
                  <br />
                  The Millennium School Sitapur Road Lucknow giving the best Infrastructure and environment to their students for better Growth.
                  <br />
                  <br />
                  Affiliated by C.B.S.E School and Seperate Hostel for Girls and Boys.
                  <br />
                  AVAIL YOUR OFFER
                  <br />
                  Call Us Now
                </Typography>
              </CardContent>
              <CardMedia component="img" image="https://lh3.googleusercontent.com/geougc/AF1QipMXEAmCetOMbPEDWbiZj4bhwX2AyssRiW2cV_AW=h305-no" />
            </Card>
            <Card sx={{ maxWidth: 400 }} hidden={preview !== "tw"}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: "#ff7f50" }}>A</Avatar>}
                action={
                  <IconButton>
                    <MoreHorizIcon />
                  </IconButton>
                }
                title="Digital Marketing Agency"
                subheader=""
              />
              <CardContent sx={{ ml: 7 }}>
                <Typography variant="body2">
                  ADMISSIONS OPEN (Session 2022-23) <br />
                  <br />
                  The Millennium School Sitapur Road Lucknow giving the best Infrastructure and environment to their students for better Growth. <br />
                  <br />
                  Affiliated by C.B.S.E School and Seperate Hostel for Girls and Boys. <br />
                  <br />
                  AVAIL YOUR OFFER <br />
                  Call Us Now
                </Typography>
              </CardContent>
              <CardMedia sx={{ ml: 9, width: "calc(100% - 72px)" }} component={"img"} image="https://tools.localseotoolsandtips.com/static/media/Unlock.jpg" />
            </Card>
          </Paper>
        </Box>
      </Stack>
    </Paper>
  );
}

export default Post;
