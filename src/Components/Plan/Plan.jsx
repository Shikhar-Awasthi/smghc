import {
  Alert as MuiAlert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SelectUnstyled from "@mui/base/SelectUnstyled";
import OptionUnstyled from "@mui/base/OptionUnstyled";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Plan.css";
import { Countries } from "../../utils/Countries";
import { Upgrade as UpgradeIcon } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Stripe from "./Stripe";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const StyledButton = styled("button")(
  ({ theme }) => `
  box-sizing: border-box;
  background: #f7f7f7;
  border: 1px solid transparent;
  text-align: left;
  cursor:text !important;
  padding: 0 2px;
  color:#8f8f8f;
  line-height: normal;
  font-family: "Roboto","Helvetica","Arial",sans-serif;
  font-size:13.3333px;
  `
);
const StyledListbox = styled("ul")(
  ({ theme }) => `
  box-sizing: border-box;
  padding: 5px;
  margin: 0;
  background: #fff;
  border: 1px solid transparent;
  outline: 0px;
  `
);
const StyledOption = styled(OptionUnstyled)(
  ({ theme }) => `
  list-style: none;
  padding: 4px;
  cursor: default;
  `
);
const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
`;
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
function CustomSelect(props) {
  const components = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} components={components} />;
}
let states = [];
function Plan() {
  const [plans, setPlans] = useState([]);
  const [addOn, setAddOn] = useState([]);
  const [monthly, setMonthly] = useState(false);
  const [prePlan, setPrePlan] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("Error occurred.");
  const [value, setValue] = useState("USD");
  const [showCurrPopup, setShowCurrPopup] = useState(false);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const [checkout, setCheckout] = useState({ agencyName: "", billingName: "", addressLine1: "", addressLine2: "", country: null, state: null, city: "", gstin: "", code: "", plan: 2 });
  const [coupon, setCoupon] = useState("");
  const [planID, setPlanID] = useState("");
  const [openUpgradePlanDialog, setUpgradePlanDialog] = useState(false);
  const [disableMonthlyToggle, setDisableMonthlyToggle] = useState(false);
  const [rechargeMessage, setRechargeMessage] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [openAddonDialog, setOpenAddonDialog] = useState(false);
  const [addOnsAdded, setaddOnsAdded] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [stripePopup, setStripePopup] = useState(false);
  const [amount, setAmount] = useState(null);

  const appearance = {
    theme: "flat",
    variables: {
      colorPrimary: "#264C7E",
      fontFamily: "Roboto, sans-serif",
    },
  };
  const options = { clientSecret, appearance };

  const handleCloseStripePopup = () => setStripePopup(false);
  const handleOpenStripePopup = () => setStripePopup(true);
  const handleShowUpgradePlanDialog = (index) => {
    if (prePlan[index]["leftDay"] <= 0) {
      handleErrorSnackBarClose("You cannot upgrade recharge. Consider doing a new recharge");
      return;
    }
    setPlanID(prePlan[index]["ID"]);
    if (prePlan[index]["Total"] > 364) {
      setDisableMonthlyToggle(true);
    } else {
      setDisableMonthlyToggle(false);
    }
    let message = "";
    let amount = (prePlan[index]["RechargeAmt"] / prePlan[index]["Total"]) * prePlan[index]["leftDay"];
    message = `${prePlan[index]["leftDay"]} day(s) has been left in your recharge. So, remainig ${amount.toFixed(2)} ${value} will be adjusted as discount in this recharge.`;
    setRechargeMessage(message);
    setUpgradePlanDialog(true);
  };
  const handleCloseUpgradePlanDialog = () => {
    setUpgradePlanDialog(false);
    setRechargeMessage("");
    setPlanID("");
  };
  const handleShowAddonDialog = (index) => {
    let message = "";
    message = "You will be charged on pro-rata basis.";
    setRechargeMessage(message);
    setOpenAddonDialog(true);
  };
  const handleCloseAddonDialog = () => {
    setOpenAddonDialog(false);
    setRechargeMessage("");
    setaddOnsAdded("");
  };
  const handleShowCheckoutDialog = (type) => {
    if (type === "Individual") {
      setCheckout((checkout) => ({ ...checkout, plan: 1 }));
    } else {
      setCheckout((checkout) => ({ ...checkout, plan: 2 }));
    }
    setCheckout((checkout) => ({
      ...checkout,
      type: monthly ? 1 : 2,
      coupon: "",
      amount: monthly ? (value === "INR" ? plans[checkout.plan].MonthlyINR : plans[checkout.plan].MonthlyUSD) : value === "INR" ? plans[checkout.plan].AnnualINR : plans[checkout.plan].AnnualUSD,
    }));
    setOpenCheckoutDialog(true);
  };
  const handleCloseCheckoutDialog = () => setOpenCheckoutDialog(false);
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
  const handleCheckoutChange = (event) => {
    setCheckout({ ...checkout, [event.target.name]: event.target.value });
  };
  const handleCheckout = () => {
    if (value === "USD" && checkout.country.code === "IN") {
      handleErrorSnackBarOpen("Address should be of outside India.");
      return;
    }
    setCheckingOut(true);
    axios
      .post("/google/createOrder", { ...checkout, currency: value })
      .then((response) => {
        if (response.data.message === "success") {
          let { orderID, amount, clientSecret } = response.data;
          if (orderID) {
            const options = {
              key: "rzp_live_kxlWk07JP1XdXS",
              amount,
              currency: value,
              name: "Local Seo Tools and Tips",
              description: `${checkout.type === 1 ? "Monthly" : "Yearly"} Recharge`,
              image: "https://tools.localseotoolsandtips.com/static/media/localseotoolsandtips.ddb3d274.png",
              order_id: orderID,
              handler: function (response) {
                axios
                  .post("/google/handlePayment", { response })
                  .then((_) => {
                    handleSnackBarOpen("Recharge Successful.");
                    handleCloseCheckoutDialog();
                    setCoupon(null);
                  })
                  .catch((_) => {
                    handleErrorSnackBarOpen();
                  });
              },
              prefill: {
                name: "",
                email: "",
              },
              notes: {},
              theme: {
                color: "#264c7e",
              },
            };
            handleCloseCheckoutDialog();
            let razorpay = new window.Razorpay(options);
            razorpay.open();
          } else if (clientSecret) {
            setAmount(amount);
            setClientSecret(clientSecret);
            handleOpenStripePopup();
            handleCloseCheckoutDialog();
          } else {
            handleSnackBarOpen("Recharge successful.");
            handleCloseCheckoutDialog();
            setCoupon(null);
          }
        } else {
          handleErrorSnackBarOpen();
        }
        setCheckingOut(false);
      })
      .catch((_) => {
        handleErrorSnackBarOpen();
        setCheckingOut(false);
      });
  };
  const upgradePlan = () => {
    if (planID) {
      setCheckingOut(true);
      axios
        .post("/google/upgradePlan", { planID, monthly })
        .then((response) => {
          setCheckingOut(false);
          if (response.data.message === "success") {
            let { amount, currency, orderID } = response.data;
            const options = {
              key: "rzp_test_LDhVYXzOiEtwSd",
              amount,
              currency,
              name: "Local Seo Tools and Tips",
              description: `${monthly ? "Monthly" : "Yearly"} Recharge`,
              image: "https://tools.localseotoolsandtips.com/static/media/localseotoolsandtips.ddb3d274.png",
              order_id: orderID,
              handler: function (response) {
                axios
                  .post("/google/handlePayment", { response })
                  .then((_) => {
                    handleSnackBarOpen("Plan upgrade Successful.");
                    handleCloseCheckoutDialog();
                    handleCloseUpgradePlanDialog();
                    setCoupon(null);
                  })
                  .catch((_) => {
                    handleErrorSnackBarOpen();
                  });
              },
              prefill: {
                name: "",
                email: "",
              },
              notes: {},
              theme: {
                color: "#264c7e",
              },
            };
            let razorpay = new window.Razorpay(options);
            razorpay.open();
          } else {
            handleErrorSnackBarOpen(response.data.message);
          }
        })
        .catch((_) => {
          setCheckingOut(false);
          handleErrorSnackBarOpen();
        });
    }
  };
  const addAddons = () => {
    if (typeof addOnsAdded === "number" && addOnsAdded > 0) {
      setCheckingOut(true);
      axios
        .post("/google/addAddOn", { addOnsAdded })
        .then((response) => {
          if (response.data.message === "success") {
            let { amount, currency, orderID } = response.data;
            const options = {
              key: "rzp_test_LDhVYXzOiEtwSd",
              amount,
              currency,
              name: "Local Seo Tools and Tips",
              description: `Addons recharge`,
              image: "https://tools.localseotoolsandtips.com/static/media/localseotoolsandtips.ddb3d274.png",
              order_id: orderID,
              handler: function (response) {
                axios
                  .post("/google/handlePayment", { response })
                  .then((_) => {
                    handleSnackBarOpen("Addon added successfully.");
                    handleCloseCheckoutDialog();
                    handleCloseUpgradePlanDialog();
                    handleCloseAddonDialog();
                    setCoupon(null);
                  })
                  .catch((_) => {
                    handleErrorSnackBarOpen();
                  });
              },
              prefill: {
                name: "",
                email: "",
              },
              notes: {},
              theme: {
                color: "#264c7e",
              },
            };
            let razorpay = new window.Razorpay(options);
            razorpay.open();
          } else {
            handleErrorSnackBarOpen(response.data.message);
          }
          setCheckingOut(false);
        })
        .catch((_) => {
          setCheckingOut(false);
          handleErrorSnackBarOpen();
        });
    } else {
      handleErrorSnackBarOpen("Enter valid number of locations to add.");
    }
  };
  useEffect(() => {
    if (checkout.code) {
      axios
        .post("/verifyCouponCode", { code: checkout })
        .then((response) => {
          if (response.data.message === "success") {
            checkout.amount -= (checkout.amount * response.data.discount) / 100;
          } else {
            handleErrorSnackBarOpen(response.data.message);
            setCheckout((checkout) => ({
              ...checkout,
              amount: monthly
                ? value === "INR"
                  ? plans[checkout.plan].MonthlyINR
                  : plans[checkout.plan].MonthlyUSD
                : value === "INR"
                ? plans[checkout.plan].AnnualINR
                : plans[checkout.plan].AnnualUSD,
            }));
            setCheckout((checkout) => ({ ...checkout, coupon: undefined }));
          }
        })
        .catch((_) => {});
    } else {
      if (plans.length > 0)
        setCheckout((checkout) => ({
          ...checkout,
          amount: monthly ? (value === "INR" ? plans[checkout.plan].MonthlyINR : plans[checkout.plan].MonthlyUSD) : value === "INR" ? plans[checkout.plan].AnnualINR : plans[checkout.plan].AnnualUSD,
        }));
    }
  }, [checkout.code]);
  useEffect(() => {
    if (checkout.country) {
      axios
        .get(`/google/getStates/${checkout.country.code}`)
        .then((response) => {
          states = response.data;
          setCheckout((checkout) => ({ ...checkout, city: "" }));
        })
        .catch((_) => {});
    }
  }, [checkout.country]);
  useEffect(() => {
    axios
      .get("/google/getPlans")
      .then((response) => {
        let { data, coupon, plan, addOn, currency } = response.data;
        if (coupon) {
          setCoupon(coupon);
        }
        if (plan) {
          setPrePlan(plan);
        }
        if (addOn) {
          setAddOn(addOn);
        }
        setValue(currency);
        setPlans(data);
      })
      .catch((_) => handleErrorSnackBarOpen());
    let script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.head.prepend(script);
    let seach = document.location.hash;
    if (seach && seach.includes("message=")) {
      switch (seach.split("=")[1]) {
        case "success":
          handleSnackBarOpen("Recharge succeeded!");
          break;
        case "processing":
          handleErrorSnackBarOpen("Your payment is processing.");
          break;
        case "require-payment":
          handleErrorSnackBarOpen("Your payment was not successful, please try again.");
          break;

        default:
          handleErrorSnackBarOpen("Something went wrong. Error");
          break;
      }
    }
  }, []);

  return (
    <div className="menu-Container">
      <div className="menu-Content">
        <Box width="100%" mt={"50px"}>
          {prePlan.length > 0 && (
            <TableContainer component={Paper} sx={{ maxHeight: "136px", width: "90%", mx: "auto" }}>
              <Table stickyHeader size="small" aria-label="previous recharges">
                <TableHead>
                  <TableRow>
                    <TableCell>Plan name</TableCell>
                    <TableCell align="right">Recharge date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Start date</TableCell>
                    <TableCell align="right">End date</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prePlan.map((plan, index) => (
                    <TableRow key={plan.ID} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component={"th"} scope="row">
                        {plan.PlanName}{" "}
                        {plan.Active === 1 && (
                          <Typography component="span" fontStyle={"italic"} fontSize="small">
                            (Active)
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{plan.Date}</TableCell>
                      <TableCell align="right">{plan.RechargeAmt}</TableCell>
                      <TableCell align="right">{plan.discount}</TableCell>
                      <TableCell align="right">{plan.StartDate}</TableCell>
                      <TableCell align="right">{plan.EndDate}</TableCell>
                      <TableCell align="center">
                        {plan.showUpgrade === 1 && (
                          <Tooltip title="Upgrade plan" placement="right">
                            <IconButton color="secondary" onClick={() => handleShowUpgradePlanDialog(index)}>
                              <UpgradeIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Stack alignItems={"center"} p={3} pb={0}>
            <Box
              width="360px"
              height="80px"
              sx={{ background: "#e1e1e7", color: "#000", borderRadius: "999px", cursor: "pointer" }}
              display="flex"
              flexDirection={"row"}
              justifyContent="space-between"
              p={"0.5rem 0.75rem"}
            >
              <Box width="100%" display="flex" alignItems={"center"} justifyContent="center" sx={{ borderRadius: "999px" }} className={monthly ? "active" : ""} onClick={() => setMonthly(true)}>
                Monthly
              </Box>
              <Box
                width="100%"
                display="flex"
                alignItems={"center"}
                justifyContent="center"
                sx={{ borderRadius: "999px" }}
                className={!monthly ? "active" : ""}
                flexDirection="column"
                onClick={() => setMonthly(false)}
              >
                Annually
                <Typography component={"span"} variant="subtitle1" fontSize="small">
                  Save 25% + 1 month extra
                </Typography>
              </Box>
            </Box>
          </Stack>
          <Stack justifyContent={"center"} flexDirection="row" pb={3}>
            <Typography component={"span"} fontSize="small" color={"#8f8f8f"}>
              *prices based on
            </Typography>
            <CustomSelect
              value={value}
              onChange={(event) => {
                setValue(event);
                setShowCurrPopup(false);
              }}
              listboxOpen={showCurrPopup}
              onDoubleClick={() => setShowCurrPopup(true)}
            >
              <StyledOption value={"USD"}>USD</StyledOption>
              <StyledOption value={"INR"}>INR</StyledOption>
            </CustomSelect>
          </Stack>
          {coupon && (
            <Box display={"flex"} justifyContent="center">
              <Tooltip title="Copied" placement="right" followCursor>
                <Typography color="darkmagenta" textAlign={"center"} onClick={() => navigator.clipboard.writeText(coupon.code)}>
                  You have a {coupon.discount}% discount code {coupon.code} for a plan {coupon.plan} {coupon.recharge}. Click to copy
                </Typography>
              </Tooltip>
            </Box>
          )}
          <Stack flexDirection="row" flexWrap={"wrap"} width="100%" justifyContent={"center"} gap={3}>
            {plans.map((plan) => (
              <Paper sx={{ p: 2, borderRadius: "10px", width: 312 }} key={plan.key} elevation={6}>
                <Box textAlign={"center"}>
                  <Typography component={"span"} variant="h5" color={"primary"}>
                    {plan.Name}
                  </Typography>
                  <br />
                  <Typography component={"h6"} variant="h6">
                    {monthly ? (value === "INR" ? `₹${plan.MonthlyINR}` : `$${plan.MonthlyUSD}`) : value === "INR" ? `₹${plan.AnnualINR}` : `$${plan.AnnualUSD}`}
                  </Typography>
                  {plan.Name !== "Free" ? (
                    <Button variant={"contained"} sx={{ mt: 2, borderRadius: "18px" }} onClick={() => handleShowCheckoutDialog(plan.Name)}>
                      Get {plan.Name}
                    </Button>
                  ) : (
                    <div style={{ marginTop: 16, height: "36.5px" }}></div>
                  )}
                </Box>
                <Box>
                  <List>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={feature.Description} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Paper>
            ))}
          </Stack>
          <Stack flexDirection="row" flexWrap={"wrap"} width={"100%"} justifyContent="center" columnGap={3} mt={4}>
            {addOn.map((add) => (
              <Paper sx={{ p: 2, borderRadius: "10px", width: 312 }} key={add.key} elevation={6}>
                <Box textAlign={"center"}>
                  <Typography component={"span"} variant="h5" color={"primary"}>
                    {add.Name}
                  </Typography>
                  <br />
                  <Typography component={"h6"} variant="h6">
                    {monthly ? (value === "INR" ? `₹${add.MonthlyINR}` : `$${add.MonthlyUSD}`) : value === "INR" ? `₹${add.AnnualINR}` : `$${add.AnnualUSD}`}{" "}
                    <Typography variant="body2" component={"span"}>
                      /location
                    </Typography>
                  </Typography>
                  <Button variant={"contained"} sx={{ mt: 2, borderRadius: "18px" }} onClick={handleShowAddonDialog}>
                    {add.Name}
                  </Button>
                </Box>
              </Paper>
            ))}
          </Stack>
          <Typography component="p" color="darkblue" mt={1.5}>
            Get 25% Discount when you subscribe Annual Plan + 1 Month FREE
          </Typography>
          <Typography component="p" color="darkblue">
            If you need more locations and users you can add anytime only to the Individual or Agency Plan
          </Typography>
        </Box>
      </div>
      <Dialog open={openCheckoutDialog} onClose={handleCloseCheckoutDialog} maxWidth={"xs"}>
        <DialogTitle>Checkout Details</DialogTitle>
        <DialogContent sx={{ pt: 2.5, mb: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} sm={12}>
              <TextField fullWidth label="Agency Name" name="agencyName" onChange={handleCheckoutChange} value={checkout.agencyName} margin="dense" required />
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <TextField fullWidth label="Billing Name" name="billingName" onChange={handleCheckoutChange} value={checkout.billingName} required />
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <TextField fullWidth label="Address Line 1" name="addressLine1" onChange={handleCheckoutChange} value={checkout.addressLine1} required />
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <TextField fullWidth label="Address Line 2" name="addressLine2" onChange={handleCheckoutChange} value={checkout.addressLine2} />
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <Autocomplete
                id="country"
                options={Countries}
                autoHighlight
                value={checkout.country}
                getOptionLabel={(option) => option.name}
                name="country"
                onChange={(_, newValue) => {
                  setCheckout({ ...checkout, country: newValue });
                }}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => <TextField {...params} label="Country" inputProps={{ ...params.inputProps, autoComplete: "new-password" }} required />}
              />
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <Autocomplete
                id="state"
                options={states}
                autoHighlight
                value={checkout.state}
                getOptionLabel={(option) => option.name}
                name="state"
                onChange={(_, newValue) => {
                  setCheckout({ ...checkout, state: newValue });
                }}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => <TextField {...params} label="State" inputProps={{ ...params.inputProps, autoComplete: "new-password" }} required />}
              />
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <TextField fullWidth label="City" name="city" onChange={handleCheckoutChange} value={checkout.city} required />
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <TextField fullWidth label="GSTIN" name="gstin" onChange={handleCheckoutChange} value={checkout.gstin} />
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <TextField fullWidth label="Have a coupon?" name="code" onChange={handleCheckoutChange} value={checkout.coupon} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseCheckoutDialog}>
            Cancel
          </Button>
          <Box position={"relative"} mx="15px">
            <Button variant="contained" onClick={handleCheckout} disabled={checkingOut}>
              Checkout
            </Button>
            {checkingOut && (
              <CircularProgress
                size={24}
                sx={{
                  color: blue,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
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
      <Dialog open={openUpgradePlanDialog} onClose={handleCloseUpgradePlanDialog}>
        <DialogTitle>Upgrade plan</DialogTitle>
        <DialogContent>
          <Stack direction={"row"} alignItems="center">
            <Typography>Monthly</Typography>
            <Switch checked={!monthly} onChange={(e) => setMonthly(!monthly)} disabled={disableMonthlyToggle} />
            <Typography>Annually</Typography>
          </Stack>
          <Typography variant="subtitle2">{rechargeMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseUpgradePlanDialog}>
            Cancel
          </Button>
          <Box position={"relative"} m={1}>
            <Button variant="contained" disabled={checkingOut} onClick={upgradePlan}>
              Upgrade
            </Button>
            {checkingOut && (
              <CircularProgress
                size={24}
                sx={{
                  color: blue,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddonDialog} onClose={handleCloseAddonDialog} maxWidth="xs">
        <DialogTitle>Add location</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the number of locations you want to add. You will also get 1 user per location</DialogContentText>
          <TextField variant="filled" type={"number"} margin="dense" value={addOnsAdded} onChange={(e) => setaddOnsAdded(parseInt(e.target.value))} />
          <Typography variant="subtitle2">{rechargeMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseAddonDialog}>
            Cancel
          </Button>
          <Box position={"relative"} m={1}>
            <Button variant="contained" disabled={checkingOut} onClick={addAddons}>
              Add
            </Button>
            {checkingOut && (
              <CircularProgress
                size={24}
                sx={{
                  color: blue,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
      <Dialog open={stripePopup} onClose={handleCloseStripePopup}>
        <DialogContent>
          <Elements options={options} stripe={stripePromise}>
            <Stripe snackbar={handleErrorSnackBarOpen} amount={amount} />
          </Elements>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Plan;
