const crypto = require('crypto');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const normalizeList = (value) => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .slice(0, 5);
};

const buildSourceHash = (book) => {
    const payload = {
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        description: book.description || ''
    };

    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
};

const fallbackReview = (book) => ({
    summary: `${book.title} by ${book.author} appears to be a ${book.genre || 'general'} title. This review was generated using the local fallback path because AI service is unavailable.`,
    strengths: [
        'Clear premise and accessible theme',
        'Suitable for quick pre-read evaluation'
    ],
    idealFor: `Readers interested in ${book.genre || 'general topics'} and concise storytelling.`,
    readingTips: [
        'Skim the first chapter to validate tone and pacing.',
        'Pair with similar books in this genre for better context.'
    ],
    model: 'fallback'
});

const parseReview = (rawContent, book) => {
    try {
        const parsed = JSON.parse(rawContent);
        return {
            summary: String(parsed.summary || '').slice(0, 600),
            strengths: normalizeList(parsed.strengths),
            idealFor: String(parsed.idealFor || '').slice(0, 280),
            readingTips: normalizeList(parsed.readingTips),
            model: DEFAULT_MODEL
        };
    } catch (error) {
        return fallbackReview(book);
    }
};

const generateAiReview = async (book) => {
    const sourceHash = buildSourceHash(book);
    const forceFallback = !process.env.OPENAI_API_KEY;

    if (forceFallback) {
        return {
            ...fallbackReview(book),
            sourceHash,
            generatedAt: new Date()
        };
    }

    const prompt = [
        'You are a concise literary assistant.',
        'Return STRICT JSON only with keys: summary (string), strengths (string[]), idealFor (string), readingTips (string[]).',
        'Do not use markdown.',
        'Keep summary <= 80 words, strengths max 4 items, readingTips max 4 items.',
        `Book title: ${book.title}`,
        `Author: ${book.author}`,
        `Genre: ${book.genre || 'Unknown'}`,
        `Description: ${book.description || 'Not available'}`
    ].join('\n');

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                temperature: 0.2,
                messages: [{ role: 'user', content: prompt }]
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`LLM API failed with status ${response.status}`);
        }

        const data = await response.json();
        const rawContent = data?.choices?.[0]?.message?.content || '{}';
        const review = parseReview(rawContent, book);

        return {
            ...review,
            sourceHash,
            generatedAt: new Date()
        };
    } catch (error) {
        console.warn('[AI_REVIEW_FALLBACK]', error.message);
        return {
            ...fallbackReview(book),
            sourceHash,
            generatedAt: new Date()
        };
    }
};

module.exports = {
    buildSourceHash,
    generateAiReview
};
