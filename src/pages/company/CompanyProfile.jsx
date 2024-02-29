import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { getUserInfo } from "../../api/axios";
import { PageHeader } from "../../components/common/PageHeader";
import routes from "../../router/routes";
import CompanyProfileForm from "../../components/administration/CompanyProfileForm";
import { formatDate } from "../../helpers/formatDate";

const CompanyProfile = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getData()
  }, []);

  const getData = async () => {
    const response = await getUserInfo()
    setUser(response.user)
  }

  const page_title = `Perfil de empresa`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Root",
    },
    {
      id: 2,
      title: "Listado de empresas",
      link_to: routes.companies_list,
    },
    {
      id: 3,
      title: "Empresa",
    },
  ];

  return (
    <Grid container sx={{justifyContent: "center"}}>

      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      {user ?
      <>
        <Grid item xs={5}>
          <Card>
            <CardContent>

              <Grid container sx={{justifyContent: "center"}}>

                <Grid item xs={12} sx={{textAlign: "center", mb: 3}}>
                  <Typography variant="h5">{user.name}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">Email</Typography>
                </Grid>
                <Grid item xs={6} sx={{textAlign: "end"}}>
                  <Typography variant="body2">{user.email}</Typography>
                </Grid>

                <Grid item xs={12}>
                <Divider light sx={{my: 2}} />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">Fecha de creación</Typography>
                </Grid>
                <Grid item xs={6} sx={{textAlign: "end"}}>
                  <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
                </Grid>

              </Grid>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={8} sx={{my: 5}}>
          <CompanyProfileForm />
        </Grid>
      </>
      : null }{/* Setear error 404 */}

    </Grid>
  );
};

export default CompanyProfile;
