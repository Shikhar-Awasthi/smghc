import { Box, List, ListItem, ListItemText, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Plan/Plan.css";
import { Close as CloseIcon, Done as DoneIcon } from "@mui/icons-material";

function Pricing() {
  const [plans, setPlans] = useState([]);
  const [monthly, setMonthly] = useState(false);
  const [value, setValue] = useState("INR");

  const handleCUrrencyChange = (event) => {
    if (event.target.checked) {
      setValue("USD");
    } else {
      setValue("INR");
    }
  };
  useEffect(() => {
    axios
      .get("/getPlans")
      .then((response) => {
        let { data } = response.data;
        setPlans(data);
      })
      .catch((_) => {});
  }, []);

  return (
    <div className="menu-Container">
      <div className="menu-Content">
        <Box width="100%" mt={"50px"}>
          <Stack alignItems={"center"} p={3} pb={0}>
            <Typography component={"h2"} variant="h2" mb={"0.5rem"} fontSize={"35px"} fontWeight={700} color="#1e73be">
              Pricing
            </Typography>
            <Box
              width="360px"
              height="80px"
              sx={{ background: "#e1e1e7", color: "#000", borderRadius: "999px", cursor: "pointer" }}
              display="flex"
              flexDirection={"row"}
              justifyContent="space-between"
              p={"0.5rem 0.75rem"}
              mt={"1em"}
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
              *prices based on {value}
            </Typography>
          </Stack>
          <Stack flexDirection={"row"} justifyContent="center" alignItems="center">
            <Typography>INR</Typography>
            <Switch color="secondary" value={value === "INR"} onChange={handleCUrrencyChange} />
            <Typography>USD</Typography>
          </Stack>
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
          <Box mt={3} display="flex" alignItems="center" flexDirection={"column"}>
            <Typography component={"h4"} variant="h4">
              Comparison
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: 950 }}>
              <Table sx={{ width: "100%" }} aria-label="comparison table">
                <TableHead>
                  <TableRow>
                    <TableCell>Feature</TableCell>
                    <TableCell align="right">Free</TableCell>
                    <TableCell align="right">Individual</TableCell>
                    <TableCell align="right">Agency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      Number of Locations
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (New Locations can be created and Old one added )
                      </Typography>
                    </TableCell>
                    <TableCell align="right">1</TableCell>
                    <TableCell align="right">1</TableCell>
                    <TableCell align="right">5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Number of Users
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Users can be allowed rights except Admin which is full rights)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">1</TableCell>
                    <TableCell align="right">2</TableCell>
                    <TableCell align="right">6</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Posting of Posts</TableCell>
                    <TableCell align="right">Unlimited</TableCell>
                    <TableCell align="right">Unlimited</TableCell>
                    <TableCell align="right">Unlimited</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Posting of Media</TableCell>
                    <TableCell align="right">Unlimited</TableCell>
                    <TableCell align="right">Unlimited</TableCell>
                    <TableCell align="right">Unlimited</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Scheduling of Posts
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Schedule for later time and be FREE)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">10 total</TableCell>
                    <TableCell align="right">30 monthly</TableCell>
                    <TableCell align="right">150 monthly</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Scheduling of Media
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Schedule for later time and be FREE)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">10 total</TableCell>
                    <TableCell align="right">30 monthly</TableCell>
                    <TableCell align="right">150 monthly</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Geo Tagging
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Helps rank on Image Search)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">15 Monthly</TableCell>
                    <TableCell align="right">50 Monthly</TableCell>
                    <TableCell align="right">Unlimited</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Services Management
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Add Google suggested services)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Products Management</TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Health Score
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Know Total health Score of your Business)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Review Management
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Manual reply to reviews)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Review Short Link
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Share link on Whatsapp to get more reviews)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Basic Insights
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (How your business is performing)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Earning via Affiliate
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Enable Affiliate link and promote the app to earn unlimited commission)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mobile and Web Access</TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Advanced Insights
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Understand type of people visiting you in detailed view)
                      </Typography>{" "}
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Post auto fit</TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Auto Review Reply
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Helps you reply the reviews even when you don’t have time)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Questions and Answer Management
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Create Questions and answers for visitors)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Custom Services Management
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Add more services than suggested by Google)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Health Improvement Tips
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Learn how you can improve health Score and rank on Google )
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Custom Review Link
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (Review link with your brand name with QR Code)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Add more Location
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (You can buy more location(s) which will be charged on your remaining duration of Plan)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Get additional user
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (when you buy more location(s) get 1 user for each)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Advanced Insights Report with keywords
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (get the report of the keywords on which your location is visible)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Citation Manager
                      <Typography component="span" variant="caption" fontStyle={"italic"}>
                        (manage your citations)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CloseIcon color="error" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <DoneIcon color="success" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default Pricing;
