import { PersonOutlined, MailOutline, LockOutlined as Password, FacebookOutlined, Google as GoogleIcon } from "@mui/icons-material";
import { Box, Button, Grid, InputAdornment, Paper, Stack, SvgIcon, Tab, Tabs, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useExternalScript } from "../../Utils/CustomHooks";
import { useNavigate } from "react-router-dom";

const LinkedInIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
    </SvgIcon>
  );
};
const TwitterIcon = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 48 48">
      <path
        xmlns="http://www.w3.org/2000/svg"
        fill="#03A9F4"
        d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"
      />
    </SvgIcon>
  );
};
export default function Login() {
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();

  const google = useExternalScript("https://accounts.google.com/gsi/client");

  const doAuth = (type) => {
    let dimension = ",width=400,height=600";
    if (type === "facebook") {
      dimension = ",width=999,height=600";
    }
    window.addEventListener("message", (e) => {
      if (e.origin === process.env.REACT_APP_URI) {
        if (e.data === "success") {
          navigate("/dashboard", { replace: true });
        } else {
        }
      }
    });
    window.open(`${process.env.REACT_APP_URI}/auth/${type}`, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,top=400,left=500${dimension}`);
  };
  useEffect(() => {
    if (google === "ready") {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: console.log,
      });
      window.google.accounts.id.prompt();
    }
  }, [google]);

  const handleTabChange = (_, newValue) => setTab(newValue);
  return (
    <Stack alignItems={"center"}>
      <Paper elevation={6} sx={{ borderRadius: 1.25 }}>
        <Box maxWidth={450}>
          <Tabs centered textColor="secondary" indicatorColor="secondary" value={tab} onChange={handleTabChange}>
            <Tab value={0} label="Sign Up" />
            <Tab value={1} label="Log In" />
          </Tabs>
          <Stack justifyContent={"center"} width="fit-content" mx="auto" my={2} gap={1} direction="row" flexWrap="wrap" px={2}>
            <Button size="small" endIcon={<GoogleIcon />} variant="outlined" sx={{ minWidth: 200 }} onClick={() => doAuth("google")}>
              Sign In with Google
            </Button>
            <Button variant="outlined" endIcon={<FacebookOutlined />} onClick={() => doAuth("facebook")} size="small" sx={{ minWidth: 200 }}>
              Sign In with Facebook
            </Button>
            <Button variant="outlined" endIcon={<TwitterIcon />} onClick={() => doAuth("twitter")} size="small" sx={{ minWidth: 200 }}>
              Sign In with Twitter
            </Button>
            <Button variant="outlined" endIcon={<LinkedInIcon />} onClick={() => doAuth("linkedin")} size="small" sx={{ minWidth: 200 }}>
              Sign in with LinkedIn
            </Button>
          </Stack>
          <Box position={"relative"} textAlign={"center"} sx={{ "&:before": { width: "100%", position: "absolute", top: "50%", left: 0, borderTop: "2px solid #b7c9cc", content: "''" } }}>
            <span style={{ color: grey[500], position: "relative", padding: "0 30px", background: "#fff" }}>or you can use</span>
          </Box>
          <Box py={2} px={7}>
            {tab === 0 ? (
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <TextField
                    placeholder="Name"
                    variant="filled"
                    fullWidth
                    maxLength={30}
                    minLength={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <TextField
                    placeholder="Email"
                    variant="filled"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutline />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <TextField
                    placeholder="Password"
                    variant="filled"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Password />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Box>
                    <Button variant="contained" color="success" style={{ display: "block", marginLeft: "auto" }}>
                      Sign up
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <TextField
                      placeholder="Email"
                      variant="filled"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutline />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <TextField
                      placeholder="Password"
                      variant="filled"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Password />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <Stack justifyContent={"center"} height={"90%"} alignItems={"flex-end"}>
                      <a href="/">Forgot your password?</a>
                    </Stack>
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <Button variant="contained" color="success" style={{ display: "block", marginLeft: "auto" }}>
                      Log IN
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </Stack>
  );
}
