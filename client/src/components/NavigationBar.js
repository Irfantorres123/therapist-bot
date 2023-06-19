import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { useHistoryNavigate } from "../hooks";

const ResponsiveAppBar = (props) => {
  const {
    authenticated,
    pages: initialPages,
    authToken,
    appBarRef,
    user,
  } = props;
  let appName = "TherapySense";
  appName = appName.toUpperCase();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [pages, setPages] = useState([]);
  const colorScheme = {
    color: "#fff",
  };
  const titleStyles = {
    fontFamily: "Goldman",
    fontSize: "1.25rem",
    fontWeight: "400",
  };
  const settings = [];
  const navigate = useHistoryNavigate();
  let theme = useTheme();
  let lg = useMediaQuery(theme.breakpoints.up("lg"));
  if (authenticated) {
    settings.push({ name: "Logout", link: "/logout" });
  }
  useEffect(() => {
    setPages(initialPages);
  }, [initialPages, authToken]);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (!authenticated) {
    return (
      <AppBar position="static" ref={appBarRef} sx={{ height: "70px" }}>
        <Container maxWidth="xxl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,

                display: { xs: "flex", md: "flex" },
                transition: "all 0.3s ease-in-out",
                ":hover": {
                  cursor: "pointer",
                },
                boxShadow: "0 0 1px rgba(255,255,255,0)",
                ...titleStyles,
                ...colorScheme,
              }}
              onClick={() => {
                if (window.location.pathname !== "/") {
                  navigate("/");
                } else {
                  window.location.reload();
                }
              }}
            >
              {appName}
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
  return (
    <AppBar position="sticky" ref={appBarRef} sx={{ height: "70px" }}>
      <Container maxWidth="xxl">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,

              transition: "all 0.3s ease-in-out",
              display: { xs: "none", md: "flex" },
              ":hover": {
                cursor: "pointer",
              },
              boxShadow: "0 0 1px rgba(255,255,255,0)",
              ...titleStyles,

              ...colorScheme,
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            {appName}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Box
                    to={page.path}
                    sx={{ textDecoration: "none", color: "#000" }}
                    onClick={() => {
                      if (window.location.pathname === page.path) {
                        window.location.reload();
                      } else {
                        navigate(page.path);
                      }
                    }}
                  >
                    <Typography
                      textAlign="center"
                      variant="h6"
                      sx={{
                        ...(page.path === window.location.pathname
                          ? colorScheme
                          : {}),
                      }}
                    >
                      {page.name}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              ...titleStyles,

              ...colorScheme,
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            {appName}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              return (
                <MenuButton
                  page={page}
                  handleCloseNavMenu={handleCloseNavMenu}
                  key={page.link}
                  gradient={colorScheme}
                  onClick={() => {
                    if (page.alerts) {
                      setPages(
                        pages.map((_page) => {
                          if (_page.name === page.name)
                            return { ..._page, alerts: false };
                          return _page;
                        })
                      );
                    }
                  }}
                />
              );
            })}
          </Box>
          {authenticated && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={user.name} placement="left" disableInteractive>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      background: "linear-gradient(to right, #141e30, #243b55)",
                      textAlign: "center",
                      fontWeight: 300,
                      color: "white",
                    }}
                    aria-label="recipe"
                  >
                    {user.name ? user.name[0].toUpperCase() : null}
                  </Avatar>{" "}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                    <Box
                      onClick={() => {
                        navigate(setting.link);
                      }}
                      style={{ textDecoration: "none", color: "#fff" }}
                    >
                      <Typography
                        textAlign="center"
                        variant="h7"
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          fontFamily: "Glory",
                        }}
                      >
                        {setting.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function MenuButton(props) {
  let { page, handleCloseNavMenu, gradient, sx, onClick } = props;

  let styles = {
    my: 2,
    color: "white",
    display: "block",
    transition: "all 0.3s ease-in-out",
    ":hover": {
      backgroundColor: "#4599ee",
    },
  };
  if (page.link === window.location.pathname)
    styles = { ...styles, ...gradient };
  return (
    <Link
      to={page.link}
      style={{ textDecoration: "none", color: "#fff" }}
      onClick={() => {
        onClick();
        if (window.location.pathname === page.link) {
          window.location.reload();
        }
      }}
    >
      <Button
        key={page.name}
        onClick={handleCloseNavMenu}
        sx={{ ...styles, ...sx, overflow: "hidden" }}
      >
        <Typography textAlign="center" variant="h6">
          {page.name}
        </Typography>
      </Button>
    </Link>
  );
}

export default ResponsiveAppBar;
