import React, { useState, useEffect } from 'react';
import { RSSService, RSSFeed, RSSItem } from '../services/rssService';

interface RSSFeedViewerProps {
  feedUrl: string;
  refreshInterval?: number; // in milliseconds
}

const RSSFeedViewer: React.FC<RSSFeedViewerProps> = ({ 
  feedUrl, 
  refreshInterval = 300000 // default 5 minutes
}) => {
  const [feed, setFeed] = useState<RSSFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rssService = new RSSService();

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const feedData = await rssService.getFeed(feedUrl);
      setFeed(feedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RSS feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();

    // Set up periodic refresh
    if (refreshInterval > 0) {
      const interval = setInterval(fetchFeed, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [feedUrl, refreshInterval]);

  if (loading) {
    return <div className="p-4">Loading feed...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error: {error}
        <button 
          onClick={fetchFeed}
          className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!feed) {
    return <div className="p-4">No feed data available</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{feed.title}</h2>
        <p className="text-gray-600">{feed.description}</p>
      </div>
      
      <div className="space-y-6">
        {feed.items.map((item: RSSItem) => (
          <article 
            key={item.guid} 
            className="border-b border-gray-200 pb-4"
          >
            <h3 className="text-xl font-semibold mb-2">
              <a 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {item.title}
              </a>
            </h3>
            
            <div 
              className="text-gray-700 mb-2"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
            
            <div className="text-sm text-gray-500">
              {item.author && (
                <span className="mr-4">By {item.author}</span>
              )}
              <time dateTime={new Date(item.pubDate).toISOString()}>
                {new Date(item.pubDate).toLocaleDateString()}
              </time>
              
              {item.categories && item.categories.length > 0 && (
                <div className="mt-2">
                  {item.categories.map(category => (
                    <span 
                      key={category}
                      className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm mr-2"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RSSFeedViewer;