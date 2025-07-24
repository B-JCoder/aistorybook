-- Insert default story templates
INSERT INTO story_templates (name, description, content_structure, category) VALUES
(
  'Hero''s Journey',
  'A character goes on an adventure and learns valuable lessons',
  'Introduction of hero -> Call to adventure -> Meeting a mentor -> Facing challenges -> Final confrontation -> Return with wisdom',
  'Adventure'
),
(
  'Problem & Solution',
  'A character faces a challenge and finds a creative solution',
  'Problem introduction -> Character''s initial attempts -> Seeking help -> Discovery of solution -> Implementation -> Resolution',
  'Educational'
),
(
  'Friendship Tale',
  'A story about making friends and working together',
  'Character alone -> Meeting potential friend -> Misunderstanding or conflict -> Working together -> Friendship formed',
  'Friendship'
),
(
  'Moral Lesson',
  'A story that teaches an important life lesson',
  'Character with flaw -> Situation that tests character -> Consequences of actions -> Realization -> Changed behavior',
  'Educational'
),
(
  'Magical Adventure',
  'An adventure in a world full of magic and wonder',
  'Discovery of magic -> Entry to magical world -> Meeting magical creatures -> Quest or challenge -> Return to normal world',
  'Fantasy'
);
