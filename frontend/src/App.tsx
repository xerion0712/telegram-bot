import { useState, useEffect } from 'react'
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  MenuBook,
  People,
  QuestionAnswer,
  Refresh,
} from '@mui/icons-material'
import axios from 'axios'
import { format } from 'date-fns'

interface Response {
  id: string
  userId: number
  username: string
  firstName: string
  lastName: string
  question: string
  answer: string
  createdAt: string
}

interface Stats {
  totalResponses: number
  uniqueUsers: number
}

function App() {
  const [responses, setResponses] = useState<Response[]>([])
  const [stats, setStats] = useState<Stats>({ totalResponses: 0, uniqueUsers: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [responsesRes, statsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/responses'),
        axios.get('http://localhost:3000/api/responses/stats'),
      ])
      setResponses(responsesRes.data)
      setStats(statsRes.data)
    } catch (err) {
      setError('Failed to fetch data. Make sure the backend is running.')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static">
        <Toolbar>
          <MenuBook sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Book Reading Bot - Admin Dashboard
          </Typography>
          <Refresh
            sx={{ cursor: 'pointer' }}
            onClick={fetchData}
            titleAccess="Refresh data"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <QuestionAnswer color="primary" sx={{ mr: 1 }} />
                  <Typography color="text.secondary" variant="h6">
                    Total Responses
                  </Typography>
                </Box>
                <Typography variant="h3" component="div">
                  {loading ? <CircularProgress size={40} /> : stats.totalResponses}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People color="primary" sx={{ mr: 1 }} />
                  <Typography color="text.secondary" variant="h6">
                    Unique Users
                  </Typography>
                </Box>
                <Typography variant="h3" component="div">
                  {loading ? <CircularProgress size={40} /> : stats.uniqueUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MenuBook color="primary" sx={{ mr: 1 }} />
                  <Typography color="text.secondary" variant="h6">
                    Avg per User
                  </Typography>
                </Box>
                <Typography variant="h3" component="div">
                  {loading ? (
                    <CircularProgress size={40} />
                  ) : stats.uniqueUsers > 0 ? (
                    (stats.totalResponses / stats.uniqueUsers).toFixed(1)
                  ) : (
                    '0'
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Recent Responses
          </Typography>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Question</strong></TableCell>
                  <TableCell><strong>Answer</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : responses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">
                        No responses yet. Waiting for users to answer check-in questions...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  responses.map((response) => (
                    <TableRow key={response.id} hover>
                      <TableCell>
                        {format(new Date(response.createdAt), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {response.firstName} {response.lastName}
                          </Typography>
                          <Chip
                            label={`@${response.username}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {response.question}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{response.answer}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  )
}

export default App

