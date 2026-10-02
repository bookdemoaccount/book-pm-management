import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SportsIcon from '@mui/icons-material/Sports';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { supabase } from '../lib/supabaseClient';

const WORKOUT_TYPES = [
  { value: 'strength', label: 'Strength', icon: <FitnessCenterIcon /> },
  { value: 'cardio', label: 'Cardio', icon: <DirectionsRunIcon /> },
  { value: 'class', label: 'Class', icon: <SelfImprovementIcon /> },
  { value: 'sports', label: 'Sports', icon: <SportsIcon /> },
];

const WORKOUT_LABELS = {
  strength: 'Strength',
  cardio: 'Cardio',
  class: 'Class',
  sports: 'Sports',
};

const WORKOUT_ICONS = {
  strength: FitnessCenterIcon,
  cardio: DirectionsRunIcon,
  class: SelfImprovementIcon,
  sports: SportsIcon,
};

function isSameDay(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate();
}

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatTimeOnly(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function GymCheckIn() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [memberName, setMemberName] = useState('');
  const [workoutType, setWorkoutType] = useState('strength');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchCheckins = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('gym_checkins')
      .select('*')
      .order('check_in_time', { ascending: false })
      .limit(50);

    if (fetchError) {
      setError('Could not load sign-ins. Please try again.');
    } else {
      setCheckins(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  const todayCheckins = checkins.filter((c) => isSameDay(c.check_in_time, new Date()));
  const todayCount = todayCheckins.length;

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = memberName.trim();
    if (!trimmedName) return;

    setSubmitting(true);
    setError(null);

    const insertData = {
      member_name: trimmedName,
      workout_type: workoutType,
      duration_minutes: duration ? parseInt(duration, 10) : null,
      note: note.trim() || null,
    };

    const { error: insertError } = await supabase
      .from('gym_checkins')
      .insert([insertData]);

    if (insertError) {
      setError('Could not sign in. Please try again.');
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setMemberName('');
    setDuration('');
    setNote('');
    setWorkoutType('strength');
    setSubmitting(false);

    setTimeout(() => setSuccess(false), 2000);
    fetchCheckins();
  }

  async function handleDelete(id) {
    const { error: deleteError } = await supabase
      .from('gym_checkins')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError('Could not remove that sign-in.');
      return;
    }
    fetchCheckins();
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 3 }}>
      <Typography variant="h5" sx={{ fontSize: '1.2rem', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FitnessCenterIcon sx={{ color: 'primary.light' }} />
        Gym Sign-In
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sign in at the front desk and track your visits.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Today summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.22)',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'primary.light',
              }}
            >
              {todayCount}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
              {todayCount === 0 ? 'No sign-ins yet today' : `${todayCount} ${todayCount === 1 ? 'sign-in' : 'sign-ins'} today`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Sign-in form */}
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="h6" sx={{ fontSize: '0.85rem' }}>
            Sign In
          </Typography>

          <TextField
            label="Member name"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="e.g. Jane Doe"
            required
            fullWidth
            id="gym-member-name"
          />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Workout type
            </Typography>
            <ToggleButtonGroup
              value={workoutType}
              exclusive
              onChange={(_, v) => v && setWorkoutType(v)}
              fullWidth
              size="small"
              aria-label="Workout type"
            >
              {WORKOUT_TYPES.map((t) => (
                <ToggleButton
                  key={t.value}
                  value={t.value}
                  id={`gym-workout-${t.value}`}
                  sx={{
                    gap: 0.5,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    fontFamily: '"Space Grotesk", sans-serif',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(139,92,246,0.15)',
                      color: '#A855F7',
                      borderColor: 'rgba(139,92,246,0.40)',
                    },
                  }}
                >
                  {t.icon}
                  {t.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <TextField
            label="Planned duration (minutes, optional)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 45"
            fullWidth
            inputProps={{ min: 0 }}
            id="gym-duration"
          />

          <TextField
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
            fullWidth
            id="gym-note"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={submitting || !memberName.trim()}
            startIcon={success ? <CheckCircleIcon /> : <FitnessCenterIcon />}
            id="gym-sign-in-button"
          >
            {success ? 'Signed In!' : submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </CardContent>
      </Card>

      {/* Today's sign-ins */}
      {todayCheckins.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontSize: '0.85rem', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 18, color: 'primary.light' }} />
            Today's Sign-Ins
          </Typography>
          <Card>
            <List disablePadding>
              {todayCheckins.map((entry, idx) => {
                const Icon = WORKOUT_ICONS[entry.workout_type] || FitnessCenterIcon;
                return (
                  <React.Fragment key={entry.id}>
                    {idx > 0 && <Divider sx={{ borderColor: 'rgba(139,92,246,0.12)' }} />}
                    <ListItem
                      id={`gym-today-${entry.id}`}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleDelete(entry.id)}
                          aria-label={`Delete ${entry.member_name}'s sign-in`}
                          sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Icon sx={{ color: 'primary.light', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {entry.member_name}
                            </Typography>
                            <Chip
                              label={WORKOUT_LABELS[entry.workout_type] || entry.workout_type}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 22, borderColor: 'rgba(139,92,246,0.22)', color: 'text.secondary' }}
                            />
                            {entry.duration_minutes && (
                              <Chip
                                label={`${entry.duration_minutes} min`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 22, borderColor: 'rgba(139,92,246,0.22)', color: 'text.secondary' }}
                              />
                            )}
                          </Box>
                        }
                        secondary={`${formatTimeOnly(entry.check_in_time)}${entry.note ? ` — ${entry.note}` : ''}`}
                        secondaryTypographyProps={{ color: 'text.secondary', fontSize: '0.75rem' }}
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </Card>
        </Box>
      )}

      {/* Recent visits */}
      <Typography variant="h6" sx={{ fontSize: '0.85rem', mb: 1.5 }}>
        Recent Visits
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : checkins.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <FitnessCenterIcon sx={{ fontSize: 48, color: 'primary.light', opacity: 0.4, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No visits yet. Sign in above to get started!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <List disablePadding>
            {checkins.map((entry, idx) => {
              const Icon = WORKOUT_ICONS[entry.workout_type] || FitnessCenterIcon;
              return (
                <React.Fragment key={entry.id}>
                  {idx > 0 && <Divider sx={{ borderColor: 'rgba(139,92,246,0.12)' }} />}
                  <ListItem
                    id={`gym-visit-${entry.id}`}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDelete(entry.id)}
                        aria-label={`Delete ${entry.member_name}'s visit`}
                        sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon sx={{ color: 'primary.light', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {entry.member_name}
                          </Typography>
                          <Chip
                            label={WORKOUT_LABELS[entry.workout_type] || entry.workout_type}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 22, borderColor: 'rgba(139,92,246,0.22)', color: 'text.secondary' }}
                          />
                          {entry.duration_minutes && (
                            <Chip
                              label={`${entry.duration_minutes} min`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 22, borderColor: 'rgba(139,92,246,0.22)', color: 'text.secondary' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={`${formatTime(entry.check_in_time)}${entry.note ? ` — ${entry.note}` : ''}`}
                      secondaryTypographyProps={{ color: 'text.secondary', fontSize: '0.75rem' }}
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </Card>
      )}
    </Box>
  );
}
