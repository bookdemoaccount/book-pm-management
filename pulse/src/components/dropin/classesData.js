/**
 * Simulated drop-in class schedule for Tuesday, for demonstration only.
 * NOT live York data. Times are 24h strings relative to the fixed demo clock
 * (Tuesday 10:00 AM). Any class starting before 10:00 is treated as "past"
 * and hidden by the feature.
 */

export const DEMO_CLOCK = { day: 'Tuesday', hour: 10, minute: 0 };

// "spotsLeft: 0" marks a full class (guardrail: show "Full", disable save).
export const CLASSES = [
  {
    id: 'c1',
    name: 'Morning Yoga Flow',
    start: '08:00',
    lengthMin: 45,
    room: 'Studio A',
    intensity: 'Beginner',
    spotsLeft: 8,
    timeOfDay: 'Morning',
    whatToExpect:
      'A gentle, mat-based class that moves slowly through basic poses. No experience needed — the instructor demos every pose and offers options if a position feels tricky.',
  },
  {
    id: 'c2',
    name: 'Spin & Sweat',
    start: '10:30',
    lengthMin: 30,
    room: 'Cycle Studio',
    intensity: 'Intermediate',
    spotsLeft: 5,
    timeOfDay: 'Morning',
    whatToExpect:
      'A high-energy indoor cycling session set to music. You control your own resistance, so you can go at your pace. Bring a water bottle and arrive five minutes early to set up your bike.',
  },
  {
    id: 'c3',
    name: 'Beginner Strength',
    start: '11:30',
    lengthMin: 45,
    room: 'Weight Room 2',
    intensity: 'Beginner',
    spotsLeft: 10,
    timeOfDay: 'Morning',
    whatToExpect:
      'A coach-led intro to basic lifts with light dumbbells and bodyweight. You will learn safe form for squats, hinges, and presses. No prior lifting experience needed.',
  },
  {
    id: 'c4',
    name: 'HIIT Express',
    start: '12:15',
    lengthMin: 30,
    room: 'Studio B',
    intensity: 'Advanced',
    spotsLeft: 0,
    timeOfDay: 'Afternoon',
    whatToExpect:
      'A fast-paced interval circuit with short rest. Expect jumping, sprinting, and bodyweight work at high intensity. Best if you are already comfortable with burpees and mountain climbers.',
  },
  {
    id: 'c5',
    name: 'Lunchtime Stretch',
    start: '13:00',
    lengthMin: 20,
    room: 'Studio A',
    intensity: 'Beginner',
    spotsLeft: 14,
    timeOfDay: 'Afternoon',
    whatToExpect:
      'A short, standing-and-seated mobility break to reset midday. No mat required. A relaxed, low-pressure session — perfect if you have never taken a class before.',
  },
  {
    id: 'c6',
    name: 'Zumba Dance',
    start: '16:30',
    lengthMin: 50,
    room: 'Studio B',
    intensity: 'Intermediate',
    spotsLeft: 12,
    timeOfDay: 'Afternoon',
    whatToExpect:
      'A follow-along dance fitness class set to upbeat music. You do not need to be a dancer — just keep moving. The instructor calls out moves clearly and repeats them.',
  },
  {
    id: 'c7',
    name: 'Power Vinyasa',
    start: '17:30',
    lengthMin: 60,
    room: 'Studio A',
    intensity: 'Advanced',
    spotsLeft: 6,
    timeOfDay: 'Evening',
    whatToExpect:
      'A faster, stronger yoga flow with longer holds and balance work. Some familiarity with sun salutations helps. The room is warm but not heated.',
  },
  {
    id: 'c8',
    name: 'Evening Beginner Circuit',
    start: '18:30',
    lengthMin: 40,
    room: 'Weight Room 2',
    intensity: 'Beginner',
    spotsLeft: 9,
    timeOfDay: 'Evening',
    whatToExpect:
      'A coach-led circuit that rotates through simple stations — step-ups, rows, planks. Every station has an easier option, and the coach checks your form throughout.',
  },
  {
    id: 'c9',
    name: 'Boxing Fit',
    start: '19:30',
    lengthMin: 45,
    room: 'Studio B',
    intensity: 'Intermediate',
    spotsLeft: 4,
    timeOfDay: 'Evening',
    whatToExpect:
      'A bag-based boxing workout mixing combos and conditioning. Hand wraps are provided. You will partner up for pad rounds, but no contact sparring is involved.',
  },
  {
    id: 'c10',
    name: 'Wind-Down Yoga',
    start: '20:30',
    lengthMin: 35,
    room: 'Studio A',
    intensity: 'Beginner',
    spotsLeft: 11,
    timeOfDay: 'Evening',
    whatToExpect:
      'A slow, restorative class focused on stretching and breath. Mostly floor-based poses held for longer. A calm way to end the day, with zero pressure to "keep up".',
  },
];
