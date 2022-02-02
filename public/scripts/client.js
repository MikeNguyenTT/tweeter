/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const createTweetElement  = function(tweetData) {

  const $tweet = `<article class="tweet">
    <div class="header">
      <div class="user">
        <img src="${tweetData.user.avatars}" width="50" height="50">
        <span class="name">${tweetData.user.name}</span>
      </div>
      <div class="handle">${tweetData.user.handle}</div>
    </div>
    <div class="content">
      <p>${escapeScript(tweetData.content.text)}</p>
    </div>
    <footer>
      <div class="time">${timeago.format(tweetData.created_at)}</div>
      <div class="icons">
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>
      </div>
    </footer>
  </article>`;
  return $tweet;
}

const renderTweets = function(tweetsArr) {

  tweetsArr.sort((a, b) => (b.created_at - a.created_at));
  
  for (const tweetData of tweetsArr) {
    const tweetHTML = createTweetElement(tweetData);
    $('#all-tweet').append(tweetHTML);
  }
}

const loadtweets = function() {
  $.get('/tweets')
  .then(function (tweetsArr) {
    renderTweets(tweetsArr);
  });
}

const postNewTweetObSubmit = function() {
  $('#new-tweet').on('submit', (evt) => {
    evt.preventDefault();
    const tweetText = escapeScript($("#tweet-text").val());

    if (tweetText === "" || tweetText === null) {
      alert("Please input your tweet");
      return;
    };

    if (tweetText.length > 140) {
      alert("Tweet length cannot be more than 140 characters");
      return;
    };

    const param = $('#new-tweet').serialize();
    $.post('/tweets', param).then((responseTweet) => {
      $('#all-tweet').prepend(createTweetElement(responseTweet));
    });
  });
}

const escapeScript = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

$( document ).ready(function() {
  loadtweets();
  postNewTweetObSubmit();
});

