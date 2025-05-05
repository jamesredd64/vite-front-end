import React, { useEffect, useState } from "react";

const ComingSoon: React.FC = () => {
  const [countdown, setCountdown] = useState(86400); // Example: 1 day in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = () => {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300">
      <div className="text-center p-6 max-w-screen-md">
        <h1 className="text-4xl font-bold mb-4">🚀 Coming Soon!</h1>
        <p className="text-lg mb-6">
          We're working on something amazing. Stay tuned!
        </p>
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4 inline-block">
          <span className="text-2xl font-semibold">{formatCountdown()}</span>
        </div>
        <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">
          Countdown until launch ⏳
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
