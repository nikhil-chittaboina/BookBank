import React, { useState, useEffect, useCallback } from 'react';
import { Hash, Calendar, Bookmark } from 'lucide-react';
import { useParams } from 'react-router-dom';
import BookActions from './BookActions';
import toast from 'react-hot-toast';
import { fetchBookData, fetchBookRecommendations, generateBookAiReview } from '../api/BookApi';

// Fallback image path (Ensure this path exists in your public folder)
const DEFAULT_IMAGE_PATH = "/images/banner2.jpeg";

const buildIsbnCoverUrl = (isbn) => {
    if (!isbn) return '';
    const normalized = String(isbn).replace(/[^0-9Xx]/g, '');
    if (!normalized) return '';
    return `https://covers.openlibrary.org/b/isbn/${normalized}-L.jpg`;
};

const BookDetailPage = () => {
    // Correctly extract the ID from the URL parameter
    const { bookId } = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiReview, setAiReview] = useState(null);
    const [isGeneratingReview, setIsGeneratingReview] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    const loadBookData = useCallback(() => {
        setLoading(true);
        setError(null);

        // CRITICAL CHECK: Prevent API call if ID is missing (which caused the loading failure)
        if (!bookId) {
            setError("Error: Book identifier is missing from the URL.");
            setLoading(false);
            return;
        }

        fetchBookData(bookId)
            .then((data) => {
                setBook(data);
                setAiReview(data.aiReview?.generatedAt ? data.aiReview : null);
            })
            .catch(err => {
                console.error("API Fetch Error for Book Detail:", err.message);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [bookId]);

    useEffect(() => {
        loadBookData();
    }, [loadBookData]);

    useEffect(() => {
        const loadRecommendations = async () => {
            try {
                const data = await fetchBookRecommendations();
                setRecommendations((data.recommendations || []).filter((item) => item._id !== bookId).slice(0, 4));
            } catch (err) {
                console.warn('Failed to load recommendations:', err.message);
            }
        };

        loadRecommendations();
    }, [bookId]);

    const handleGenerateReview = async (regenerate = false) => {
        if (!bookId || isGeneratingReview) return;
        setIsGeneratingReview(true);
        try {
            const data = await generateBookAiReview(bookId, regenerate);
            setAiReview(data.review || null);
            toast.success(data.cached ? 'Loaded cached AI review.' : 'AI review generated.');
        } catch (err) {
            toast.error(err.message || 'Failed to generate AI review.');
        } finally {
            setIsGeneratingReview(false);
        }
    };

    // --- Conditional Rendering for Initial Load/Error ---
    if (loading) return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <p className="text-xl text-gray-500">Loading details...</p>
            {/* Simple Skeleton UI for loading */}
            <div className="flex space-x-8 mt-6">
                <div className="w-1/3 h-[400px] bg-gray-200 animate-pulse rounded-xl"></div>
                <div className="w-2/3 space-y-4">
                    <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-40 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded"></div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="book-detail-page p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto mt-8 p-12 text-center border border-red-300 rounded-md bg-red-50 shadow-md">
                <h2 className="text-2xl font-bold text-red-700 mb-4">Error Loading Book</h2>
                <p className="text-gray-700 text-lg mb-6 max-w-md mx-auto">{error}</p>
                <button onClick={loadBookData} className="px-6 py-2 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 transition-colors shadow-lg">Try Again</button>
            </div>
        </div>
    );

    if (!book) return null;

    // --- Destructure and Logic for Success State ---
    const {
        title, author, coverImageUrl, description, isbn, genre,
        publishedYear, availableCopies = 0, totalCopies = 0,
    } = book;

    const status = availableCopies > 0 ? 'AVAILABLE' : 'CHECKED OUT';
    const isAvailable = availableCopies > 0;
    const mainCover = coverImageUrl || buildIsbnCoverUrl(isbn) || DEFAULT_IMAGE_PATH;

    return (
        <div className="book-detail-page p-8 bg-gray-50 min-h-screen">
            <main className="max-w-7xl mx-auto mt-8">
                {/* Back to Catalog Link */}
                <div className="mb-6">
                    <a href="/catalog" className="back-link text-gray-600 hover:text-blue-600 flex items-center text-sm">
                        <span className="text-xl mr-2 text-blue-600">&larr;</span> Back to Catalog
                    </a>
                </div>

                <div className="book-detail-main-content flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Image and Actions */}
                    <div className="book-card-column w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-lg flex-shrink-0">

                        <div className="w-full aspect-[2/3] overflow-hidden rounded-lg shadow-xl mb-6">
                            <img
                                src={mainCover}
                                alt={`${title} cover`}
                                className="book-cover-image w-full h-full object-cover"
                                onError={(event) => {
                                    event.target.onerror = null;
                                    event.target.src = DEFAULT_IMAGE_PATH;
                                }}
                            />
                        </div>

                        <div className="status-box flex justify-between items-center pb-4 border-b border-gray-100">
                            <span className="status-label text-gray-600 font-medium">Status:</span>
                            <span className={`status-badge px-3 py-1 text-xs font-bold rounded-full uppercase
                                ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                            `}>
                                {status}
                            </span>
                        </div>

                        <p className="copies-info text-sm text-gray-600 mt-2 mb-4">Available Copies: <span className="font-semibold text-gray-800">{availableCopies}/{totalCopies}</span></p>

                        <BookActions
                            bookId={bookId}
                            isAvailable={isAvailable}
                            onActionSuccess={loadBookData}
                        />
                    </div>

                    {/* Right Column: Details and Metadata */}
                    <div className="book-details-column w-full lg:w-2/3 space-y-6 bg-white p-8 rounded-xl shadow-lg">
                        <h1 className="book-title text-4xl font-bold text-gray-900">{title}</h1>
                        <h2 className="book-author text-xl text-gray-600">by {author}</h2>

                        <div className="description-section pt-4 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{description}</p>
                        </div>

                        {/* Metadata Grid */}
                        <div className="metadata-grid grid grid-cols-2 md:grid-cols-3 gap-y-4 pt-4 border-t border-gray-100">
                            <div className="metadata-item flex items-center space-x-3">
                                <Hash className="text-blue-600 flex-shrink-0 w-5 h-5" />
                                <div>
                                    <span className="metadata-label text-xs text-gray-500 block uppercase">ISBN</span>
                                    <span className="metadata-value font-medium text-gray-800">{isbn}</span>
                                </div>
                            </div>

                            <div className="metadata-item flex items-center space-x-3">
                                <Bookmark className="text-blue-600 flex-shrink-0 w-5 h-5" />
                                <div>
                                    <span className="metadata-label text-xs text-gray-500 block uppercase">Category</span>
                                    <span className="metadata-value font-medium text-gray-800">{genre}</span>
                                </div>
                            </div>

                            <div className="metadata-item flex items-center space-x-3 col-span-2 md:col-span-1">
                                <Calendar className="text-blue-600 flex-shrink-0 w-5 h-5" />
                                <div>
                                    <span className="metadata-label text-xs text-gray-500 block uppercase">Published Year</span>
                                    <span className="metadata-value font-medium text-gray-800">{publishedYear}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-semibold text-gray-800">AI Review Assistant</h3>
                                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">AI-generated</span>
                            </div>

                            {aiReview ? (
                                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 space-y-3">
                                    <p className="text-gray-800"><span className="font-semibold">Summary:</span> {aiReview.summary}</p>
                                    {Array.isArray(aiReview.strengths) && aiReview.strengths.length > 0 && (
                                        <p className="text-gray-800"><span className="font-semibold">Strengths:</span> {aiReview.strengths.join(', ')}</p>
                                    )}
                                    {aiReview.idealFor && (
                                        <p className="text-gray-800"><span className="font-semibold">Ideal for:</span> {aiReview.idealFor}</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">No AI review yet. Generate one for this book.</p>
                            )}

                            <div className="mt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleGenerateReview(false)}
                                    disabled={isGeneratingReview}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-60"
                                >
                                    {isGeneratingReview ? 'Generating...' : aiReview ? 'Refresh From Cache/Generate' : 'Generate AI Review'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleGenerateReview(true)}
                                    disabled={isGeneratingReview}
                                    className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-700 disabled:opacity-60"
                                >
                                    Regenerate
                                </button>
                            </div>
                        </div>

                        {/* Similar Books Section */}
                        <div className="similar-books-section pt-6 border-t border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">Similar Books</h3>
                            <p className="text-gray-600 text-sm mb-4">You might also like these books</p>

                            <div className="similar-books-list flex space-x-4 overflow-x-auto pb-2">
                                {recommendations.map((b) => (
                                    <div key={b._id} className="similar-book-card flex-shrink-0 w-32 text-center cursor-pointer hover:opacity-90 transition-opacity">
                                        <img
                                            src={b.coverImageUrl || DEFAULT_IMAGE_PATH}
                                            alt={b.title}
                                            className="similar-book-image w-full h-40 object-cover rounded-lg shadow-md mb-2"
                                            onError={(event) => {
                                                event.target.onerror = null;
                                                event.target.src = DEFAULT_IMAGE_PATH;
                                            }}
                                        />
                                        <p className="similar-book-title text-sm font-medium text-gray-800 truncate">{b.title}</p>
                                        <p className="similar-book-author text-xs text-gray-500 truncate">{b.author}</p>
                                    </div>
                                ))}
                                {!recommendations.length && <p className="text-sm text-gray-500">No recommendations available yet.</p>}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookDetailPage;