import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const ChangelogViewer: React.FC = () => {
  const [changelog, setChangelog] = useState<string>('');

  useEffect(() => {
    fetch('/CHANGELOG.md')
      .then(response => response.text())
      .then(text => {
        const parsedMarkdown = marked.parse(text);
        const cleanMarkup = DOMPurify.sanitize(parsedMarkdown.toString());
        setChangelog(cleanMarkup);
      })
      .catch(error => console.error('Error loading changelog:', error));
  }, []);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/50 lg:p-6 text-md text-gray-800 dark:text-white/90 lg:mb-6">
        <div dangerouslySetInnerHTML={{ __html: changelog }} />
      </div>
    </div>
  );
};

export default ChangelogViewer;










