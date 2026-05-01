const OPEN_LIBRARY_SEARCH_API = 'https://openlibrary.org/search.json';

const buildIsbnCoverUrl = (isbn) => {
    if (!isbn) return '';
    const normalized = String(isbn).replace(/[^0-9Xx]/g, '');
    if (!normalized) return '';
    return `https://covers.openlibrary.org/b/isbn/${normalized}-L.jpg`;
};

const buildCoverIdUrl = (coverId) => {
    if (!coverId) return '';
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
};

const resolveCoverForBook = async (book) => {
    if (!book) return '';

    if (book.coverImageUrl) {
        return book.coverImageUrl;
    }

    const fromIsbn = buildIsbnCoverUrl(book.isbn);
    if (fromIsbn) {
        return fromIsbn;
    }

    const params = new URLSearchParams({
        title: book.title || '',
        author: book.author || '',
        limit: '1'
    });

    try {
        const response = await fetch(`${OPEN_LIBRARY_SEARCH_API}?${params.toString()}`);
        if (!response.ok) return '';

        const data = await response.json();
        const top = data?.docs?.[0];
        if (!top) return '';

        if (top.cover_i) {
            return buildCoverIdUrl(top.cover_i);
        }

        const searchIsbn = top.isbn?.[0];
        return buildIsbnCoverUrl(searchIsbn);
    } catch (error) {
        console.warn('[COVER_RESOLVER_ERROR]', error.message);
        return '';
    }
};

module.exports = {
    resolveCoverForBook,
    buildIsbnCoverUrl
};
