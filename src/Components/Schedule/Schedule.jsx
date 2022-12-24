import React, { useState, useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Chip, ClickAwayListener, Dialog, DialogContent, DialogTitle, Grid, IconButton, Menu, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { CheckBox, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { formatRelative, parseISO } from "date-fns";
import { enUS } from "date-fns/esm/locale";

function Schedule() {
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [openTooltip, setOpenTooltip] = useState(false);
  const [text, setText] = useState({ alt1: "", alt2: "", alt3: "", alt4: "" });

  const openMenu = Boolean(anchorEl);
  const formatRelativeLocale = useMemo(() => ({ lastWeek: "PPp", yesterday: "'Yesterday ' p", today: "'Today ' p", tomorrow: "'Tomorrow ' p", nextWeek: "PPp", other: "PPp" }), []);
  const locale = useMemo(() => ({ ...enUS, formatRelative: (token) => formatRelativeLocale[token] }), []);
  const dayInMonthComparator = useCallback((v1, v2) => parseISO(v1) - parseISO(v2), []);
  const handleTextChange = (event) => {
    setText((pre) => ({ ...pre, [event.target.name]: event.target.value }));
  };

  const columns = useMemo(
    () => [
      {
        field: "image",
        headerName: "Post",
        width: 500,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" position="relative" flexGrow={1} width="100%" py={0.5}>
            <div style={{ height: "40px", width: "60px", backgroundColor: "rgb(207 205 205 / 25%)", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
              <img src={params.value} alt="" style={{ height: "100%", width: "100%" }} />
            </div>
            <div style={{ paddingLeft: "10px", width: "calc(100% - 125px)", overflow: "hidden", whiteSpace: "pre-wrap", height: "100%" }}>
              <Tooltip title={params.data.desciption ? params.data.desciption : params.data.desciption} enterDelay={1000} placement="right" arrow>
                <Typography component="p" fontSize="0.875rem" overflow="hidden" height="100%">
                  {params.row.desciption ? params.row.desciption : ""}
                </Typography>
              </Tooltip>
            </div>
            <div style={{ position: "absolute", right: "-14px" }}>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
          </Stack>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        sortable: false,
        minWidth: 110,
        renderCell: (params) => (
          <Typography textTransform="capitalize">
            <span className={`indicator ${params.value === "published" ? "success" : params.value === "scheduled" ? "warning" : "danger"}`}></span> {params.value}
          </Typography>
        ),
      },
      {
        field: "date",
        headerName: "Date",
        sortable: true,
        minWidth: 170,
        type: "date",
        sortComparator: dayInMonthComparator,
        renderCell: (params) => (
          <Stack>
            <Typography fontSize="small">{formatRelative(parseISO(params.value), new Date(), { locale })}</Typography>
            <Typography fontSize="small" color="InactiveCaptionText">
              {params.row.user}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "impressions",
        headerName: "Impressions",
        type: "number",
      },
      {
        field: "clicks",
        headerName: "Clicks",
        type: "number",
      },
    ],
    []
  );
  const handleShareDialogClose = () => {
    setShareLink("");
    setOpenShareDialog(false);
  };
  const handleShareDialogOpen = () => {
    setOpenShareDialog(true);
    handleMenuClose();
  };
  const deletePost = () => {};
  return (
    <>
      <DataGrid columns={columns} rows={rows} />
      <Menu aria-label="more actions for post" anchorEl={() => {}}>
        <MenuItem>Edit</MenuItem>
        <MenuItem onClick={deletePost}>Delete</MenuItem>
        <MenuItem>Share Url</MenuItem>
        <MenuItem>Share in group</MenuItem>
      </Menu>
      <Dialog open={openShareDialog} maxWidth={"xs"}>
        <DialogTitle>Share</DialogTitle>
        <DialogContent>
          <Box width={400} display={"flex"} alignItems={"center"} flexDirection={"column"}>
            <Stack spacing={1} width={"fit-content"} mb={"40px"}>
              <Chip
                icon={<WhatsAppIcon sx={{ color: "#48c857 !important" }} />}
                label={"WhatsApp"}
                variant={"outlined"}
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(shareLink)}`, "_blank");
                }}
              />
              <Chip
                icon={<FacebookIcon sx={{ color: "#3b579d !important" }} />}
                label={"Facebook"}
                variant={"outlined"}
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, "_blank");
                }}
              />
            </Stack>
            <ClickAwayListener onClickAway={() => setOpenTooltip(false)}>
              <Tooltip title={"Copied"} arrow disableFocusListener disableHoverListener disableTouchListener open={openTooltip} onClose={() => setOpenTooltip(false)}>
                <TextField
                  fullWidth
                  variant={"outlined"}
                  label={"Click to copy"}
                  InputProps={{ readOnly: true }}
                  value={shareLink}
                  onClick={async () => {
                    if ("clipboard" in navigator) {
                      await navigator.clipboard.writeText(shareLink);
                      setOpenTooltip(true);
                    } else {
                      document.execCommand("copy", true, shareLink);
                      setOpenTooltip(true);
                    }
                  }}
                  onMouseLeave={() => setOpenTooltip(false)}
                />
              </Tooltip>
            </ClickAwayListener>
          </Box>
        </DialogContent>
        <DialogActions>
          <Link
            href={shareLink}
            underline={"none"}
            borderColor={"primary"}
            border={1}
            target={"_blank"}
            sx={{
              p: "6px 16px",
              mr: "10px",
              br: "4px",
              fw: "500",
            }}
          >
            View
          </Link>
          <Button onClick={handleShareDialogClose} variant={"contained"}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog>
        <DialogTitle>Groups Sharing</DialogTitle>
        <DialogContent>
          <Box>
            <Stack direction="row">
              <Box flex="1">
                <CheckBox />
              </Box>
              <Box flex="1">
                <Typography variant="body2">{}</Typography>
              </Box>
            </Stack>
          </Box>
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <TextField variant="filled" label="Alternative text 1" value={text.alt1} name="alt1" onChange={handleTextChange} />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField variant="filled" label="Alternative text 2" value={text.alt2} name="alt2" onChange={handleTextChange} />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField variant="filled" label="Alternative text 3" value={text.alt3} name="alt3" onChange={handleTextChange} />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField variant="filled" label="Alternative text 4" value={text.alt4} name="alt4" onChange={handleTextChange} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Schedule;
