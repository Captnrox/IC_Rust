import { useState, useEffect } from 'react';
import { rust_beginner_backend } from 'declarations/rust-beginner-backend';

function App() {
  const [tweets, setTweets] = useState([]);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch all tweets when component mounts
  useEffect(() => {
    fetchTweets();
  }, []);

  // Function to get all tweets from the backend
  async function fetchTweets() {
    try {
      setIsLoading(true);
      const result = await rust_beginner_backend.get_tweets();
      setTweets(result);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setMessage("Failed to load tweets");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle form submission to post a new tweet
  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!username.trim() || !content.trim()) {
      setMessage("Please enter both username and content");
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await rust_beginner_backend.post_tweet(username, content);
      setMessage(result);
      setContent(''); // Clear the content field after posting
      fetchTweets(); // Refresh the tweets list
    } catch (error) {
      console.error("Error posting tweet:", error);
      setMessage("Failed to post tweet");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle liking a tweet
  async function handleLike(tweetId) {
    try {
      const result = await rust_beginner_backend.like_tweet(tweetId);
      setMessage(result);
      fetchTweets(); // Refresh the tweets to show updated like count
    } catch (error) {
      console.error("Error liking tweet:", error);
      setMessage("Failed to like tweet");
    }
  }

  return (
    <main className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">IC Twitter</h1>
      
      {/* Post form */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Post a Tweet</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="content" className="block text-sm font-medium mb-1">Tweet:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              placeholder="What's happening?"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post Tweet'}
          </button>
        </form>
        
        {message && (
          <div className="mt-3 p-2 bg-blue-50 text-blue-700 rounded-md">
            {message}
          </div>
        )}
      </div>
      
      {/* Tweets list */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Recent Tweets</h2>
        
        {isLoading ? (
          <p className="text-center py-4">Loading tweets...</p>
        ) : tweets.length === 0 ? (
          <p className="text-center py-4">No tweets yet. Be the first to post!</p>
        ) : (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div key={tweet.id.toString()} className="border-b pb-3">
                <div className="flex justify-between">
                  <span className="font-semibold">@{tweet.user}</span>
                  <span className="text-gray-500 text-sm">
                    {/* You can add timestamp here if available in your Tweet struct */}
                  </span>
                </div>
                <p className="mt-1">{tweet.content}</p>
                <div className="mt-2 flex items-center justify-end">
                  <button
                    onClick={() => handleLike(tweet.id)}
                    className="flex items-center text-gray-500 hover:text-red-500"
                  >
                    <span className="mr-1">❤️</span>
                    <span>{tweet.likes.toString()}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;