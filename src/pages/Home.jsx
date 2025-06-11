import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Link,
  Chip,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  YouTube as YouTubeIcon,
  Article as ArticleIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// // Mock data for DSA topics
// const topics = [
//   {
//     id: 1,
//     title: 'Arrays and Strings',
//     progress: 60,
//     problems: [
//       {
//         id: 1,
//         name: 'Two Sum',
//         leetcodeLink: 'https://leetcode.com/problems/two-sum',
//         videoLink: 'https://youtube.com/watch?v=example1',
//         articleLink: 'https://example.com/two-sum',
//         difficulty: 'Easy',
//         completed: false
//       },
//       {
//         id: 2,
//         name: 'Valid Palindrome',
//         leetcodeLink: 'https://leetcode.com/problems/valid-palindrome',
//         videoLink: 'https://youtube.com/watch?v=example2',
//         articleLink: 'https://example.com/valid-palindrome',
//         difficulty: 'Easy',
//         completed: true
//       }
//     ]
//   },
//   {
//     id: 3,
//     title: 'Dynamic Programming',
//     progress: 0,
//     problems: [
//       {
//         id: 3,
//         name: 'Climbing Stairs',
//         leetcodeLink: 'https://leetcode.com/problems/climbing-stairs',
//         videoLink: 'https://youtube.com/watch?v=example3',
//         articleLink: 'https://example.com/climbing-stairs',
//         difficulty: 'Hard',
//         completed: false
//       }
//     ]
//   },
//   {
//     id: 2,
//     title: 'Linked Lists',
//     progress: 30,
//     problems: [
//       {
//         id: 3,
//         name: 'Reverse Linked List',
//         leetcodeLink: 'https://leetcode.com/problems/reverse-linked-list',
//         videoLink: 'https://youtube.com/watch?v=example3',
//         articleLink: 'https://example.com/reverse-linked-list',
//         difficulty: 'Medium',
//         completed: false
//       }
//     ]
//   }

// ];

const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'success';
    case 'medium':
      return 'warning';
    case 'hard':
      return 'error';
    default:
      return 'default';
  }
};

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://codingplatform-backend.onrender.com/api/problems/questions');
      setQuestions(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProblemToggle = async (topicId, problemId) => {
    try {
      // Find the current state of the problem
      const currentProblem = questions
        .find(t => t._id === topicId)
        ?.problems.find(p => p._id === problemId);
      
      // Get the current completed state
      const currentCompletedState = currentProblem?.completed || false;
      // The new state will be the opposite of current state
      const newCompletedState = !currentCompletedState;

      // Optimistically update UI
      setQuestions(prevTopics => 
        prevTopics.map(topic => {
          if (topic._id === topicId) {
            const updatedProblems = topic.problems.map(problem => 
              problem._id === problemId 
                ? { ...problem, completed: newCompletedState }
                : problem
            );
            
            // Calculate new progress
            const completedCount = updatedProblems.filter(p => p.completed).length;
            const newProgress = (completedCount / updatedProblems.length) * 100;

            return {
              ...topic,
              problems: updatedProblems,
              progress: newProgress
            };
          }
          return topic;
        })
      );

      // Make API call to update progress
      const response = await axios.put('https://codingplatform-backend.onrender.com/api/problems/update', {
        topicId,
        problemId,
        completed: newCompletedState  // This will be true when checking, false when unchecking
      });

      // If API call fails, the error will be caught in the catch block
      if (!response.data) {
        throw new Error('Failed to update progress');
      }

      // Refresh questions to get updated state
      await fetchQuestions();

    } catch (error) {
      // Revert UI changes if API call fails
      setQuestions(prevTopics => 
        prevTopics.map(topic => {
          if (topic._id === topicId) {
            const updatedProblems = topic.problems.map(problem => 
              problem._id === problemId 
                ? { ...problem, completed: currentCompletedState }  // Revert to original state
                : problem
            );
            
            const completedCount = updatedProblems.filter(p => p.completed).length;
            const newProgress = (completedCount / updatedProblems.length) * 100;

            return {
              ...topic,
              problems: updatedProblems,
              progress: newProgress
            };
          }
          return topic;
        })
      );
      
      // Show error message
      setError(error.response?.data?.message || 'Failed to update progress. Please try again.');
    }
  };


  useEffect(() => {
    fetchQuestions();
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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        DSA Learning Path
      </Typography>

      {questions.map((topic) => (
        <Accordion 
          key={topic._id}
          sx={{ 
            mb: 2,
            '&:before': {
              display: 'none',
            },
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#ffffff',
            '&:hover': {
              backgroundColor: '#f8f9fa',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              pr: 2
            }}>
              <Typography variant="h6" component="h2">
                {topic.title}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                minWidth: '200px'
              }}>
                <LinearProgress 
                  variant="determinate" 
                  value={topic.progress} 
                  sx={{ 
                    flexGrow: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#e9ecef',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#ffa512',
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6c757d',
                    fontWeight: 600,
                    minWidth: '45px',
                    textAlign: 'right'
                  }}
                >
                  {Math.round(topic.progress)}%
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '40%', fontWeight: 600 }}>Problem</TableCell>
                    <TableCell sx={{ width: '15%', fontWeight: 600 }}>Difficulty</TableCell>
                    <TableCell sx={{ width: '25%', fontWeight: 600 }}>Resources</TableCell>
                    <TableCell sx={{ width: '20%', fontWeight: 600 }} align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topic.problems.map((problem) => (
                    <TableRow 
                      key={problem._id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: problem.completed ? '#f8f9fa' : 'inherit',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                        },
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ 
                          fontWeight: problem.completed ? 500 : 400,
                          color: problem.completed ? '#6c757d' : 'inherit',
                          textDecoration: problem.completed ? 'line-through' : 'none'
                        }}
                      >
                        {problem.name}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={problem.difficulty}
                          color={getDifficultyColor(problem.difficulty)}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            minWidth: '80px',
                            '&.MuiChip-colorSuccess': {
                              backgroundColor: '#d4edda',
                              color: '#155724',
                            },
                            '&.MuiChip-colorWarning': {
                              backgroundColor: '#fff3cd',
                              color: '#856404',
                            },
                            '&.MuiChip-colorError': {
                              backgroundColor: '#f8d7da',
                              color: '#721c24',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1,
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}>
                          <Tooltip title="LeetCode">
                            <IconButton 
                              size="small" 
                              component={Link} 
                              href={problem.leetcodeLink}
                              target="_blank"
                              sx={{ 
                                color: '#ffa512',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 165, 18, 0.1)',
                                },
                              }}
                            >
                              <CodeIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Video Tutorial">
                            <IconButton 
                              size="small" 
                              component={Link} 
                              href={problem.videoLink}
                              target="_blank"
                              sx={{ 
                                color: '#dc3545',
                                '&:hover': {
                                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                },
                              }}
                            >
                              <YouTubeIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Article">
                            <IconButton 
                              size="small" 
                              component={Link} 
                              href={problem.articleLink}
                              target="_blank"
                              sx={{ 
                                color: '#28a745',
                                '&:hover': {
                                  backgroundColor: 'rgba(40, 167, 69, 0.1)',
                                },
                              }}
                            >
                              <ArticleIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={problem.completed}
                          onChange={() => handleProblemToggle(topic._id, problem._id)}
                          icon={<CheckCircleIcon />}
                          checkedIcon={<CheckCircleIcon sx={{ color: '#ffa512' }} />}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(255, 165, 18, 0.1)',
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

    </Container>
  );
};

export default Home; 
