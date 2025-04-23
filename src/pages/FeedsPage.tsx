import React, { useState } from 'react';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import RSSFeedViewer from '../components/RSSFeedViewer';

const DEFAULT_FEEDS = [
  {
    id: '1',
    name: 'Financial Planning',
    url: 'https://www.financial-planning.com/feed?rss=true'
  },
  {
    id: '2',
    name: 'MarketWatch',
    url: 'http://feeds.marketwatch.com/marketwatch/topstories/'
  }
];

const FeedsPage: React.FC = () => {
  const [feeds, setFeeds] = useState(DEFAULT_FEEDS);
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [selectedFeed, setSelectedFeed] = useState(feeds[0]);

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeedName && newFeedUrl) {
      const newFeed = {
        id: Date.now().toString(),
        name: newFeedName,
        url: newFeedUrl
      };
      setFeeds([...feeds, newFeed]);
      setNewFeedName('');
      setNewFeedUrl('');
    }
  };

  const handleDeleteFeed = (id: string) => {
    const updatedFeeds = feeds.filter(feed => feed.id !== id);
    setFeeds(updatedFeeds);
    if (selectedFeed.id === id) {
      setSelectedFeed(updatedFeeds[0]);
    }
  };

  return (
    <>
      <PageMeta
        title="RSS Feeds | Dashboard"
        description="View the latest news and updates from various sources"
      />
      <PageBreadcrumb pageTitle="RSS Feeds" />
      
      <div className="grid gap-6">
        {/* Feed Management Section */}
        <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark shadow-default p-4">
          <h2 className="text-xl font-semibold mb-4">Manage Feeds</h2>
          
          {/* Add New Feed Form */}
          <form onSubmit={handleAddFeed} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="Feed Name"
                value={newFeedName}
                onChange={(e) => setNewFeedName(e.target.value)}
                className="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
              />
            </div>
            <div className="md:col-span-6">
              <input
                type="url"
                placeholder="Feed URL"
                value={newFeedUrl}
                onChange={(e) => setNewFeedUrl(e.target.value)}
                className="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
              >
                Add Feed
              </button>
            </div>
          </form>

          {/* Feed Selection */}
          <div className="flex flex-wrap gap-3 mb-6">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className={`relative group cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedFeed.id === feed.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-meta-4 hover:bg-gray-200 dark:hover:bg-meta-3'
                }`}
                onClick={() => setSelectedFeed(feed)}
              >
                {feed.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFeed(feed.id);
                  }}
                  className="absolute -top-1 -right-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white hover:bg-opacity-90"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feed Viewer */}
        <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark shadow-default">
          {selectedFeed && (
            <RSSFeedViewer
              feedUrl={selectedFeed.url}
              refreshInterval={300000}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FeedsPage;
