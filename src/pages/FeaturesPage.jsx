import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  Devices as DevicesIcon,
  Notifications as NotificationsIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

const FeaturesPage = () => {
  const teacherFeatures = [
    'Create multiple choice, true/false, and essay questions',
    'Set time limits for tests',
    'Automatic grading for objective questions',
    'Manual grading interface for subjective answers',
    'Detailed performance analytics',
    'Export results to PDF or Excel',
    'Schedule tests in advance',
    'Randomize questions and answers',
  ];

  const studentFeatures = [
    'User-friendly test-taking interface',
    'Real-time timer and progress tracking',
    'Save and resume tests',
    'Instant feedback on objective questions',
    'View detailed results and analytics',
    'Access test history',
    'Mobile-friendly interface',
    'Secure test environment',
  ];

  const technicalFeatures = [
    {
      icon: <SecurityIcon sx={{ fontSize: 36 }} />,
      title: 'Secure & Private',
      description: 'Bank-level encryption and security measures to protect your data and maintain test integrity.',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 36 }} />,
      title: 'Cloud-Based',
      description: 'Access from anywhere with an internet connection. No installation required.',
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 36 }} />,
      title: 'Cross-Platform',
      description: 'Works seamlessly on desktop, tablet, and mobile devices.',
    },
    {
      icon: <TimerIcon sx={{ fontSize: 36 }} />,
      title: 'Real-Time Updates',
      description: 'Live updates on test progress and instant result processing.',
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 36 }} />,
      title: 'Smart Notifications',
      description: 'Get notified about upcoming tests, results, and important updates.',
    },
    {
      icon: <PdfIcon sx={{ fontSize: 36 }} />,
      title: 'Export & Reports',
      description: 'Generate comprehensive reports and export data in multiple formats.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0084D1 0%, #005ea3 100%)',
          color: 'white',
          py: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            Features
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, opacity: 0.95, lineHeight: 1.6 }}>
            Comprehensive tools for modern online testing
          </Typography>
        </Container>
      </Box>

      {/* Teacher & Student Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                height: '100%',
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'primary.main',
                background: 'linear-gradient(135deg, rgba(0, 132, 209, 0.08) 0%, rgba(0, 94, 163, 0.12) 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0, 132, 209, 0.2)',
                  transform: 'translateY(-8px)',
                  background: 'linear-gradient(135deg, rgba(0, 132, 209, 0.12) 0%, rgba(0, 94, 163, 0.16) 100%)',
                },
              }}
            >
              <Box display="flex" alignItems="center" mb={3}>
                <AssignmentIcon
                  sx={{ fontSize: 48, color: '#005ea3', mr: 2 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#005ea3' }}>
                  For Teachers
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', mb: 3 }}>
                Powerful tools to create, manage, and grade tests efficiently
              </Typography>
              <List>
                {teacherFeatures.map((feature, index) => (
                  <ListItem 
                    key={index} 
                    disableGutters
                    sx={{
                      py: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        pl: 1,
                      },
                    }}
                  >
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                height: '100%',
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'secondary.main',
                background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.08) 0%, rgba(123, 31, 162, 0.12) 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(156, 39, 176, 0.25)',
                  transform: 'translateY(-8px)',
                  background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.12) 0%, rgba(123, 31, 162, 0.16) 100%)',
                },
              }}
            >
              <Box display="flex" alignItems="center" mb={3}>
                <AssessmentIcon
                  sx={{ fontSize: 48, color: '#7b1fa2', mr: 2 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                  For Students
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', mb: 3 }}>
                Intuitive interface for taking tests and tracking progress
              </Typography>
              <List>
                {studentFeatures.map((feature, index) => (
                  <ListItem 
                    key={index} 
                    disableGutters
                    sx={{
                      py: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        pl: 1,
                      },
                    }}
                  >
                    <ListItemIcon>
                      <CheckIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Technical Features */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}
            >
              Technical Excellence
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
              Built with cutting-edge technology for reliability and performance
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {technicalFeatures.map((feature, index) => (
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
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 20px 40px rgba(0, 132, 209, 0.15)',
                      borderColor: 'primary.main',
                      '& .tech-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                        bgcolor: 'primary.main',
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
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
                      textAlign: 'center',
                      p: { xs: 3, md: 4 },
                    }}
                  >
                    <Avatar
                      className="tech-icon"
                      sx={{
                        width: { xs: 70, md: 80 },
                        height: { xs: 70, md: 80 },
                        bgcolor: 'primary.light',
                        mb: 3,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '& .MuiSvgIcon-root': {
                          color: 'primary.main',
                          transition: 'color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.7, fontSize: '0.95rem' }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default FeaturesPage;
