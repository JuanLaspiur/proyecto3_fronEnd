import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle } from "@mui/icons-material";
import { getUserInfo, startLogin } from "../api/axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import routes from "../router/routes";
import { useSnackbar } from "notistack";
import LoadingModal from "../components/common/LoadingModal";
import ChangePasswordModal from "../components/change-password/ChangePassword";

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const schema = yup
    .object({
      email: yup.string().required(),
      password: yup.string().required(),
    })
    .required();

  const getUserData = async () => {
    const data = await getUserInfo();
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    setIsLoading(true);
    const response = await startLogin(data);
    if (response.success) {
      enqueueSnackbar(response.msg, { variant: "success" });
      await getUserData();
      const storageData = localStorage.getItem("QUERCU_USER_INFO");
      const user = JSON.parse(storageData);
      switch (user.role[0]) {
        case 0:
          navigate(routes.root);
          break;
        case 1:
          navigate(routes.home);
          break;
        case 2:
          navigate(routes.home);
          break;
        default:
          navigate(routes.home);
          break;
      }
    } else {
      enqueueSnackbar(response.msg, { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <>
      {changingPassword && <ChangePasswordModal setIsModal={setChangingPassword} />}

      <Grid
        container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "primary.main",
        }}
      >
        <Grid item xs={10} md={3}>
          <Typography
            variant="h3"
            noWrap
            component="div"
            color={"text.main"}
            sx={[
              {
                display: { xs: "none", sm: "block", textAlign: "center" },
              },
              { mb: 5 },
            ]}
          >
            EICHE
          </Typography>
          <Card>
            <CardContent sx={{ mt: 5 }}>
              <Grid container>
                <Grid item xs={12}>
                  <FormControl
                    sx={{ m: 1, width: "100%" }}
                    variant="outlined"
                    name="email"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Usuario
                    </InputLabel>
                    <OutlinedInput
                      type="text"
                      {...register("email")}
                      endAdornment={
                        <InputAdornment position="end">
                          <AccountCircle />
                        </InputAdornment>
                      }
                      label="Usuario"
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl
                    sx={{ m: 1, width: "100%" }}
                    variant="outlined"
                    name="password"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions
              sx={{
                justifyContent: "center",
                mb: 5,
                flexDirection: "column",
              }}
            >
              <Button
                variant="contained"
                onClick={handleSubmit(handleLogin)}
                sx={{ mb: 2 }}
              >
                Iniciar sesión
              </Button>
              <Typography variant="body2" sx={{
                cursor: "pointer",
              }} onClick={
                () => setChangingPassword(true)
              }>
                Olvidaste tu contraseña? Haz click aquí
              </Typography>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      {isLoading && <LoadingModal />}
    </>
  );
};

export default Login;
