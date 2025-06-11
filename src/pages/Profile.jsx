import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import axios from 'axios';

const COLORS = {
  easy: '#4CAF50',
  medium: '#FFC107',
  hard: '#F44336'
};

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://codingplatform-backend.onrender.com/api/problems/summary');
        setProfileData(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profileData) return null;

  // Prepare data for difficulty distribution pie chart
  const difficultyData = Object.entries(profileData.problemsByDifficulty).map(([name, value]) => ({
    name,
    value,
    color: COLORS[name.toLowerCase()]
  }));

  // Prepare data for daily progress bar chart
  const dailyProgressData = profileData.dailyProgress.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count
  }));

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
      py: 4
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 6 } }}>
        <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
          {/* Profile Header Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              mb: 4,
              background: 'linear-gradient(45deg, #ffa512 30%, #ff8e53 90%)',
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
                zIndex: 1
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              maxWidth: '100%',
              margin: '0 auto',
              position: 'relative',
              zIndex: 2
            }}>
              <Avatar
                sx={{
                  width: { xs: 80, sm: 100, md: 120 },
                  height: { xs: 80, sm: 100, md: 120 },
                  bgcolor: 'white',
                  color: '#ffa512',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                {getInitials(profileData.user.fullName)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {profileData.user.fullName}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontSize: { xs: '1rem', sm: '1.1rem' }, mb: 0.5 }}>
                  {profileData.user.email}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Member since {new Date(profileData.user.memberSince).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Stats Grid */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                '&:hover': { 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                },
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                    Total Problems
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#ffa512', fontWeight: 700, mb: 1 }}>
                    {profileData.totalProblems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available to solve
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                '&:hover': { 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                },
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                    Solved Problems
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#ffa512', fontWeight: 700, mb: 1 }}>
                    {profileData.solvedProblems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successfully completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                '&:hover': { 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                },
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                    Completion Rate
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#ffa512', fontWeight: 700, mb: 1 }}>
                    {profileData.completionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Grid */}
          <Grid spacing={2}>
            {/* Daily Progress Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: { xs: 400, md: 550 },
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}>
                <CardContent sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 4,
                      textAlign: 'center',
                      color: '#333'
                    }}
                  >
                    Daily Progress
                  </Typography>
                  <Box sx={{
                    flex: 1,
                    minHeight: '250px',
                    width: '100%'
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dailyProgressData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="date"
                          stroke="#666"
                          tick={{ fill: '#666', fontSize: 12 }}
                          interval="preserveStartEnd"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis
                          stroke="#666"
                          tick={{ fill: '#666', fontSize: 14 }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            fontSize: '14px',
                            padding: '10px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#ffa512"
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Difficulty Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: { xs: 400, md: 550 },
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}>
                <CardContent sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 4,
                      textAlign: 'center',
                      color: '#333',
                      fontSize: { xs: '1.25rem', sm: '1.4rem' }
                    }}
                  >
                    Problems by Difficulty
                  </Typography>
                  <Box sx={{
                    flex: 1,
                    minHeight: '300px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={difficultyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          labelLine={false}
                        >
                          {difficultyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            fontSize: '14px',
                            padding: '10px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            fontSize: '12px',
                            paddingTop: '20px'
                          }}
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>


          {/* Recently Solved Problems */}
          <Box sx={{ mt: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                mb: 3,
                color: '#333'
              }}
            >
              Recently Solved Problems
            </Typography>
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="recent problems table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2 }}>Problem</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2 }}>Topic</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2 }}>Difficulty</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2 }}>Solved On</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profileData.recentProblems?.map((problem, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: '#fafafa',
                          transition: 'background-color 0.2s ease'
                        },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#333',
                              mb: 0.5
                            }}
                          >
                            {problem.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#333',
                              mb: 0.5
                            }}
                          >
                            {problem.topic}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box 
                          sx={{ 
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block',
                            bgcolor: problem.difficulty === 'Easy' ? '#E8F5E9' : 
                                    problem.difficulty === 'Medium' ? '#FFF3E0' : '#FFEBEE',
                            color: problem.difficulty === 'Easy' ? '#2E7D32' : 
                                  problem.difficulty === 'Medium' ? '#E65100' : '#C62828',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          {problem.difficulty}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(problem.solvedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile; 
