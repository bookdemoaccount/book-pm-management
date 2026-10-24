import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CloseIcon from '@mui/icons-material/Close';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { tokens } from '../../theme';
import { CLASSES, DEMO_CLOCK } from './classesData';

const SAVED_KEY = 'pulse.dropin.saved';

// Fixed demo clock: Tuesday 10:00 AM. Never read real time.
const DEMO_MINUTES = DEMO_CLOCK.hour * 60 + DEMO_CLOCK.minute;

const TIMEOfDayS = ['All', 'Morning', 'Afternoon', 'Evening'];

const YORK_RED = '#E11837';
const TEAL = '#0DC9AD';

const INTENSITY_LABEL = {
  Beginner: 'Beginner',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
};

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hr12 = h % 12 === 0 ? 12 : h % 12;
  return `${hr12}:${String(m).padStart(2, '0')} ${period}`;
}

export default function DropinClasses() {
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('All');
  const [savedIds, setSavedIds] = useState([]);
  const [selected, setSelected] = useState(null);
  const [forceEmpty, setForceEmpty] = useState(false);

  // Load saved classes from localStorage (guarded).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSavedIds(JSON.parse(raw));
    } catch {
      setSavedIds([]);
    }
  }, []);

  // Persist saved classes (guarded).
  const persistSaved = useCallback((next) => {
    setSavedIds(next);
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in memory */
    }
  }, []);

  const toggleSave = useCallback(
    (cls) => {
      const isSaved = savedIds.includes(cls.id);
      const next = isSaved
        ? savedIds.filter((id) => id !== cls.id)
        : [...savedIds, cls.id];
      persistSaved(next);
    },
    [savedIds, persistSaved]
  );

  // Hide any class that started before the demo clock (guardrail).
  const upcoming = useMemo(
    () => CLASSES.filter((c) => toMinutes(c.start) >= DEMO_MINUTES),
    []
  );

  const filtered = useMemo(() => {
    if (forceEmpty) return [];
    return upcoming.filter((c) => {
      if (beginnerOnly && c.intensity !== 'Beginner') return false;
      if (timeOfDay !== 'All' && c.timeOfDay !== timeOfDay) return false;
      return true;
    });
  }, [upcoming, beginnerOnly, timeOfDay, forceEmpty]);

  const savedClasses = useMemo(
    () => CLASSES.filter((c) => savedIds.includes(c.id)),
    [savedIds]
  );

  // --- Test-state controls (testing only) ---
  const applyTestState = useCallback((state) => {
    switch (state) {
      case 'happy':
        setForceEmpty(false);
        setBeginnerOnly(false);
        setTimeOfDay('All');
        setSelected(null);
        break;
      case 'beginner':
        setForceEmpty(false);
        setBeginnerOnly(true);
        setTimeOfDay('All');
        setSelected(null);
        break;
      case 'combined':
        setForceEmpty(false);
        setBeginnerOnly(true);
        setTimeOfDay('Evening');
        setSelected(null);
        break;
      case 'empty':
        // Demonstrate the empty-state message. No real filter combo yields zero
        // matches because beginner classes span all three times of day, so this
        // button forces the empty result while leaving the filter UI showing a
        // plausible-looking combo (Beginner + Afternoon would match Lunchtime
        // Stretch; the override makes the list empty for testing).
        setForceEmpty(true);
        setBeginnerOnly(true);
        setTimeOfDay('Afternoon');
        setSelected(null);
        break;
      case 'full':
        setForceEmpty(false);
        setBeginnerOnly(false);
        setTimeOfDay('All');
        setSelected(
          CLASSES.find((c) => c.spotsLeft === 0 && toMinutes(c.start) >= DEMO_MINUTES) || null
        );
        break;
      case 'past':
        setForceEmpty(false);
        setBeginnerOnly(false);
        setTimeOfDay('All');
        setSelected(null);
        break;
      default:
        break;
    }
  }, []);

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 2, py: 3 }}>
      <Typography variant="h5" sx={{ fontSize: '1.2rem', mb: 0.5 }}>
        Drop-in Classes
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.8rem' }}>
        Sample schedule for demonstration. Not live York data.
      </Typography>

      {/* My saved classes */}
      {savedClasses.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.12em' }}
          >
            My saved classes
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {savedClasses.map((c) => (
              <Box
                key={c.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.25,
                  borderRadius: 2,
                  backgroundColor: 'rgba(225,24,55,0.10)',
                  border: '1px solid rgba(225,24,55,0.35)',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {c.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(c.start)} · {c.room}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => toggleSave(c)}
                  sx={{ color: YORK_RED, textTransform: 'none', minWidth: 'auto' }}
                  aria-label={`Remove ${c.name} from saved`}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={beginnerOnly}
              onChange={(e) => setBeginnerOnly(e.target.checked)}
              id="filter-beginner"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: TEAL },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: TEAL,
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                Beginner-friendly
              </Typography>
              <Chip
                label="Beginner-friendly"
                size="small"
                sx={{
                  display: beginnerOnly ? 'inline-flex' : 'none',
                  backgroundColor: 'rgba(13,201,173,0.18)',
                  color: TEAL,
                  border: '1px solid rgba(13,201,173,0.45)',
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                }}
              />
            </Box>
          }
        />
        <ToggleButtonGroup
          value={timeOfDay}
          exclusive
          onChange={(_, v) => v && setTimeOfDay(v)}
          size="small"
          aria-label="Time of day"
        >
          {TIMEOfDayS.map((t) => (
            <ToggleButton
              key={t}
              value={t}
              id={`filter-time-${t.toLowerCase()}`}
              sx={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontFamily: '"Space Grotesk", sans-serif',
                px: 1.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(225,24,55,0.18)',
                  color: YORK_RED,
                },
              }}
            >
              {t}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ mb: 2, borderColor: 'divider' }} />

      {/* Class list */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body1" color="text.secondary">
            No classes match. Try another time of day.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filtered.map((c) => {
            const isSaved = savedIds.includes(c.id);
            const isFull = c.spotsLeft <= 0;
            return (
              <Card
                key={c.id}
                id={`class-card-${c.id}`}
                onClick={() => setSelected(c)}
                sx={{
                  cursor: 'pointer',
                  '&:active': { transform: 'scale(0.99)' },
                }}
              >
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {c.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.75, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(c.start)} · {c.lengthMin} min
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PlaceIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {c.room}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
                      <IntensityChip intensity={c.intensity} />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: isFull ? '#FBBF24' : 'text.secondary' }}
                      >
                        {isFull ? 'Full' : `${c.spotsLeft} spots left`}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Detail drawer */}
      <Drawer
        anchor="bottom"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        PaperProps={{
          sx: {
            backgroundColor: '#14141C',
            borderTop: `1px solid ${tokens.borderViolet}`,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '85vh',
          },
        }}
      >
        {selected && (
          <Box sx={{ p: 3, maxWidth: 720, mx: 'auto', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton size="small" onClick={() => setSelected(null)} aria-label="Close details">
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>
              {selected.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
              <DetailRow icon={<AccessTimeIcon fontSize="small" />} text={`${formatTime(selected.start)} · ${selected.lengthMin} min`} />
              <DetailRow icon={<PlaceIcon fontSize="small" />} text={selected.room} />
              <DetailRow icon={<FitnessCenterIcon fontSize="small" />} text={INTENSITY_LABEL[selected.intensity]} />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              What to expect
            </Typography>
            <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.6 }}>
              {selected.whatToExpect}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: selected.spotsLeft <= 0 ? '#FBBF24' : 'text.secondary' }}>
              {selected.spotsLeft <= 0 ? 'Full' : `${selected.spotsLeft} spots left`}
            </Typography>
            <Box sx={{ mt: 2 }}>
              {selected.spotsLeft <= 0 ? (
                <Button variant="contained" disabled fullWidth sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'text.secondary' }}>
                  Class is full
                </Button>
              ) : (
                <Button
                  id={`save-button-${selected.id}`}
                  variant="contained"
                  fullWidth
                  startIcon={savedIds.includes(selected.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={() => toggleSave(selected)}
                  sx={{
                    backgroundColor: YORK_RED,
                    '&:hover': { backgroundColor: '#c10f2d' },
                  }}
                >
                  {savedIds.includes(selected.id) ? 'Saved — tap to remove' : 'Save to my week'}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Test states (testing only) */}
      <Box sx={{ mt: 5, pt: 3, borderTop: '1px dashed', borderColor: 'divider' }}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.12em' }}
        >
          Test states (testing only)
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <TestButton label="1. Happy path" onClick={() => applyTestState('happy')} />
          <TestButton label="2. Beginner filter" onClick={() => applyTestState('beginner')} />
          <TestButton label="3. Combined filter" onClick={() => applyTestState('combined')} />
          <TestButton label="4. Empty state" onClick={() => applyTestState('empty')} />
          <TestButton label="5. Full class" onClick={() => applyTestState('full')} />
          <TestButton label="6. Past class hidden" onClick={() => applyTestState('past')} />
        </Box>

      </Box>
    </Box>
  );
}

function IntensityChip({ intensity }) {
  const isBeginner = intensity === 'Beginner';
  return (
    <Chip
      label={INTENSITY_LABEL[intensity]}
      size="small"
      sx={{
        height: 22,
        fontSize: '0.68rem',
        fontWeight: 600,
        fontFamily: '"Space Grotesk", sans-serif',
        letterSpacing: '0.04em',
        backgroundColor: isBeginner ? 'rgba(13,201,173,0.18)' : 'rgba(255,255,255,0.08)',
        color: isBeginner ? TEAL : 'text.secondary',
        border: '1px solid',
        borderColor: isBeginner ? 'rgba(13,201,173,0.45)' : 'rgba(255,255,255,0.18)',
      }}
    />
  );
}

function DetailRow({ icon, text }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
      {icon}
      <Typography variant="caption">{text}</Typography>
    </Box>
  );
}

function TestButton({ label, onClick }) {
  return (
    <Button
      size="small"
      variant="outlined"
      onClick={onClick}
      sx={{
        fontSize: '0.7rem',
        textTransform: 'none',
        borderColor: 'divider',
        color: 'text.secondary',
        '&:hover': { borderColor: YORK_RED, color: YORK_RED },
      }}
    >
      {label}
    </Button>
  );
}
