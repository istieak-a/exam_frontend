import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Stack,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CloudDone as CloudDoneIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const fadeInUp = keyframes`
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const float = keyframes`
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  `;

  const features = [
    {
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      title: 'Create Tests',
      description: 'Teachers can easily create comprehensive tests with multiple question types and formats.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights and analytics on student performance and test results.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description: 'Industry-standard security measures to protect your data and ensure test integrity.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast & Efficient',
      description: 'Streamlined interface for quick test creation and instant result generation.',
    },
    {
      icon: <CloudDoneIcon sx={{ fontSize: 40 }} />,
      title: 'Cloud-Based',
      description: 'Access from anywhere, anytime. All your tests and results stored safely in the cloud.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Student-Friendly',
      description: 'Intuitive interface for students to take tests and track their progress easily.',
    },
  ];

  const benefits = [
    'Easy test creation and management',
    'Real-time test taking and grading',
    'Comprehensive result tracking',
    'Multiple question types support',
    'Instant feedback for students',
    'Export results and analytics',
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0084D1 0%, #005ea3 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -50,
            right: -50,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ animation: `${fadeInUp} 0.8s ease-out` }}>
                <Chip 
                  label="🚀 Modern Exam Platform" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.95rem',
                  }}
                />
              </Box>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.75rem', md: '4rem' },
                  mb: 3,
                  lineHeight: 1.2,
                  animation: `${fadeInUp} 0.8s ease-out 0.2s both`,
                }}
              >
                Welcome to ExamHub
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 5,
                  opacity: 0.95,
                  fontSize: { xs: '1.15rem', md: '1.35rem' },
                  fontWeight: 400,
                  lineHeight: 1.6,
                  animation: `${fadeInUp} 0.8s ease-out 0.4s both`,
                }}
              >
                The complete solution for online testing and assessment. Empower teachers to create engaging tests and students to excel.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                sx={{ animation: `${fadeInUp} 0.8s ease-out 0.6s both` }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/signup')}
                  sx={{
                    py: 2,
                    px: 5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    bgcolor: 'white',
                    color: 'primary.main',
                    borderRadius: 3,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    '&:hover': {
                      bgcolor: 'white',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/about')}
                  sx={{
                    py: 2,
                    px: 5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    borderRadius: 3,
                    borderWidth: 2,
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-3px)',
                      borderWidth: 2,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                  alignItems: 'center',
                  animation: `${float} 6s ease-in-out infinite`,
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 320,
                    height: 320,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                      backdropFilter: 'blur(20px)',
                      animation: `${float} 4s ease-in-out infinite`,
                    }}
                  />
                  <SchoolIcon sx={{ fontSize: 180, opacity: 0.9, zIndex: 1 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" mb={{ xs: 6, md: 10 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main', 
              mb: 2,
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}
          >
            Powerful Features
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Everything you need to create, manage, and evaluate online exams efficiently
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(0, 132, 209, 0.15)',
                    borderColor: 'primary.main',
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                      bgcolor: 'primary.main',
                      color: 'white',
                    },
                  },
                }}
              >
                <CardContent 
                  sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    textAlign: 'center', 
                    p: { xs: 3, md: 4 },
                  }}
                >
                  <Avatar
                    className="feature-icon"
                    sx={{
                      width: { xs: 70, md: 80 },
                      height: { xs: 70, md: 80 },
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      mb: { xs: 2, md: 3 },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      mb: { xs: 1.5, md: 2 },
                      color: 'text.primary',
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.7, 
                      fontSize: { xs: '0.875rem', md: '0.95rem' },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'primary.main', py: { xs: 8, md: 10 }, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid 
            container 
            spacing={{ xs: 4, md: 6 }} 
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box 
                sx={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PeopleIcon sx={{ fontSize: { xs: 40, md: 48 }, mb: 2, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                  60K+
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  Active Users
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box 
                sx={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AssignmentIcon sx={{ fontSize: { xs: 40, md: 48 }, mb: 2, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                  150K+
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  Tests Created
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box 
                sx={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrophyIcon sx={{ fontSize: { xs: 40, md: 48 }, mb: 2, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                  98%
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  Satisfaction Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main', 
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Why Choose ExamHub?
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph 
                sx={{ fontSize: '1.125rem', lineHeight: 1.8, mb: 4 }}
              >
                ExamHub is designed to make online testing simple, efficient, and effective for both educators and students. Our platform combines powerful features with an intuitive interface.
              </Typography>
              <Stack spacing={2.5} mt={4}>
                {benefits.map((benefit, index) => (
                  <Box 
                    key={index} 
                    display="flex" 
                    alignItems="center" 
                    gap={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'background.paper',
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 32,
                        height: 32,
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 6 },
                  background: 'linear-gradient(135deg, #0084D1 0%, #005ea3 100%)',
                  color: 'white',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 300,
                    height: 300,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                  },
                }}
              >
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  Ready to Get Started?
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.95,
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  Join thousands of educators and students who trust ExamHub for their online testing needs.
                </Typography>
                <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/signup')}
                    sx={{
                      py: 2,
                      fontWeight: 600,
                      bgcolor: 'white',
                      color: 'primary.main',
                      borderRadius: 2,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: 'white',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Sign Up Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/login')}
                    sx={{
                      py: 2,
                      fontWeight: 600,
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderWidth: 2,
                      },
                    }}
                  >
                    Login
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center', bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              mb: 2,
            }}
          >
            Transform Your Testing Experience Today
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            paragraph 
            sx={{ 
              mb: 5,
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Start creating and taking tests in minutes. No credit card required.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/signup')}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.125rem',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: '0 8px 20px rgba(0, 132, 209, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 32px rgba(0, 132, 209, 0.4)',
                transform: 'translateY(-3px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
