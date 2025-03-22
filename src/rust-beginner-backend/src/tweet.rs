use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum Kind{
    PST,
    REPST,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Tweet {
    pub id: u64,
    pub user: String,
    pub content: String,
    pub timestamp: u64,
    pub likes: u64,
    pub kind: Kind
}

impl Tweet {
    pub fn new(user: String, content: String)-> Tweet{
        Tweet {
            id: ic_cdk::api::time(), 
            user,
            content,
            timestamp: ic_cdk::api::time(),
            likes: 0,
            kind: Kind::PST,
        }
    }
    /* -> Tweet
    fn repost(id: u64){

    }*/
    pub fn like(&mut self){
        self.likes += 1;
    }
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub username: String,
}

