import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";

export const PageHeader = ({ page_title, breadcrumbs }) => {
  return (
    <header className="header">
      <Typography
        variant="h4"
        component="h1"
        sx={{ marginRight: 5, fontWeight: 700 }}
      >
        {page_title}
      </Typography>
      {breadcrumbs === null ? null : (
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb) =>
            breadcrumb.link_to ? (
              <Link
                key={breadcrumb.id}
                underline="hover"
                color="inherit"
                component={RouterLink}
                to={breadcrumb.link_to}
              >
                {breadcrumb.title}
              </Link>
            ) : (
              <Typography key={breadcrumb.id} color="text.gray">
                {breadcrumb.title}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
    </header>
  );
};
