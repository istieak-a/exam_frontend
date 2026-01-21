import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <SchoolIcon sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ExamHub
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              Empowering education through innovative online testing solutions.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { color: 'primary.light' } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { color: 'primary.light' } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { color: 'primary.light' } }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { color: 'primary.light' } }}
              >
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Product
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to="/features"
                color="inherit"
                sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Features
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                color="inherit"
                sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                About Us
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Pricing
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Support
            </Typography>
            <Stack spacing={1}>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Help Center
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Documentation
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Contact Us
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Legal
            </Typography>
            <Stack spacing={1}>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Cookie Policy
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />

        <Box textAlign="center">
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} ExamHub. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
