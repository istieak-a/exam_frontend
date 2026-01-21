import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({ threshold: 50 });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(20px)',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
            {/* Logo - Desktop */}
            <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: '1.5rem',
              }}
            >
              ExamHub
            </Typography>

            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="navigation menu"
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
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={() => handleNavigation('/')}>
                  <Typography textAlign="center">Home</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/about')}>
                  <Typography textAlign="center">About</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/features')}>
                  <Typography textAlign="center">Features</Typography>
                </MenuItem>
              </Menu>
            </Box>

            {/* Logo - Mobile */}
            <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              ExamHub
            </Typography>

            {/* Desktop Menu - Centered */}
            <Box 
              sx={{ 
                flexGrow: 1, 
                display: { xs: 'none', md: 'flex' }, 
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {[
                { label: 'Home', path: '/' },
                { label: 'About', path: '/about' },
                { label: 'Features', path: '/features' },
              ].map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{ 
                    color: 'text.primary', 
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
                      left: '50%',
                      transform: 'translateX(-50%) scaleX(0)',
                      width: '60%',
                      height: 2,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: 'primary.main',
                      '&::before': {
                        transform: 'translateX(-50%) scaleX(1)',
                      },
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Auth Buttons */}
            <Box sx={{ flexGrow: 0, display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button
                component={Link}
                to="/login"
                sx={{ 
                  fontWeight: 500,
                  color: 'text.primary',
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'primary.main',
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{ 
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0, 132, 209, 0.35)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
