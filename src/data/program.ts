import { DayContent } from '@/types';

export const programDays: DayContent[] = [
  // ============================================================
  // WEEK 1: EXCAVATION (Days 1-7)
  // ============================================================

  // Day 1: VIDEO_JOURNAL — "The Timeline of Aliveness"
  {
    dayNumber: 1,
    week: 1,
    phase: 'excavation',
    title: 'The Timeline of Aliveness',
    type: 'video_journal',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Most people can tell you what they do. Very few can tell you why they do it. Over the next 28 days, you're going to figure that out. Not with personality quizzes or career aptitude tests. With honesty, reflection, and a willingness to look at your own life as evidence. Today we start with a simple question: when have you felt most alive? Watch this talk, then we dig in.",
    marcusNudge:
      "Your timeline doesn't need to be perfect. It needs to be honest. When did you lose track of time? When did work not feel like work? Those moments are data.",
    marcusClose:
      "You just drew the first map of your own aliveness. Most people never do this. Look at what you wrote. The answers aren't in the future. They're already in your past, waiting for you to notice them.",
    video: {
      title: 'How Great Leaders Inspire Action',
      speaker: 'Simon Sinek',
      youtubeId: 'qp0HIF3SfI4',
      durationMinutes: 18,
      preWatchNote:
        "Sinek talks about the 'Golden Circle' — why some people and organizations inspire while others don't. Pay attention to what resonates with you personally, not just professionally.",
      postWatchPrompts: [
        'What moment in the talk hit you hardest? Why do you think that is?',
        "Sinek says people don't buy what you do, they buy why you do it. Do you know your 'why' yet?",
        'Think about a leader, teacher, or person who inspired you. What was their why?',
      ],
    },
    prompts: [
      {
        id: 'd1-timeline',
        text: "Draw a timeline of your life from age 5 to now. Mark the moments when you felt most alive — not successful, not productive, alive. These could be tiny moments. A conversation. A project. A random Tuesday afternoon. What were you doing? Who were you with? What made that moment different?",
        subPrompts: [
          'List at least 5 moments of genuine aliveness, at any age.',
          'For each moment, write 2-3 sentences about what made it special.',
          'Do you notice anything these moments have in common?',
        ],
        estimatedMinutes: 12,
      },
    ],
    afterNote:
      'Tomorrow we flip the script. Instead of looking at what made you come alive, we look at what you\'ve been telling the world about yourself — and whether any of it is actually true.',
  },

  // Day 2: JOURNAL — "The Anti-Resume"
  {
    dayNumber: 2,
    week: 1,
    phase: 'excavation',
    title: 'The Anti-Resume',
    type: 'journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Your resume is a highlight reel. Today we write the version nobody sees. The roles you took because they sounded impressive. The skills you developed because someone told you to. The career moves that looked great on paper but felt hollow on Monday morning. Honesty is the only tool that works here.",
    marcusNudge:
      "This isn't about self-pity. It's about accuracy. You can't navigate somewhere new if you're lying about where you are right now.",
    marcusClose:
      "That took courage. Most people spend their whole lives defending a story about themselves that isn't true. You just put yours on paper and looked at it. That's not weakness. That's the beginning of clarity.",
    prompts: [
      {
        id: 'd2-anti-resume',
        text: "Write your Anti-Resume. List the jobs, roles, accomplishments, and skills that look good on paper but don't actually reflect who you are or what you care about.",
        subPrompts: [
          'Which achievements did you pursue because someone else wanted you to?',
          'What skills have you developed that you hope you never have to use again?',
          'Which job title or role felt most dishonest to who you actually are?',
        ],
        estimatedMinutes: 10,
      },
      {
        id: 'd2-honest-version',
        text: "Now write the honest version. If you could describe your career and life so far with zero concern for how it sounds to other people, what would you say?",
        subPrompts: [
          "What have you actually enjoyed doing, regardless of whether it 'counts'?",
          "What would you do more of if nobody was watching or judging?",
          "What's the gap between who you present to the world and who you actually are?",
        ],
        estimatedMinutes: 10,
      },
    ],
    afterNote:
      'Keep this anti-resume close. We will come back to it. The gap between the public story and the private truth is where your real direction hides.',
  },

  // Day 3: VIDEO_JOURNAL — "The Childhood Thread"
  {
    dayNumber: 3,
    week: 1,
    phase: 'excavation',
    title: 'The Childhood Thread',
    type: 'video_journal',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "There's a version of you that existed before the world told you who to be. Before college, before career pressure, before you learned to optimize for other people's approval. Today we go back to find that person. The things you loved at 8 years old are not random. They are clues.",
    marcusNudge:
      "Don't filter childhood memories through adult logic. A kid who spent hours building with LEGO wasn't 'developing spatial reasoning.' They were doing something they couldn't stop doing. That's the signal.",
    marcusClose:
      "The thread between who you were as a child and who you are now is probably thinner than you'd like. But it's still there. You just traced it. That thread doesn't break — it just gets buried under expectations and practicality. Your job this week is to keep pulling on it.",
    video: {
      title: 'Understanding Empathy',
      speaker: 'Simon Sinek',
      youtubeId: 'sIOk-gll0Mo',
      durationMinutes: 8,
      preWatchNote:
        "Sinek talks about difficult times and what they reveal about who we are. As you watch, think about the difficult moments in your own childhood and what they taught you about yourself.",
      postWatchPrompts: [
        'What difficult experience from your early life shaped who you are today?',
        'How did you respond to challenges as a kid? Do you still respond that way?',
        'What did your younger self know about you that your adult self has forgotten?',
      ],
    },
    prompts: [
      {
        id: 'd3-childhood',
        text: 'Go back to ages 6-12. What did you do when nobody was telling you what to do? What did you play? What did you build, draw, read, or explore? Write about at least 3 specific memories.',
        subPrompts: [
          'What could you do for hours without getting bored?',
          "What did adults compliment you on that you didn't think was a big deal?",
          'What did you want to be "when you grew up" — and why that, specifically?',
        ],
        estimatedMinutes: 10,
      },
      {
        id: 'd3-thread',
        text: "Now look at your Day 1 timeline and today's childhood memories side by side. What threads connect them? What patterns do you see between the child you were and the adult moments where you felt most alive?",
        estimatedMinutes: 8,
      },
    ],
  },

  // Day 4: ACTION — "The Friends Exercise"
  {
    dayNumber: 4,
    week: 1,
    phase: 'excavation',
    title: 'The Friends Exercise',
    subtitle: 'A real conversation with a real person',
    type: 'action',
    estimatedMinutes: 20,
    isRestDay: false,
    requiresOtherPerson: true,
    marcusIntro:
      "Today is different. No journaling. No videos. Today you pick up the phone and call someone who actually knows you. Not text. Call. You're going to ask them one question that most people never ask: \"Why are we friends?\" Their answer will tell you something about yourself that you can't see from the inside.",
    marcusNudge:
      "This will feel uncomfortable. Do it anyway. The question isn't weird — it's honest. And honest questions are the only ones worth asking.",
    marcusClose:
      "What did they say? Most people are surprised by the answer. Your friends don't keep you around because of your job title or your accomplishments. They keep you around because of something deeper. Whatever they said — write it down. That's a piece of your why.",
    actionSteps: [
      {
        stepNumber: 1,
        title: 'Choose your person',
        description:
          "Pick a friend who has known you for at least a few years. Someone who would describe your friendship as real, not just convenient. Not a parent or partner — a friend.",
      },
      {
        stepNumber: 2,
        title: 'Make the call',
        description:
          "Call them. Not text, not voice note — an actual call. Tell them you're doing some self-reflection and you have one honest question for them: \"Why are we friends? What is it about me that made you want to stay in my life?\"",
      },
      {
        stepNumber: 3,
        title: 'Listen and capture',
        description:
          "Don't argue with their answer. Don't deflect. Just listen. After the call, write down exactly what they said — their words, not your interpretation.",
      },
      {
        stepNumber: 4,
        title: 'Reflect',
        description:
          "What surprised you about their answer? What did they see in you that you don't see in yourself? How does their answer connect to what you've written so far this week?",
      },
    ],
    afterNote:
      "If you couldn't reach someone today, try tomorrow morning before Day 5. This exercise matters. Other people are mirrors — and right now you need to see a reflection you can't manufacture yourself.",
  },

  // Day 5: JOURNAL — "Peak Experience Deep-Dive"
  {
    dayNumber: 5,
    week: 1,
    phase: 'excavation',
    title: 'Peak Experience Deep-Dive',
    type: 'journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "On Day 1 you marked the moments when you felt most alive. Today you go deeper. Not bullet points — full stories. The details matter. What you were wearing, who was in the room, what time of day it was. The specifics are where the meaning hides.",
    marcusNudge:
      "Write like you're telling a friend the story over coffee. Don't summarize. Describe. The more vivid the memory, the more useful the pattern.",
    marcusClose:
      "Three stories. Three moments of being fully yourself. Read them back slowly. Something in these stories is trying to tell you who you are. Can you hear it yet?",
    prompts: [
      {
        id: 'd5-peak1',
        text: 'Pick the first moment of aliveness from your Day 1 timeline. Write the full story. Not a summary — a scene. Where were you? What were you doing? What made this moment different from ordinary life?',
        subPrompts: [
          'What were you feeling in your body during this moment?',
          'What skill or quality of yours was being used?',
          'If you could live in that moment forever, what specifically would you be doing?',
        ],
        estimatedMinutes: 7,
      },
      {
        id: 'd5-peak2',
        text: "Now the second moment. Same depth. Write it like you want someone who wasn't there to understand exactly what it felt like.",
        subPrompts: [
          'What role were you playing in this moment? Leader, creator, helper, explorer?',
          'Who else was involved, and what was your relationship to them?',
          "What would have been different if you'd been doing this for money versus for love?",
        ],
        estimatedMinutes: 7,
      },
      {
        id: 'd5-peak3',
        text: "The third moment. Go all the way in. This is the most important writing you'll do this week.",
        subPrompts: [
          'Why this memory and not another one? What made you choose it?',
          'What were you contributing to — a person, a project, an idea?',
          'If someone watched you during this moment, what would they say you were born to do?',
        ],
        estimatedMinutes: 7,
      },
    ],
  },

  // Day 6: JOURNAL — "The Patterns Emerge"
  {
    dayNumber: 6,
    week: 1,
    phase: 'excavation',
    title: 'The Patterns Emerge',
    type: 'journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "You've spent five days collecting evidence. Childhood memories, peak experiences, honest assessments, a friend's perspective. Today you lay all that evidence on the table and look for patterns. Not what you think should be there. What's actually there.",
    marcusNudge:
      "Patterns aren't always obvious. Sometimes the connection between a childhood memory and an adult peak experience is a feeling, not an activity. Look for the emotional thread, not just the situational one.",
    marcusClose:
      "You just wrote your first draft of a WHY statement. It's probably not perfect. It shouldn't be. But somewhere in what you wrote is the seed of something true. Hold onto it loosely. We'll refine it in the weeks ahead.",
    prompts: [
      {
        id: 'd6-patterns',
        text: "Reread everything you've written this week — Days 1 through 5, plus what your friend told you on Day 4. What patterns do you see? List every recurring theme, feeling, activity, or quality that shows up more than once.",
        subPrompts: [
          'What words or ideas keep appearing across different entries?',
          'Is there a specific feeling that connects your best moments?',
          "What role do you consistently play when you're at your best — teacher, builder, connector, protector?",
        ],
        estimatedMinutes: 10,
      },
      {
        id: 'd6-why-draft',
        text: "Based on everything so far, write a rough first draft of your WHY. Use this format: \"To [your contribution] so that [the impact on others].\" It's okay if it's clumsy. Sinek's format is just a starting point. Write 2-3 versions and see which one feels closest to true.",
        subPrompts: [
          'Which version makes you feel something when you read it out loud?',
          'Which version would your friend from Day 4 recognize as you?',
          'Which version, if you lived it fully, would make you proud?',
        ],
        estimatedMinutes: 10,
      },
    ],
    afterNote:
      'Week 1 is almost done. You have more self-knowledge right now than most people accumulate in years of autopilot. Tomorrow we rest. You earned it.',
  },

  // Day 7: REST — "Rest + Absorb"
  {
    dayNumber: 7,
    week: 1,
    phase: 'excavation',
    title: 'Rest + Absorb',
    type: 'rest',
    estimatedMinutes: 15,
    isRestDay: true,
    requiresOtherPerson: false,
    marcusIntro:
      "No writing today. No exercises. Your brain has been doing heavy lifting all week and it needs space to process. Watch this short video, then do whatever feels right. Go for a walk. Sit with a coffee. Let the week's work settle. Insights don't always come when you're trying. Sometimes they come when you stop.",
    marcusClose:
      "Week 1 is done. You've excavated more about yourself in seven days than most people do in seven years. Next week we take everything you've uncovered and start building clarity from it. Rest well.",
    video: {
      title: 'Think It Into Existence',
      speaker: 'Jay Shetty',
      youtubeId: '4cGnWEhSHkE',
      durationMinutes: 15,
      preWatchNote:
        "This is a rest day, so just watch and absorb. No notes required. Let this one land however it lands.",
      postWatchPrompts: [],
    },
  },

  // ============================================================
  // WEEK 2: CLARITY (Days 8-14)
  // ============================================================

  // Day 8: JOURNAL — "Values Excavation"
  {
    dayNumber: 8,
    week: 2,
    phase: 'clarity',
    title: 'Values Excavation',
    type: 'journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Welcome to Week 2. Last week was about excavation — digging up the raw material. This week is about clarity. We start with values. Not the ones you think you should have. Not the ones that look good in a LinkedIn bio. The ones you actually live by when nobody is watching. You're about to find out if the life you're building matches the life you actually want.",
    marcusNudge:
      "When you're cutting from 20 to 10 to 5, pay attention to what hurts to let go of. The ones that hurt are the real ones.",
    marcusClose:
      "Five values. These are your non-negotiables. Everything you build from here should honor at least three of them. If your current life doesn't honor any, that's not a failure — that's information.",
    prompts: [
      {
        id: 'd8-values-20',
        text: "Start by writing down 20 things you value. Don't overthink it. Include everything — freedom, family, creativity, money, adventure, stability, recognition, solitude, impact, beauty, health, learning, loyalty, humor, justice, connection, independence, mastery, simplicity, courage. Use these as a starting list, add your own, and write down the first 20 that feel real.",
        estimatedMinutes: 5,
      },
      {
        id: 'd8-values-10',
        text: 'Now cut to 10. Cross out the ones you could live without. Not easily — but if you had to choose, which ones stay? For each one you keep, write one sentence about why it matters to you personally, not in theory.',
        estimatedMinutes: 7,
      },
      {
        id: 'd8-values-5',
        text: "Final cut. Five values. These are the hills you'd die on. The things that, if missing from your life, would make everything feel wrong no matter how successful you appeared. Write each one down and then write a specific moment when you honored this value and a specific moment when you violated it.",
        subPrompts: [
          'Which of these 5 values is most present in your current daily life?',
          'Which is most absent?',
          'If you could only keep one, which would it be — and what does that tell you?',
        ],
        estimatedMinutes: 10,
      },
    ],
  },

  // Day 9: JOURNAL — "Energy Audit"
  {
    dayNumber: 9,
    week: 2,
    phase: 'clarity',
    title: 'Energy Audit',
    type: 'journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Forget passion for a moment. Passion is a feeling, and feelings are unreliable. Energy is a fact. Some things give you energy — you do them and feel more awake than when you started. Other things drain you — even if you're good at them, they leave you hollow. Today you audit your energy. The results might surprise you.",
    marcusNudge:
      "Be specific. 'Work' doesn't drain your energy. Something specific about work does. Meetings with a certain kind of person. Tasks that require a certain kind of thinking. Get granular.",
    marcusClose:
      "You now have a map of what energizes you and what drains you. This is more useful than any personality test. Energy doesn't lie. If something consistently drains you, it doesn't matter how good you are at it — it's pulling you away from your best life.",
    prompts: [
      {
        id: 'd9-energy-gives',
        text: "List everything in your current life that gives you energy. Activities, people, environments, types of work, times of day, situations. Be specific. Not 'exercise' but 'running alone in the morning with no music.' Not 'friends' but 'deep one-on-one conversations about ideas.'",
        subPrompts: [
          'What activities make you lose track of time?',
          'After which interactions do you feel more like yourself?',
          'What environments make you feel most awake and present?',
        ],
        estimatedMinutes: 8,
      },
      {
        id: 'd9-energy-drains',
        text: "Now list everything that drains your energy. Same level of specificity. Include things you're good at — being good at something doesn't mean it gives you life.",
        subPrompts: [
          'What tasks do you procrastinate on even though you could easily do them?',
          'After which interactions do you feel smaller or more tired?',
          'What parts of your day do you dread, even slightly?',
        ],
        estimatedMinutes: 8,
      },
      {
        id: 'd9-energy-ratio',
        text: "Look at both lists. What's your ratio? Is your current life tilted toward energy-giving or energy-draining activities? If you could shift 20% of your time from the draining column to the energizing column, what would change?",
        estimatedMinutes: 5,
      },
    ],
  },

  // Day 10: VIDEO_JOURNAL — "Strengths vs Skills"
  {
    dayNumber: 10,
    week: 2,
    phase: 'clarity',
    title: 'Strengths vs Skills',
    type: 'video_journal',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "There's a difference between what you can do and what you were built to do. Skills are learned. Strengths are innate. You can be highly skilled at something that has nothing to do with your strengths — and that's a recipe for a successful but miserable life. Today we separate the two.",
    marcusNudge:
      "A strength isn't just something you're good at. It's something that makes you feel strong when you do it. That distinction changes everything.",
    marcusClose:
      "Skills pay the bills. Strengths build the life. If you can find work that uses your top strengths and requires skills you actually enjoy developing, you've found something rare. Hold that thought — we're building toward it.",
    video: {
      title: 'StandOut: Strengths Assessment',
      speaker: 'Marcus Buckingham',
      youtubeId: 'wMlGDJw5dDE',
      durationMinutes: 20,
      preWatchNote:
        "Buckingham distinguishes between strengths and skills in a way most people never consider. As you watch, start mentally sorting your own abilities into two buckets: things you can do well, and things that make you feel strong.",
      postWatchPrompts: [
        "What's one thing you're good at that actually drains you? That's a skill, not a strength.",
        "What's one thing that makes you feel strong even if you're not the best at it? That's a strength.",
        'How much of your current work uses your strengths versus just your skills?',
      ],
    },
    prompts: [
      {
        id: 'd10-strengths',
        text: "List your genuine strengths — activities and abilities that make you feel strong, energized, and in flow when you use them. These aren't just things you're good at. They're things that feel like home when you do them.",
        subPrompts: [
          'What do people come to you for help with?',
          'What do you do better than most people without really trying?',
          'What skill would you develop even if nobody paid you for it?',
        ],
        estimatedMinutes: 7,
      },
      {
        id: 'd10-skills',
        text: "Now list your acquired skills — things you've learned to do well but that don't necessarily energize you. Be honest about which skills you'd happily never use again.",
        estimatedMinutes: 5,
      },
    ],
  },

  // Day 11: ACTION — "The Outsider Perspective"
  {
    dayNumber: 11,
    week: 2,
    phase: 'clarity',
    title: 'The Outsider Perspective',
    subtitle: "See yourself through others' eyes",
    type: 'action',
    estimatedMinutes: 20,
    isRestDay: false,
    requiresOtherPerson: true,
    marcusIntro:
      "Day 4 you talked to one person. Today you talk to three. You have blind spots. Everyone does. The only way to see them is through other people. Today you reach out to three people who know you in different contexts — a colleague, a friend, a family member — and ask them two questions that will reveal how the world actually sees you.",
    marcusNudge:
      "Don't choose people who will just tell you what you want to hear. Choose people who will tell you the truth. Compliments feel nice. Accuracy is useful.",
    marcusClose:
      "Three perspectives. Some of what they said probably confirmed things you already knew. But there's likely something in there that surprised you — something you do or bring to the table that you take completely for granted. That blind spot is gold. Write it down.",
    actionSteps: [
      {
        stepNumber: 1,
        title: 'Choose 3 people from different parts of your life',
        description:
          "One from work or professional life. One close friend. One family member or long-term acquaintance. You need different angles, not just different people.",
      },
      {
        stepNumber: 2,
        title: 'Ask 2 questions',
        description:
          "Reach out to each person (call, text, or in person) and ask: (1) \"What do you think I'm best at — the thing that comes naturally to me that might not come naturally to others?\" (2) \"If you had to describe what makes me 'me' to a stranger, what would you say?\"",
      },
      {
        stepNumber: 3,
        title: 'Record their exact words',
        description:
          "Write down what each person said — their words, not your paraphrase. Note which answers surprised you and which confirmed what you already suspected.",
      },
      {
        stepNumber: 4,
        title: 'Find the overlap',
        description:
          "Look across all three answers. What do they agree on? Where do they differ? How does their perception match or differ from your self-perception from the past 10 days of work?",
      },
    ],
    afterNote:
      "If you can't reach all three people today, do your best and follow up tomorrow. The more data you collect, the clearer the picture gets.",
  },

  // Day 12: JOURNAL — "The Work Identity Map"
  {
    dayNumber: 12,
    week: 2,
    phase: 'clarity',
    title: 'The Work Identity Map',
    type: 'journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "You've been digging into who you are. Now we map what your ideal work life actually looks like — not the job title, the daily experience. Most people chase titles and salaries and then wonder why they're unhappy at 3pm on a Wednesday. Today you design the Wednesday, not the business card.",
    marcusNudge:
      "Think about texture, not labels. Do you want a quiet morning or a buzzing office? A team around you or deep solo work? The details of your ideal day reveal more than any job description.",
    marcusClose:
      "You just designed a work life based on who you actually are — not who the market says you should be. This map is going to become very important in Week 3 when we start looking at actual paths. Keep it honest.",
    prompts: [
      {
        id: 'd12-ideal-day',
        text: 'Describe your ideal workday in detail, hour by hour. Not a fantasy — a realistic day that uses your strengths, honors your values, and gives you energy. What time do you wake up? What does your morning look like? When do you do your best work? What kind of work is it? Who are you interacting with? How does the day end?',
        estimatedMinutes: 10,
      },
      {
        id: 'd12-preferences',
        text: 'Answer each of these honestly. There are no right answers — only your answers.',
        subPrompts: [
          'Do you want to lead others, or go deep on your own?',
          'Do you want variety every day, or deep consistency?',
          'Do you want to build something new, or improve something that exists?',
          'Do you want public visibility, or quiet impact?',
          'Do you want a team, a partner, or to work solo?',
          'Do you want structured time or flexible time?',
          'Are you willing to trade money for meaning, or do you need both equally?',
          'Do you want to be an expert in one thing, or a generalist across many?',
        ],
        estimatedMinutes: 10,
      },
    ],
  },

  // Day 13: SYNTHESIS — "Personal Operating Manual"
  {
    dayNumber: 13,
    week: 2,
    phase: 'clarity',
    title: 'Personal Operating Manual',
    type: 'synthesis',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Two weeks of excavation and clarity. Today you pull it all together into one document. Think of it as a Personal Operating Manual — a clear, honest account of who you are, what you need, and how you work best. This isn't for LinkedIn or a therapist. This is for you. The person who keeps forgetting what they actually want.",
    marcusNudge:
      "Don't write what sounds good. Write what's true. This document is only useful if it's honest. If reading it back makes you slightly uncomfortable, you're doing it right.",
    marcusClose:
      "You now have something that most people will never have: a clear, written account of who you are. Not who you wish you were. Not who others think you are. Who you actually are. This is your compass. Everything we build in Week 3 starts from this document.",
    prompts: [
      {
        id: 'd13-who-i-am',
        text: "Write your Personal Operating Manual. Use the following sections as a framework, drawing from everything you've written over the past 12 days. Be direct. Be specific. Be honest.",
        subPrompts: [
          'MY VALUES: List your top 5 values from Day 8 with one sentence each about what they mean to you in practice.',
          'MY STRENGTHS: What are you genuinely built to do? (From Days 5, 10, and 11)',
          'MY ENERGY: What gives you life and what drains it? (From Day 9)',
          'MY PATTERNS: What themes keep showing up across your entire life? (From Days 1, 3, 5, 6)',
          'MY WHY (DRAFT): Your current best attempt at a why statement. (From Day 6, updated with everything since)',
          'MY WORK PREFERENCES: How do you do your best work? (From Day 12)',
          'MY BLIND SPOTS: What do others see that you miss? (From Days 4 and 11)',
        ],
        estimatedMinutes: 25,
      },
    ],
    afterNote:
      "Read this document out loud. Yes, out loud. It changes how you hear it. Mark anything that doesn't feel true and revise it. This is a living document — it will keep evolving.",
  },

  // Day 14: REST — "Rest + Reflect"
  {
    dayNumber: 14,
    week: 2,
    phase: 'clarity',
    title: 'Rest + Reflect',
    type: 'rest',
    estimatedMinutes: 15,
    isRestDay: true,
    requiresOtherPerson: false,
    marcusIntro:
      "Halfway point. Two weeks down, two to go. You've done real work — the kind that most people avoid their entire lives. Today, watch this short talk, then go back and reread your Personal Operating Manual from yesterday. Don't edit it. Just sit with it. Let yourself feel whatever comes up.",
    marcusClose:
      "The first half was about understanding who you are. The second half is about deciding what to do with that understanding. You're ready. Enjoy the rest. Next week we start building your future.",
    video: {
      title: 'The Psychology of Self-Motivation',
      speaker: 'Scott Geller',
      youtubeId: '7sxpKhIbr0E',
      durationMinutes: 15,
      preWatchNote:
        "This is your rest day. Watch with open curiosity, not an analytical lens. Then reread your Personal Operating Manual and just notice what you feel.",
      postWatchPrompts: [],
    },
  },

  // ============================================================
  // WEEK 3: VISION (Days 15-21)
  // ============================================================

  // Day 15: VIDEO_JOURNAL — "The Ikigai Framework"
  {
    dayNumber: 15,
    week: 3,
    phase: 'vision',
    title: 'The Ikigai Framework',
    type: 'video_journal',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Welcome to Week 3. You know who you are. Now we figure out what to do about it. The Ikigai framework comes from Japan — it maps the intersection of four things: what you love, what you're good at, what the world needs, and what you can be paid for. Most people optimize for one or two. Today you map all four.",
    marcusNudge:
      "Don't censor yourself when filling in the circles. Put everything down first, even the things that seem impractical. The magic happens at the intersections, and you can't find intersections if you leave circles half-empty.",
    marcusClose:
      "Four circles. Each one holds a piece of your future. Tomorrow we look for where they overlap. That overlap is where purpose, skill, meaning, and livelihood converge. That's where you're headed.",
    video: {
      title: 'How to Find Your Ikigai',
      speaker: 'Tim Tamashiro',
      youtubeId: 'pk-PcJS2QaI',
      durationMinutes: 15,
      preWatchNote:
        "The Ikigai framework is simple but powerful. As you watch, start thinking about your own four circles. You've already done most of the work in Weeks 1 and 2 — now you're organizing it.",
      postWatchPrompts: [
        'Which of the four circles is easiest for you to fill in? Which is hardest?',
        'Where do you think your biggest gap is right now?',
        "Does the idea of finding one 'purpose' feel liberating or overwhelming?",
      ],
    },
    prompts: [
      {
        id: 'd15-ikigai',
        text: "Fill in each of the four Ikigai circles. Use your Personal Operating Manual from Day 13 as your reference. Be generous with each list — we'll narrow later.",
        subPrompts: [
          'WHAT YOU LOVE: What activities, topics, and experiences genuinely light you up? (Pull from your energy audit, peak experiences, and childhood memories)',
          "WHAT YOU'RE GOOD AT: What strengths and developed skills do you bring? (Pull from Days 10, 11, and your friend conversations)",
          'WHAT THE WORLD NEEDS: What problems do you see that you care about? What needs do you notice that others ignore?',
          'WHAT YOU CAN BE PAID FOR: What do people already pay for that overlaps with any of the above? Think broadly — industries, roles, services, products.',
        ],
        estimatedMinutes: 15,
      },
    ],
  },

  // Day 16: JOURNAL — "The Intersection Hunt"
  {
    dayNumber: 16,
    week: 3,
    phase: 'vision',
    title: 'The Intersection Hunt',
    type: 'journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Yesterday you filled in four circles. Today you hunt for where they overlap. The sweet spot isn't just one circle — it's the center where all four meet, or at least where three of them do. Most people never look for these intersections because they're stuck thinking about career in terms of job titles instead of qualities. You're not going to make that mistake.",
    marcusNudge:
      "Don't try to find the perfect answer. Try to find 5-7 interesting overlaps. Some will be career paths. Some will be activities. Some will be ways of working. Write them all down.",
    marcusClose:
      "You now have a list of possible directions that are grounded in who you actually are — not in what's trending or what pays the most. Some of these will feel exciting. Some will feel terrifying. The ones that are both exciting and terrifying are usually the right ones.",
    prompts: [
      {
        id: 'd16-overlaps',
        text: "Look at your four Ikigai circles from yesterday. Where do items from different circles connect or overlap? An overlap can be a specific career, a type of work, a role, or even a quality of life. List every intersection you can find — even partial ones where only 2-3 circles meet.",
        estimatedMinutes: 10,
      },
      {
        id: 'd16-brainstorm',
        text: "From your overlaps, brainstorm 5-7 possible paths or directions. These don't need to be job titles. They can be descriptions like 'teaching creative skills to professionals' or 'building technology that helps people in crisis.' Be specific enough to be useful but broad enough to explore.",
        subPrompts: [
          'Which path excites you most before you let logic talk you out of it?',
          'Which path would surprise the people who know you?',
          "Which path feels impossible — and is the impossibility real or imagined?",
        ],
        estimatedMinutes: 10,
      },
    ],
  },

  // Day 17: JOURNAL — "Career Paths Research"
  {
    dayNumber: 17,
    week: 3,
    phase: 'vision',
    title: 'Career Paths Research',
    type: 'journal',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Dreaming is important. But dreams without data are just fantasies. Today you take your top 5 overlaps from yesterday and do actual research. What do these paths look like in practice? Who does this work? What does the day-to-day look like? What does it pay? What does it require? This is where vision meets reality.",
    marcusNudge:
      "The goal isn't to find the perfect path. It's to make each possibility more concrete. A vague dream can't become a plan. A researched possibility can.",
    marcusClose:
      "Five paths, each one now more real than it was this morning. Some probably got more appealing with research. Some probably got less. Both reactions are useful. You're not choosing yet — you're narrowing with evidence, not just emotion.",
    prompts: [
      {
        id: 'd17-research',
        text: 'Take your top 5 paths from yesterday. For each one, do 15-20 minutes of real research (internet, books, people you know) and answer these questions.',
        subPrompts: [
          'What does a typical day look like for someone on this path?',
          'What skills and qualifications does it require — and which do you already have?',
          'What does the income range look like, realistically?',
          'What are the biggest challenges or downsides people in this field mention?',
          'How does this path align with your top 5 values from Day 8?',
        ],
        estimatedMinutes: 25,
      },
    ],
  },

  // Day 18: VIDEO_JOURNAL — "The 'Hell Yes' Filter"
  {
    dayNumber: 18,
    week: 3,
    phase: 'vision',
    title: "The 'Hell Yes' Filter",
    type: 'video_journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "You have options now. Maybe too many. Today we apply a filter. Derek Sivers has a simple rule: if something isn't a 'hell yes,' it's a no. Most people fill their lives with 'sure, why not' and wonder why they never get to 'absolutely yes.' Today you find out which of your paths is a hell yes — and which is a polite maybe.",
    marcusNudge:
      "A 'hell yes' isn't just excitement. It's a deep pull. The difference between 'that sounds interesting' and 'I need to do that.' Trust your gut on this one.",
    marcusClose:
      "Some paths just got eliminated. That's not a loss — it's clarity. Every 'no' makes the remaining options stronger. What's left on your list? Those are the paths worth your life.",
    video: {
      title: "No 'yes.' Either 'HELL YEAH!' or 'no.'",
      speaker: 'Derek Sivers',
      youtubeId: '1ehWlVeMrqw',
      durationMinutes: 3,
      preWatchNote:
        "This is one of the shortest and most powerful talks you'll watch. Three minutes that might change how you make every decision going forward.",
      postWatchPrompts: [
        "How many things in your current life are a 'hell yes'?",
        "What are you holding onto that's really just a 'sure, why not'?",
        "What would your life look like if you only said yes to things that were a 'hell yes'?",
      ],
    },
    prompts: [
      {
        id: 'd18-filter',
        text: "Take each of your researched paths from Day 17 and run it through the 'hell yes' filter. Rate each one: Hell Yes, Warm Yes, Lukewarm, or No. Be honest — you're the only one reading this.",
        subPrompts: [
          'Which paths make you feel genuinely pulled forward, not just vaguely interested?',
          "Which paths are you holding onto because they seem 'smart' rather than because they light you up?",
          'After filtering, which 2-3 paths remain as your strongest options?',
        ],
        estimatedMinutes: 10,
      },
    ],
  },

  // Day 19: JOURNAL — "Future Self Letter"
  {
    dayNumber: 19,
    week: 3,
    phase: 'vision',
    title: 'Future Self Letter',
    type: 'journal',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "You've narrowed to 2-3 paths. Today we test each one with your imagination. For each remaining path, you're going to write a letter from your future self — the version of you who's been living that path for three years. Not a plan. A letter. What does your life feel like? What's your Tuesday morning like? What are you proud of? What do you miss?",
    marcusNudge:
      "Write in first person, present tense. 'I wake up at...' 'My mornings look like...' 'The hardest part is...' Make it vivid enough that you can feel the difference between each version of your future.",
    marcusClose:
      "Multiple futures, each one real enough to feel. Which letter was easiest to write? Which version of future-you did you like the most? Which one felt like coming home? Pay attention to your emotional response. Your gut already knows the answer. Your brain is just catching up.",
    prompts: [
      {
        id: 'd19-letter1',
        text: "PATH 1: Write a letter from the version of you who chose this path three years ago. Describe your life now. Where do you live? What does your work look like? Who are you surrounded by? What are you proud of? What was the hardest part? What do you wish you'd known when you started?",
        estimatedMinutes: 8,
      },
      {
        id: 'd19-letter2',
        text: "PATH 2: Same exercise, different path. Write from the version of you who chose this direction. Make it specific and honest — include both the wins and the struggles.",
        estimatedMinutes: 8,
      },
      {
        id: 'd19-letter3',
        text: "PATH 3 (if you have one): One more letter from one more future. Or, if you only have two paths, write a letter from the version of you who chose neither — who stayed on the current track for three more years. What does that person's life look like?",
        estimatedMinutes: 8,
      },
    ],
    afterNote:
      'Reread all the letters tomorrow morning with fresh eyes. The one that makes you feel the most is trying to tell you something.',
  },

  // Day 20: ACTION — "Talk to Someone Living It"
  {
    dayNumber: 20,
    week: 3,
    phase: 'vision',
    title: 'Talk to Someone Living It',
    subtitle: 'Get real data, not just theory',
    type: 'action',
    estimatedMinutes: 20,
    isRestDay: false,
    requiresOtherPerson: true,
    marcusIntro:
      "You've done the internal work. You've researched online. Now you need to talk to someone who's actually living one of your paths. Not reading about it. Not watching a TED talk about it. A real conversation with a real person who wakes up every day and does the thing you're considering. Nothing replaces this.",
    marcusNudge:
      "Most people are more willing to help than you think. A short, respectful message explaining that you're exploring this direction and would love 15 minutes of their time has a surprisingly high success rate. Send the message today, even if the conversation happens later.",
    marcusClose:
      "Real data from a real person who's living the path you're considering. That's worth more than a hundred hours of internet research. What did you learn that you couldn't have learned any other way? What confirmed your interest? What gave you pause?",
    actionSteps: [
      {
        stepNumber: 1,
        title: 'Identify someone on your top path',
        description:
          "Find one person who is currently working in or living one of your top 2-3 paths. This could be someone you know, a second-degree connection, or even someone you admire from afar. LinkedIn is useful here.",
      },
      {
        stepNumber: 2,
        title: 'Reach out respectfully',
        description:
          "Send a short, honest message: \"I'm going through a self-discovery process and your path is one I'm seriously considering. Would you be open to a 15-minute call so I can ask a few questions about your experience? I'd be deeply grateful.\"",
      },
      {
        stepNumber: 3,
        title: 'Prepare 5 questions',
        description:
          "Have these ready: (1) What does a typical day actually look like? (2) What's the best part that nobody talks about? (3) What's the hardest part that nobody talks about? (4) What do you wish you'd known before starting? (5) If you were starting over, would you choose this path again?",
      },
      {
        stepNumber: 4,
        title: 'Record and reflect',
        description:
          "After the conversation, write down everything that stood out. How did the conversation make you feel about this path — more drawn in or less? What surprised you?",
      },
    ],
    afterNote:
      "If you can't have the conversation today, at minimum send the outreach message. The worst that happens is they say no. The best that happens is you get clarity you can't get any other way.",
  },

  // Day 21: REST — "Rest + Marinate"
  {
    dayNumber: 21,
    week: 3,
    phase: 'vision',
    title: 'Rest + Marinate',
    type: 'rest',
    estimatedMinutes: 15,
    isRestDay: true,
    requiresOtherPerson: false,
    marcusIntro:
      "Three weeks done. You know who you are. You know what your options look like. Next week you decide. But not today. Today you rest, and you watch a talk that has nothing to do with career — and everything to do with why humans avoid the decisions that matter most. Enjoy this one.",
    marcusClose:
      "Three weeks of real work. You've gone from 'I don't know what to do with my life' to a short list of deeply researched, personally meaningful paths. That's not small. Next week, you choose. Rest up.",
    video: {
      title: 'Inside the Mind of a Master Procrastinator',
      speaker: 'Tim Urban',
      youtubeId: 'arj7oStGLkU',
      durationMinutes: 14,
      preWatchNote:
        "Tim Urban's talk is funny and disarming. But underneath the humor is a serious point about why we avoid the big decisions. Let it marinate.",
      postWatchPrompts: [],
    },
  },

  // ============================================================
  // WEEK 4: DECISION (Days 22-28)
  // ============================================================

  // Day 22: VIDEO_JOURNAL — "The Fear Inventory"
  {
    dayNumber: 22,
    week: 4,
    phase: 'decision',
    title: 'The Fear Inventory',
    type: 'video_journal',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Welcome to the final week. This is where people usually get stuck. Not because they don't know what they want — by now, you do — but because they're afraid. Fear is the last wall between you and a decision. Today we don't ignore the fear. We inventory it. We name it. We look at it clearly and ask: is this fear protecting me, or imprisoning me?",
    marcusNudge:
      "Fear that you can name has less power over you. The exercise you're about to do is uncomfortable by design. That discomfort is the sound of a wall cracking.",
    marcusClose:
      "You just looked your fears in the face and did the math on them. Most fears don't survive contact with paper. The worst case is rarely as bad as the vague dread. And the cost of inaction — the cost of staying where you are out of fear — is almost always higher than the cost of trying. You already know this. Now you've proven it to yourself.",
    video: {
      title: 'Why You Should Define Your Fears Instead of Your Goals',
      speaker: 'Tim Ferriss',
      youtubeId: '5J6jAC6XxAI',
      durationMinutes: 13,
      preWatchNote:
        "Ferriss calls this 'fear-setting' instead of goal-setting. It's a Stoic exercise that flips the usual approach on its head. Watch with your specific paths in mind.",
      postWatchPrompts: [
        'What is the worst case scenario for your top path — specifically?',
        'Could you recover from that worst case? How long would it take?',
        'What is the cost of doing nothing for another year?',
      ],
    },
    prompts: [
      {
        id: 'd22-fears',
        text: "Do Ferriss's fear-setting exercise for your top path. Three columns: Define, Prevent, Repair.",
        subPrompts: [
          "DEFINE: What are you afraid of, specifically? List every fear. Financial, social, emotional, practical. Don't hold back.",
          'PREVENT: For each fear, what could you do to reduce the probability of it happening? Be specific.',
          'REPAIR: If the worst did happen, what would you do to recover? Who would help you? How long would it take?',
        ],
        estimatedMinutes: 10,
      },
      {
        id: 'd22-cost-of-inaction',
        text: "Now the question most people skip: What is the cost of inaction? If you do nothing and stay exactly where you are for 6 months, 1 year, 3 years — what does that cost you? Emotionally, financially, physically, spiritually. Be as specific with this answer as you were with your fears.",
        estimatedMinutes: 7,
      },
    ],
  },

  // Day 23: JOURNAL — "The 10/10/10 Test"
  {
    dayNumber: 23,
    week: 4,
    phase: 'decision',
    title: 'The 10/10/10 Test',
    type: 'journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "Suzy Welch created a simple framework for tough decisions: How will you feel about this decision in 10 minutes? 10 months? 10 years? Most people optimize for the first 10 minutes — they avoid discomfort. The people who build lives they love optimize for the 10-year answer. Today you stress-test your decision across all three timeframes.",
    marcusNudge:
      "The 10-minute answer is usually fear. The 10-year answer is usually truth. Pay attention to which timeframe your gut keeps returning to.",
    marcusClose:
      "The 10/10/10 test cuts through the noise. If the 10-year answer is clear — if future you is glad you made the leap — then the 10-minute discomfort is a small price. You know this. You've always known this.",
    prompts: [
      {
        id: 'd23-10-minutes',
        text: 'Imagine you make your decision today — you commit to your top path. How will you feel in 10 minutes? Describe the immediate emotional reaction. The excitement, the panic, the relief, the doubt. All of it.',
        estimatedMinutes: 5,
      },
      {
        id: 'd23-10-months',
        text: "Now 10 months in. You've been on this path for almost a year. What does life look like? What's hard? What's better? What have you learned? What do you miss about the old life?",
        estimatedMinutes: 7,
      },
      {
        id: 'd23-10-years',
        text: "Ten years from now. You made this decision a decade ago. How do you feel about it? What did that decision make possible? Would you make it again? Now flip it — if you didn't make this decision, what does that 10-year version of you feel?",
        estimatedMinutes: 7,
      },
      {
        id: 'd23-verdict',
        text: 'Based on the 10/10/10 test, what is the decision telling you? Write it plainly.',
        estimatedMinutes: 3,
      },
    ],
  },

  // Day 24: JOURNAL — "The Body Compass"
  {
    dayNumber: 24,
    week: 4,
    phase: 'decision',
    title: 'The Body Compass',
    type: 'journal',
    estimatedMinutes: 25,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "You've done the rational analysis. Fear-setting, 10/10/10, research, conversations. Today we check in with the part of you that doesn't use words. Your body has been keeping score this entire time. That knot in your stomach, that lightness in your chest, that tension in your shoulders — these are data points your brain has been ignoring. Today we listen.",
    marcusNudge:
      "This might feel strange if you're used to making decisions with spreadsheets. But your body processes information faster than your conscious mind. The 'gut feeling' isn't mystical — it's your nervous system pattern-matching on decades of experience.",
    marcusClose:
      "Your body just told you something your mind has been debating for days. The body doesn't overthink. It doesn't make pro-con lists. It just knows. If you felt expansion and lightness around one path and contraction around another, that's not random. That's the deepest part of your intelligence weighing in.",
    prompts: [
      {
        id: 'd24-body-scan',
        text: 'Close your eyes. Take five slow breaths. Now say your top path out loud — the full sentence of what you would do. Notice what happens in your body. Where do you feel it? Does your chest open or tighten? Does your stomach settle or clench? Do your shoulders drop or rise? Write down every physical sensation without interpreting it.',
        estimatedMinutes: 5,
      },
      {
        id: 'd24-body-compare',
        text: 'Now do the same for your second path. And then for the option of staying where you are. Three options, three body responses. Describe each one.',
        estimatedMinutes: 7,
      },
      {
        id: 'd24-body-integration',
        text: "Now integrate everything — your rational analysis, your fear inventory, your 10/10/10 test, and your body's response. Which direction does all the evidence point?",
        subPrompts: [
          'Where do your head and your gut agree?',
          'Where do they disagree — and which one do you trust more right now?',
          'If you had to decide this second, with no more information and no more time, what would you choose?',
        ],
        estimatedMinutes: 8,
      },
    ],
  },

  // Day 25: JOURNAL — "Make the Decision"
  {
    dayNumber: 25,
    week: 4,
    phase: 'decision',
    title: 'Make the Decision',
    type: 'journal',
    estimatedMinutes: 20,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      'Today is the day. Not tomorrow, not next week, not after one more conversation. Today you write down the decision. "I am going to..." Four of the most powerful words in any language. You have done the work. You have the evidence. The only thing left is the act of choosing. And choosing, unlike analyzing, happens in a single moment.',
    marcusNudge:
      "Perfectionism is fear wearing a smart outfit. You will never have perfect information. You will never feel 100% ready. The decision to move forward despite imperfect conditions is what separates people who build the life they want from people who just think about it.",
    marcusClose:
      "You said it. You wrote it down. \"I am going to...\" That sentence just changed your trajectory. Not because the words are magic, but because you meant them. The next three days are about turning those words into action. The hard part — the deciding — is done.",
    prompts: [
      {
        id: 'd25-decision',
        text: "Write the sentence. Start with \"I am going to...\" and finish it. This is your decision. Not a plan, not a maybe, not an aspiration. A decision. Write it clearly enough that a stranger could read it and know exactly what you intend to do.",
        estimatedMinutes: 3,
      },
      {
        id: 'd25-why-this',
        text: "Now write why. Not for anyone else — for you. When you doubt this decision in three months (and you will), what do you need to remember? What evidence led you here? What does this decision honor about who you are?",
        estimatedMinutes: 7,
      },
      {
        id: 'd25-commitment',
        text: "Finally, write what you're willing to sacrifice and what you're not willing to sacrifice to make this happen. Every decision has costs. Name them. And name the things that are non-negotiable — the values, relationships, and boundaries you will protect no matter what.",
        estimatedMinutes: 7,
      },
    ],
    afterNote:
      "Read your decision out loud. The version of you who started this program 25 days ago would barely recognize the person writing this. That's growth. That's what showing up every day for yourself looks like.",
  },

  // Day 26: SYNTHESIS — "The 90-Day Action Plan"
  {
    dayNumber: 26,
    week: 4,
    phase: 'decision',
    title: 'The 90-Day Action Plan',
    type: 'synthesis',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "A decision without a plan is a wish. Today you build the bridge between \"I am going to...\" and actually doing it. Ninety days. Three months. That's enough time to make real progress and short enough to stay focused. You're going to break your decision into monthly milestones and weekly actions. Clarity of direction is worthless without clarity of action.",
    marcusNudge:
      "Think small steps, not giant leaps. The person who applies to one job a day for 90 days accomplishes more than the person who plans to 'figure it all out this weekend.' Consistency beats intensity every time.",
    marcusClose:
      "You now have a map and a plan. Month by month, week by week. This isn't a rigid script — it's a compass bearing. Things will change, detours will happen, and some weeks will be harder than others. But you know where you're going and you know the first step. That puts you ahead of almost everyone.",
    prompts: [
      {
        id: 'd26-month1',
        text: 'MONTH 1: The Foundation. What do you need to do in the first 30 days to start moving toward your decision? Think: research, conversations, skill-building, applications, financial preparation, or mindset shifts. List 3-5 concrete actions with specific deadlines.',
        subPrompts: [
          'What is the single most important thing you could do in week one?',
          'What obstacle is most likely to show up, and how will you handle it?',
          'What does success look like at the end of Month 1?',
        ],
        estimatedMinutes: 8,
      },
      {
        id: 'd26-month2',
        text: "MONTH 2: The Build. By this point you'll have momentum. What does month two look like? What do you need to start, deepen, or accelerate? List 3-5 actions.",
        subPrompts: [
          'What skill or relationship do you need to develop in this phase?',
          'What financial, logistical, or emotional preparations need to happen?',
          'Who do you need to talk to or learn from?',
        ],
        estimatedMinutes: 8,
      },
      {
        id: 'd26-month3',
        text: "MONTH 3: The Commitment. This is where the path becomes real. What does month three look like? What's the milestone that means you've truly begun — not just planned, but started?",
        subPrompts: [
          "What does the 90-day finish line look like? How will you know you've succeeded?",
          'What will you celebrate when you get there?',
          "What's your plan if things haven't gone as expected by day 90?",
        ],
        estimatedMinutes: 8,
      },
    ],
  },

  // Day 27: ACTION — "The Accountability Setup"
  {
    dayNumber: 27,
    week: 4,
    phase: 'decision',
    title: 'The Accountability Setup',
    subtitle: 'Make it real by making it public',
    type: 'action',
    estimatedMinutes: 20,
    isRestDay: false,
    requiresOtherPerson: true,
    marcusIntro:
      "Decisions made in private die in private. Today you make your decision real by telling someone about it. Not posting on social media. Telling a specific person who will hold you to it. Accountability isn't about shame — it's about having someone who cares enough to ask \"how's it going?\" when you stop asking yourself.",
    marcusNudge:
      "Choose someone who will be honest with you, not just supportive. You need a person who will say \"are you actually doing the thing, or just thinking about it?\" That kind of honesty is a gift.",
    marcusClose:
      "You said it out loud to another person. It's real now. The plan isn't just in your journal — it's in someone else's awareness. They'll ask you about it. They'll check in. And on the days when your motivation dips (it will), their expectation becomes the bridge that carries you forward.",
    actionSteps: [
      {
        stepNumber: 1,
        title: 'Choose your accountability person',
        description:
          "Pick someone who will be honest with you, who cares about your growth, and who you respect enough that you'd feel embarrassed to quit. This could be a friend, mentor, partner, or family member.",
      },
      {
        stepNumber: 2,
        title: 'Share your decision and plan',
        description:
          "Tell them: what you decided, why, and what your 90-day plan looks like. Don't just share the highlight reel. Tell them what scares you about it too. Vulnerability creates accountability that cheerleading never will.",
      },
      {
        stepNumber: 3,
        title: 'Set up a check-in structure',
        description:
          "Agree on a regular check-in — weekly, biweekly, whatever works. Put it on both your calendars. Give them permission to ask hard questions. The structure matters more than the frequency.",
      },
      {
        stepNumber: 4,
        title: 'Consider a coach or mentor',
        description:
          "If your path involves a significant career change, consider finding a coach, mentor, or someone who's already been where you're going. One conversation with the right person can save months of trial and error.",
      },
    ],
    afterNote:
      'Tomorrow is the final day. You will reread everything you have written over the past 28 days, and you will take your first real step toward the life you just designed.',
  },

  // Day 28: SYNTHESIS — "The Reread + First Step"
  {
    dayNumber: 28,
    week: 4,
    phase: 'decision',
    title: 'The Reread + First Step',
    type: 'synthesis',
    estimatedMinutes: 30,
    isRestDay: false,
    requiresOtherPerson: false,
    marcusIntro:
      "This is the last day of the program, but the first day of what comes next. Before you do anything else, go back and read every journal entry you've written — from Day 1 to today. All of it. Read the person you were on Day 1 and notice how different you sound now. That distance is the work. Then, today, you take one real step. Not tomorrow. Today.",
    marcusNudge:
      "The step doesn't need to be dramatic. It needs to be real. Send the email, make the call, register for the course, update the resume, book the meeting. One concrete action that proves to yourself that this is happening.",
    marcusClose:
      "Twenty-eight days ago, you didn't know your why. You didn't know your values. You hadn't mapped your strengths, confronted your fears, or looked at your life with this level of honesty. Now you have a Personal Operating Manual, an Ikigai map, a decision, a 90-day plan, and an accountability partner. But more important than any of that — you have the habit of looking at yourself honestly. That habit will serve you for the rest of your life. The program is over. Your direction is not. Keep going.",
    prompts: [
      {
        id: 'd28-reread',
        text: "Go back and reread every journal entry from Day 1 through Day 27. Don't skim. Read. As you read, note the moments that surprise you — insights you'd forgotten, patterns you didn't see at the time, growth you didn't notice while it was happening.",
        subPrompts: [
          'What insight from the early days hits differently now than it did then?',
          "What pattern do you see across 28 days of writing that you couldn't have seen in a single day?",
          'What would you tell the Day 1 version of yourself?',
        ],
        estimatedMinutes: 10,
      },
      {
        id: 'd28-first-step',
        text: 'Now the first step. What is one concrete, specific action you will take TODAY — not tomorrow, not this week, today — that moves you toward the decision you made on Day 25? Write what it is, when you will do it, and how you will know it is done.',
        estimatedMinutes: 5,
      },
      {
        id: 'd28-letter-to-self',
        text: "Write a letter to yourself to open in 90 days. Tell yourself what you're feeling right now, what you're committing to, what you're afraid of, and what you're excited about. Seal it. Set a calendar reminder. Future you will need this letter more than you know.",
        estimatedMinutes: 10,
      },
    ],
    afterNote:
      "This isn't the end. It's the beginning with better equipment. You now have clarity most people never find. Use it. And when you lose it — because you will, temporarily — come back to your Personal Operating Manual, reread your journal, and remember who you are. The compass doesn't disappear. You just have to look at it.",
  },
];

export function getDayContent(dayNumber: number): DayContent | undefined {
  return programDays.find((day) => day.dayNumber === dayNumber);
}

export function getWeekDays(week: number): DayContent[] {
  return programDays.filter((d) => d.week === week);
}

/**
 * Map a DayContent type to Badge variant name.
 */
export function dayTypeToBadgeVariant(
  type: DayContent['type'],
): 'journal' | 'video' | 'action' | 'rest' | 'synthesis' {
  if (type === 'video_journal') return 'video';
  return type;
}
