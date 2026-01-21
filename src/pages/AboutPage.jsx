import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
} from '@mui/material';
import {
  EmojiObjects as IdeaIcon,
  Verified as VerifiedIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';

const AboutPage = () => {
  const values = [
    {
      icon: <IdeaIcon sx={{ fontSize: 36 }} />,
      title: 'Innovation',
      description: 'We constantly innovate to provide the best online testing experience.',
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 36 }} />,
      title: 'Quality',
      description: 'Quality and reliability are at the core of everything we do.',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 36 }} />,
      title: 'Community',
      description: 'Building a strong community of educators and learners worldwide.',
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
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
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
            About ExamHub
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, opacity: 0.95, lineHeight: 1.6 }}>
            Empowering education through innovative online testing solutions
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontWeight: 700, color: 'primary.main', mb: 3, fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', mb: 3, lineHeight: 1.8 }}>
              At ExamHub, we believe that assessment should be simple, efficient, and effective. 
              Our mission is to provide educators with powerful tools to create meaningful assessments 
              and help students demonstrate their knowledge in a stress-free environment.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              We're committed to transforming the way tests are created, delivered, and evaluated, 
              making the process seamless for both teachers and students.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #0084D1 0%, #005ea3 100%)',
                borderRadius: 4,
                p: { xs: 4, md: 6 },
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 132, 209, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                },
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Join Our Growing Community
              </Typography>
              <Stack direction="row" spacing={4} justifyContent="center" mt={4}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    10K+
                  </Typography>
                  <Typography variant="body1">Teachers</Typography>
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    50K+
                  </Typography>
                  <Typography variant="body1">Students</Typography>
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    100K+
                  </Typography>
                  <Typography variant="body1">Tests</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}
            >
              Our Values
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
              The principles that guide us every day
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {values.map((value, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: { xs: 3, md: 4 },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 20px 40px rgba(0, 132, 209, 0.15)',
                      borderColor: 'primary.main',
                      '& .value-avatar': {
                        transform: 'scale(1.1) rotate(5deg)',
                        bgcolor: 'primary.main',
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      },
                    },
                  }}
                >
                  <CardContent>
                    <Avatar
                      className="value-avatar"
                      sx={{
                        width: { xs: 70, md: 80 },
                        height: { xs: 70, md: 80 },
                        bgcolor: 'primary.light',
                        mx: 'auto',
                        mb: 3,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '& .MuiSvgIcon-root': {
                          color: 'primary.main',
                          transition: 'color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                      }}
                    >
                      {value.icon}
                    </Avatar>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Story Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box maxWidth="md" mx="auto" textAlign="center">
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 700, color: 'primary.main', mb: 4 }}
          >
            Our Story
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
            ExamHub was born out of a simple observation: traditional testing methods were 
            outdated and inefficient in the digital age. Founded by educators and technologists, 
            we set out to create a platform that would make online testing accessible, 
            reliable, and effective for everyone.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
            Today, ExamHub serves thousands of educational institutions worldwide, helping 
            teachers create better assessments and students achieve their full potential. 
            We're proud to be at the forefront of educational technology, continuously 
            evolving to meet the needs of modern education.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
