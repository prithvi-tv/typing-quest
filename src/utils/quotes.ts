export interface Quote {
  id: number;
  text: string;
  wordCount: number;
}

const QUOTES: Quote[] = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    wordCount: 12,
  },
  {
    id: 2,
    text: "Innovation distinguishes between a leader and a follower.",
    wordCount: 10,
  },
  {
    id: 3,
    text: "Life is what happens when you're busy making other plans.",
    wordCount: 12,
  },
  {
    id: 4,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    wordCount: 13,
  },
  {
    id: 5,
    text: "It is during our darkest moments that we must focus to see the light.",
    wordCount: 13,
  },
  {
    id: 6,
    text: "The only impossible journey is the one you never begin.",
    wordCount: 11,
  },
  {
    id: 7,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    wordCount: 15,
  },
  {
    id: 8,
    text: "Believe you can and you're halfway there.",
    wordCount: 8,
  },
  {
    id: 9,
    text: "The best time to plant a tree was twenty years ago. The second best time is now.",
    wordCount: 15,
  },
  {
    id: 10,
    text: "Your time is limited, don't waste it living someone else's life.",
    wordCount: 12,
  },
  {
    id: 11,
    text: "The way to get started is to quit talking and begin doing.",
    wordCount: 12,
  },
  {
    id: 12,
    text: "Don't let yesterday take up too much of today.",
    wordCount: 9,
  },
  {
    id: 13,
    text: "You learn more from failure than from success.",
    wordCount: 9,
  },
  {
    id: 14,
    text: "It's not whether you get knocked down, it's whether you get up.",
    wordCount: 12,
  },
  {
    id: 15,
    text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    wordCount: 18,
  },
  {
    id: 16,
    text: "People who are crazy enough to think they can change the world, are the ones who do.",
    wordCount: 15,
  },
  {
    id: 17,
    text: "Failure is the condiment that gives success its flavor.",
    wordCount: 10,
  },
  {
    id: 18,
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    wordCount: 12,
  },
  {
    id: 19,
    text: "Don't watch the clock; do what it does. Keep going.",
    wordCount: 10,
  },
  {
    id: 20,
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    wordCount: 12,
  },
];

export const quotes = {
  getAll: (): Quote[] => {
    return QUOTES;
  },

  getById: (id: number): Quote | undefined => {
    return QUOTES.find(quote => quote.id === id);
  },

  getRandom: (): Quote => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[randomIndex];
  },

  getRandomExcluding: (excludeIds: number[]): Quote => {
    const available = QUOTES.filter(quote => !excludeIds.includes(quote.id));
    if (available.length === 0) {
      return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  },

  getMultiple: (count: number): Quote[] => {
    const shuffled = [...QUOTES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, QUOTES.length));
  },

  getTotalCount: (): number => {
    return QUOTES.length;
  },
};