import { Notebook, Note } from '@/types';

export const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Your Digital Notebook',
    content: `This is your first note! 

You can write anything here - thoughts, ideas, to-do lists, or creative writing.

The interface is designed to feel like a real notebook with:
• Realistic paper textures
• Hand-drawn style elements
• Smooth page-turning animations
• Physical tool metaphors

Try clicking the tools at the top to switch between pen, pencil, highlighter, and eraser modes.

Happy writing! ✨`,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    color: 'white',
    lineStyle: 'blue',
    bookmarked: true,
    attachments: [],
    checkboxes: [
      {
        id: 'cb1',
        text: 'Explore the notebook interface',
        checked: true,
        position: { x: 0, y: 0 },
      },
      {
        id: 'cb2',
        text: 'Try different paper colors and line styles',
        checked: false,
        position: { x: 0, y: 0 },
      },
      {
        id: 'cb3',
        text: 'Add bookmarks to important notes',
        checked: false,
        position: { x: 0, y: 0 },
      },
    ],
  },
  {
    id: '2',
    title: 'Meeting Notes - Project Kickoff',
    content: `Date: January 20, 2024
Attendees: Team Alpha

Key Discussion Points:
- Project timeline: 3 months
- Budget allocation approved
- Weekly sync meetings on Mondays
- Design mockups due next week

Action Items:
See checkboxes below for assigned tasks.

Next meeting: January 27, 2024`,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    color: 'cream',
    lineStyle: 'gray',
    bookmarked: false,
    attachments: [],
    checkboxes: [
      {
        id: 'cb4',
        text: 'Review project requirements',
        checked: true,
        position: { x: 0, y: 0 },
      },
      {
        id: 'cb5',
        text: 'Create initial wireframes',
        checked: false,
        position: { x: 0, y: 0 },
      },
      {
        id: 'cb6',
        text: 'Schedule design review',
        checked: false,
        position: { x: 0, y: 0 },
      },
    ],
  },
  {
    id: '3',
    title: 'Creative Ideas',
    content: `Random thoughts and inspiration:

"The best way to predict the future is to create it." - Peter Drucker

Ideas for new features:
• Voice notes integration
• Collaborative editing
• Smart search with AI
• Custom stickers and stamps
• Drawing canvas mode

Remember to revisit these ideas monthly!`,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-25'),
    color: 'yellow',
    lineStyle: 'blue',
    bookmarked: true,
    attachments: [],
    checkboxes: [],
  },
  {
    id: '4',
    title: 'Book Notes: Deep Work',
    content: `Author: Cal Newport

Main Concepts:
1. Deep Work = Professional activities performed in a state of distraction-free concentration
2. Shallow Work = Non-cognitively demanding tasks

Four Rules:
- Work Deeply
- Embrace Boredom
- Quit Social Media
- Drain the Shallows

Key Takeaway: Schedule every minute of your day to maximize deep work sessions.`,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    color: 'aged',
    lineStyle: 'gray',
    bookmarked: false,
    attachments: [],
    checkboxes: [
      {
        id: 'cb7',
        text: 'Implement 2-hour deep work blocks',
        checked: false,
        position: { x: 0, y: 0 },
      },
      {
        id: 'cb8',
        text: 'Reduce social media usage',
        checked: false,
        position: { x: 0, y: 0 },
      },
    ],
  },
  {
    id: '5',
    title: 'Recipe: Chocolate Chip Cookies',
    content: `Ingredients:
• 2 1/4 cups all-purpose flour
• 1 tsp baking soda
• 1 tsp salt
• 1 cup butter, softened
• 3/4 cup granulated sugar
• 3/4 cup packed brown sugar
• 2 large eggs
• 2 tsp vanilla extract
• 2 cups chocolate chips

Instructions:
1. Preheat oven to 375°F
2. Mix flour, baking soda, and salt
3. Beat butter and sugars until creamy
4. Add eggs and vanilla
5. Gradually blend in flour mixture
6. Stir in chocolate chips
7. Drop rounded tablespoons onto ungreased cookie sheets
8. Bake 9-11 minutes

Enjoy! 🍪`,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    color: 'cream',
    lineStyle: 'blue',
    bookmarked: false,
    attachments: [],
    checkboxes: [],
  },
];

export const sampleNotebooks: Notebook[] = [
  {
    id: 'nb1',
    name: 'Personal',
    coverColor: '#3b82f6',
    createdAt: new Date('2024-01-01'),
    sections: [
      {
        id: 'sec1',
        name: 'Quick Notes',
        color: '#60a5fa',
        icon: '📝',
        notes: [sampleNotes[0], sampleNotes[2]],
      },
      {
        id: 'sec2',
        name: 'Recipes',
        color: '#f59e0b',
        icon: '🍳',
        notes: [sampleNotes[4]],
      },
    ],
  },
  {
    id: 'nb2',
    name: 'Work',
    coverColor: '#10b981',
    createdAt: new Date('2024-01-01'),
    sections: [
      {
        id: 'sec3',
        name: 'Meetings',
        color: '#34d399',
        icon: '💼',
        notes: [sampleNotes[1]],
      },
      {
        id: 'sec4',
        name: 'Projects',
        color: '#6366f1',
        icon: '🚀',
        notes: [],
      },
    ],
  },
  {
    id: 'nb3',
    name: 'Learning',
    coverColor: '#8b5cf6',
    createdAt: new Date('2024-01-01'),
    sections: [
      {
        id: 'sec5',
        name: 'Book Notes',
        color: '#a78bfa',
        icon: '📚',
        notes: [sampleNotes[3]],
      },
      {
        id: 'sec6',
        name: 'Courses',
        color: '#ec4899',
        icon: '🎓',
        notes: [],
      },
    ],
  },
];
