import { HowToReg as HowToRegIcon, AttachMoney as AttachMoneyIcon, ContentCopy as ContentCopyIcon, Loyalty as LoyaltyIcon, Sync as SyncIcon, CopyAll as CopyAllIcon } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Alert as MuiAlert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import Plan from "../Plan/Plan";
import { useLocation } from "react-router-dom";
import GBPBM_160_600 from "../../assets/images/gbpgm_160_600.jpg";
import GBPBM_300_250 from "../../assets/images/gbpgm_300_250.jpg";
import GBPBM_336_280 from "../../assets/images/gbpgm_336_280.jpg";
import GBPBM_468_60 from "../../assets/images/gbpgm_468_60.jpg";
import GBPBM_728_90 from "../../assets/images/gbpgm_728_90.jpg";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const dayInMonthComparator = (v1, v2) => {
  return parseISO(v1) - parseISO(v2);
};
const SUBMIT_FILTER_STROKE_TIME = 500;
function InputDateInterval(props) {
  const { item, applyValue, focusElementRef = null } = props;

  const filterTimeout = React.useRef();
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? "");

  const [applying, setIsApplying] = React.useState(false);

  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    const itemValue = item.value ?? [undefined, undefined];
    setFilterValueState(itemValue);
  }, [item.value]);

  const updateFilterValue = (lowerBound, upperBound) => {
    clearTimeout(filterTimeout.current);
    setFilterValueState([lowerBound, upperBound]);

    setIsApplying(true);
    filterTimeout.current = setTimeout(() => {
      setIsApplying(false);
      applyValue({ ...item, value: [lowerBound, upperBound] });
    }, SUBMIT_FILTER_STROKE_TIME);
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "end",
        height: 48,
        pl: "20px",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="From"
          value={filterValueState[0]}
          onChange={(newValue) => {
            updateFilterValue(newValue, filterValueState[1]);
          }}
          renderInput={(params) => <TextField {...params} variant="standard" />}
          name="lower-bound-input"
          inputRef={focusElementRef}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="To"
          value={filterValueState[1]}
          onChange={(newValue) => {
            updateFilterValue(filterValueState[0], newValue);
          }}
          renderInput={(params) => <TextField {...params} variant="standard" InputProps={applying ? { endAdornment: <SyncIcon /> } : {}} />}
          name="upper-bound-input"
        />
      </LocalizationProvider>
    </Box>
  );
}
function Affiliate({ width, height, src, affiliateurl, mt, snackBarOpen }) {
  const [openCode, setOpenCode] = useState(false);

  const handleToggleCode = () => {
    setOpenCode((pre) => !pre);
  };
  const handleCopyClick = async () => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(`https://tools.localseotoolsandtips.com/ref/${affiliateurl}`);
    } else {
      document.execCommand("copy", true, `https://tools.localseotoolsandtips.com/ref/${affiliateurl}`);
    }
    snackBarOpen("Link copied to clipboard");
  };
  const handleCodeClick = async (e) => {
    try {
      e.target?.select();
    } catch (_) {}
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(e.target.value);
    } else {
      document.execCommand("copy", true, e.target.value);
    }
    snackBarOpen("Code copied to clipboard");
  };
  return (
    <Box p="5px 10px" border={"1px solid #e3e3e3"} borderRadius={"4px"} mt={mt}>
      <Typography fontWeight={700} fontSize="small">
        Image banner
      </Typography>
      <Grid container mt={1.25}>
        <Grid sm={6} md={6} xs={12} item>
          <Typography fontWeight={700} fontSize="small">
            Banner Name:{" "}
            <Typography fontWeight={"400"} fontSize="small" component="span" ml={"50px"}>
              GBPGM {width} x {height}
            </Typography>
          </Typography>
        </Grid>
        <Grid sm={6} md={6} xs={12} item>
          <Typography fontWeight={700} fontSize="small">
            Target:{" "}
            <Typography fontWeight={"400"} fontSize="small" component="span" ml={"50px"}>
              https://tools.localseotoolsandtips.com
            </Typography>
          </Typography>
        </Grid>
      </Grid>
      <Box mt={2} textAlign="center">
        <a href={`https://tools.localseotoolsandtips.com/ref/${affiliateurl}`} target={"_blank"}>
          <img src={src} alt={`GBPGM_${width}_${height}`} style={{ maxWidth: "100%", maxHeight: "100px" }} />
        </a>
      </Box>
      <Box display={"flex"} justifyContent="center" my={1.25}>
        <Button variant="outlined" size="small" onClick={handleToggleCode}>
          {openCode ? "Hide" : "Show"} banner code
        </Button>
        <Button variant="outlined" onClick={handleCopyClick} sx={{ ml: 1.5 }}>
          Get Link
        </Button>
      </Box>
      <Collapse in={openCode}>
        <TextField
          multiline
          fullWidth
          value={`<a href="https://tools.localseotoolsandtips.com/ref/${affiliateurl}" target="_top"><img src="//tools.localseotoolsandtips.com/${src}" alt="" title="" width="${width}" height="${height}" /></a>`}
          readOnly
          spellCheck={false}
          onClick={handleCodeClick}
          helperText="Copy & Paste this code to your page to get the banner displayed"
          FormHelperTextProps={{ sx: { textAlign: "center" } }}
        />
      </Collapse>
    </Box>
  );
}
function MyAccount() {
  const [user, setUser] = useState({ country: 1, upi: "", pan: "" });
  const [showEnableAffiliateButton, setShowEnableAffiliateButton] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("Error occurred.");
  const [rows, setRows] = useState([
    { id: 1, date: "2022-02-04 09:13:55", name: "Annu J" },
    {
      id: 2,
      date: "2022-04-09 06:43:42",
      name: "Shikhar Awasthi",
    },
  ]);
  const [tabValue, setTabValue] = useState(0);
  const [filterModel, setFilterModel] = useState({
    items: [{}],
  });
  const location = useLocation();
  useEffect(() => {
    if (location.hash.includes("#plan")) {
      setTabValue(2);
    }
    axios
      .get("/getUser")
      .then((response) => {
        setUser({ ...response.data, country: 1 });
        setShowEnableAffiliateButton(!Boolean(response.data.affiliate));
        if (location.hash === "#affiliate" && Boolean(response.data.affiliate)) {
          setTabValue(3);
        }
        setDisabled(Boolean(response.data.upi));
      })
      .catch((_) => {});
  }, []);
  const handleSnackBarOpen = (message) => {
    setSuccessMessage(message);
    setSnackBarOpen(true);
  };
  const handleSnackBarClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };
  const handleErrorSnackBarOpen = (message) => {
    if (message) setErrorMessage(message);
    setErrorSnackBarOpen(true);
  };
  const handleErrorSnackBarClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorSnackBarOpen(false);
    setErrorMessage("Error occurred.");
  };
  const handleDataChange = (event) => setUser({ ...user, [event.target.name]: event.target.value });
  const handlesaveAffDetail = () => {
    axios
      .post("/saveAffDetail", user)
      .then((_) => {
        setDisabled(true);
        handleSnackBarOpen("Details saved.");
      })
      .catch((_) => {
        handleErrorSnackBarOpen();
      });
  };
  const handleEnableAffiliate = () => {
    axios
      .post("/enableAffiliate")
      .then((_) => {
        setShowEnableAffiliateButton(false);
      })
      .catch((_) => {
        handleErrorSnackBarOpen();
      });
  };
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="container">
      <Grid container>
        <Grid item xs={12} sm={12} md={12} mb={"20px"}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary" aria-label="Google Posts Upload">
            <Tab label="My account" value={0} />
            {!showEnableAffiliateButton && <Tab label="Affiliate" value={1} />}
            <Tab label="Plan" value={2} />
          </Tabs>
        </Grid>
        {tabValue === 0 && (
          <Grid item xs={12} sm={6} md={6}>
            <Stack flexDirection={"row"} alignItems="center" flexWrap={"wrap"} mb={5}>
              <Box>
                <Avatar alt={user.name} src={user.image} sx={{ width: 100, height: 100 }} />
              </Box>
              <Box ml={5} mt={0.5} width={"max-content"}>
                <Grid container spacing={1}>
                  <Grid width={"100%"} pl={1}>
                    <Box>
                      <Typography component="span" fontSize="small">
                        Name
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="span" fontWeight={600}>
                        {user.name}
                      </Typography>
                    </Box>
                    <Divider />
                  </Grid>
                  <Grid width={"100%"} pl={1}>
                    <Box>
                      <Typography component="span" fontSize="small">
                        Email
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="span" fontWeight={600}>
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider />
                  </Grid>
                </Grid>
                {showEnableAffiliateButton && (
                  <>
                    <Stack flexDirection="row" mt={2} justifyContent="space-between" alignItems={"center"}>
                      <Typography component={"span"} variant="h5" fontWeight={600}>
                        Want to earn?
                      </Typography>
                      <Button variant="contained" sx={{ borderRadius: "40px" }} onClick={handleEnableAffiliate}>
                        Enable affiliate
                      </Button>
                    </Stack>
                  </>
                )}
              </Box>
            </Stack>
            {disabled && (
              <Box>
                <FormControl sx={{ mt: 1, width: "100%" }}>
                  <Input
                    id="affiliateLink"
                    value={`https://tools.localseotoolsandtips.com/ref/${user.affiliateurl}`}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Copy affiliate link"
                          onClick={async () => {
                            if ("clipboard" in navigator) {
                              await navigator.clipboard.writeText(`https://tools.localseotoolsandtips.com/ref/${user.affiliateurl}`);
                            } else {
                              document.execCommand("copy", true, `https://tools.localseotoolsandtips.com/ref/${user.affiliateurl}`);
                            }
                          }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>
            )}
          </Grid>
        )}
        {!showEnableAffiliateButton && tabValue === 0 && (
          <Grid item xs={12} sm={6} md={6}>
            <Stack>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="Country">Country</InputLabel>
                  <Select id="Country" label="Country" value={user.country} onChange={handleDataChange} name="country" disabled={disabled}>
                    <MenuItem value={1}>India</MenuItem>
                    <MenuItem value={0}>Other than India</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {user.country === 1 && (
                <Box>
                  <TextField label="PAN number" fullWidth margin="dense" inputProps={{ maxLength: 10 }} value={user.pan} name="pan" onChange={handleDataChange} required disabled={disabled} />
                </Box>
              )}
              <Box>
                <TextField
                  label={user.country === 1 ? "UPI ID" : "Paypal email"}
                  fullWidth
                  margin="dense"
                  value={user.upi}
                  name="upi"
                  onChange={handleDataChange}
                  inputProps={{ maxLength: 70 }}
                  required
                  disabled={disabled}
                />
              </Box>
              {!disabled && (
                <Button variant="contained" onClick={handlesaveAffDetail}>
                  Save
                </Button>
              )}
            </Stack>
          </Grid>
        )}
        {tabValue === 0 && (
          <Typography color="darkblue" component="p">
            Enable Affiliate, get your tracking link, share with your network and earn 25% - 40% of each new subscription that comes through your link. You can get Loyalty Bonus too..
          </Typography>
        )}
      </Grid>
      {!showEnableAffiliateButton && tabValue === 1 && (
        <>
          <Stack flexDirection="row" mt={3} justifyContent="space-between" flexWrap={"wrap"} rowGap={1}>
            <Button variant="contained" endIcon={<HowToRegIcon />} color="success">
              {user.regCount} Registered
            </Button>
            <Button variant="contained" color="warning">
              {user.conCount} Converted
            </Button>
            <Button variant="contained" endIcon={<LoyaltyIcon />}>
              Loyalty Bonus
            </Button>
          </Stack>
          <Paper sx={{ mt: "20px" }} hidden>
            <Stack width={"100%"} flexDirection="row" justifyContent={"space-between"} flexWrap="wrap">
              <Box flexGrow={1} textAlign="center" p={2} maxWidth="30%" sx={{ cursor: "pointer" }}>
                <Typography fontWeight={600}>Available</Typography>
                <Typography fontSize="small">Autopay on 15 of every month when reaches {user.country === 1 ? "₹1000" : "100$"}</Typography>
              </Box>
              <Box flexGrow={1} textAlign="center" p={2} maxWidth="30%" sx={{ cursor: "pointer" }}>
                <Typography fontWeight={600}>Upcoming</Typography>
              </Box>
              <Box flexGrow={1} textAlign="center" p={2} maxWidth="30%" sx={{ cursor: "pointer" }}>
                <Typography fontWeight={600}>Paid</Typography>
              </Box>
            </Stack>
          </Paper>
          <Typography component={"h4"} variant="h4" textAlign={"center"} mt={3}>
            Promotional Banners
          </Typography>
          <Affiliate width={728} height={90} src={GBPBM_728_90} affiliateurl={user.affiliateurl} key={"728_90"} mt={1} snackBarOpen={handleSnackBarOpen} />
          <Affiliate width={468} height={60} src={GBPBM_468_60} affiliateurl={user.affiliateurl} key={"468_60"} mt={0} snackBarOpen={handleSnackBarOpen} />
          <Affiliate width={336} height={280} src={GBPBM_336_280} affiliateurl={user.affiliateurl} key={"336_280"} mt={0} snackBarOpen={handleSnackBarOpen} />
          <Affiliate width={300} height={250} src={GBPBM_300_250} affiliateurl={user.affiliateurl} key={"300_250"} mt={0} snackBarOpen={handleSnackBarOpen} />
          <Affiliate width={160} height={600} src={GBPBM_160_600} affiliateurl={user.affiliateurl} key={"160_600"} mt={0} snackBarOpen={handleSnackBarOpen} />
        </>
      )}
      {tabValue === 2 && <Plan />}
      <Snackbar open={snackBarOpen} onClose={handleSnackBarClose} autoHideDuration={5000}>
        <Alert onClose={handleSnackBarClose} severity={"success"} sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackBarOpen} onClose={handleErrorSnackBarClose} autoHideDuration={5000}>
        <Alert onClose={handleErrorSnackBarClose} severity={"error"} sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Dialog open={false} maxWidth="lg" fullWidth={true}>
        <DialogTitle>Registered</DialogTitle>
        <DialogContent>
          <Box>
            <DataGrid
              rows={rows}
              columns={[
                { field: "name", headerName: "Name", flex: 2 },
                {
                  field: "date",
                  headerName: "Date",
                  type: "date",
                  flex: 1,
                  valueFormatter: ({ value }) => format(parseISO(value), "dd-MMM-yyyy"),
                  sortComparator: dayInMonthComparator,
                  filterOperators: [
                    {
                      label: "Between",
                      value: "between",
                      getApplyFilterFn: (filterItem) => {
                        if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
                          return null;
                        }
                        if (filterItem.value[0] == null || filterItem.value[1] == null) {
                          return null;
                        }
                        return ({ value }) => {
                          return value !== null && filterItem.value[0] <= parseISO(value) && parseISO(value) <= filterItem.value[1];
                        };
                      },
                      InputComponent: InputDateInterval,
                    },
                  ],
                },
              ]}
              filterModel={filterModel}
              onFilterModelChange={(model) => setFilterModel(model)}
              autoHeight
            />
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MyAccount;
