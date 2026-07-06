export function buildMockAnalysis({ code = '', language = 'JavaScript' }) {
  const lineCount = code.split('\n').filter(Boolean).length || 6;
  const score = Math.max(58, Math.min(96, 100 - lineCount * 2 + Math.floor(Math.random() * 12)));

  return {
    score,
    performance: score > 80 ? 'A' : score > 65 ? 'B' : 'C',
    security: score > 75 ? 'Good' : 'Review',
    explanation: [
      `This ${language} snippet defines the core logic the function relies on.`,
      'Variables are declared up front, then used inside the main control flow.',
      'A loop or conditional drives the primary computation in the body.',
      'The result is returned (or logged) at the end of the function.',
    ],
    bugs: score < 85 ? [
      { severity: 'Medium', title: 'Unhandled edge case', detail: 'An empty or null input isn\u2019t guarded against before use.' },
      { severity: 'Low', title: 'Inefficient loop', detail: 'Consider memoizing repeated lookups inside the loop body.' },
    ] : [],
    optimizedCode: `// Optimized version\n${code.trim() || '// (no code provided)'}\n\n// Suggestion: extract repeated logic into a helper\n// and add input validation at the top of the function.`,
    tests: `// Generated test cases\ntest('handles typical input', () => {\n  // arrange, act, assert\n});\n\ntest('handles empty input gracefully', () => {\n  // arrange, act, assert\n});`,
  };
}

export const mockStats = {
  totalReviews: 47,
  averageScore: 82,
  bugsFound: 113,
  improvementLevel: 'Advanced',
};

export const mockScoreHistory = [
  { label: 'Wk 1', score: 58 }, { label: 'Wk 2', score: 64 }, { label: 'Wk 3', score: 61 },
  { label: 'Wk 4', score: 70 }, { label: 'Wk 5', score: 75 }, { label: 'Wk 6', score: 73 },
  { label: 'Wk 7', score: 80 }, { label: 'Wk 8', score: 82 },
];

export const mockActivity = [
  { label: 'Mon', reviews: 3 }, { label: 'Tue', reviews: 5 }, { label: 'Wed', reviews: 2 },
  { label: 'Thu', reviews: 7 }, { label: 'Fri', reviews: 4 }, { label: 'Sat', reviews: 1 }, { label: 'Sun', reviews: 6 },
];

export const mockHistory = [
  { id: '1', title: 'Binary search implementation', language: 'Java', score: 88, date: '2026-06-24' },
  { id: '2', title: 'User auth middleware', language: 'JavaScript', score: 74, date: '2026-06-21' },
  { id: '3', title: 'Data cleaning pipeline', language: 'Python', score: 91, date: '2026-06-18' },
  { id: '4', title: 'REST controller for orders', language: 'Java', score: 67, date: '2026-06-14' },
  { id: '5', title: 'Form validation hook', language: 'JavaScript', score: 95, date: '2026-06-10' },
  { id: '6', title: 'Pandas dataframe merge util', language: 'Python', score: 79, date: '2026-06-05' },
];

export const mockInsights = [
  'Your code readability improved by 15% over the last month.',
  'Bug density dropped from 1 issue per 20 lines to 1 per 35.',
  'You\u2019re writing 30% more test cases per review than last month.',
];

export const testimonials = [
  { name: 'Mahek Pirjade.', role: 'SDE Intern, fintech startup', quote: 'I finally understand why my code gets flagged in review \u2014 LogicLens explains it before my mentor has to.' },
  { name: 'Anah Sayyed.', role: 'Final-year CS student', quote: 'The optimized-code suggestions read like something a senior engineer would leave in a PR comment.' },
  { name: 'Zain Shaikh', role: 'Junior backend developer', quote: 'Test case generation alone saves me an hour a day. The score tracking keeps me honest about progress.' },
];
