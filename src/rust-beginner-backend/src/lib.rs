
use std::cell::RefCell;
use std::collections::HashMap;

mod tweet;
use crate::tweet::Tweet;

// Define the state using thread_local
thread_local! {
    static TWEETS: RefCell<HashMap<u64, Tweet>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
fn post_tweet(user: String, content: String) -> String {
    let tweet = Tweet::new(user, content);
    let id = tweet.id;
    
    // Use with_borrow_mut to get mutable access to the HashMap
    TWEETS.with(|tweets| {
        tweets.borrow_mut().insert(id, tweet);
    });
    
    format!("Tweet posted successfully!")
}

#[ic_cdk::update]
fn like_tweet(tweet_id: u64) -> String {
    TWEETS.with(|tweets| {
        let mut tweets_map = tweets.borrow_mut();
        if let Some(tweet) = tweets_map.get_mut(&tweet_id) {
            tweet.like();
            format!("Tweet liked successfully!")
        } else {
            format!("Tweet not found!")
        }
    })
}

#[ic_cdk::query]
fn get_tweets() -> Vec<Tweet> {
    TWEETS.with(|tweets| {
        tweets.borrow().values().cloned().collect()
    })
}

// This will automatically export the Candid interface
ic_cdk::export_candid!();