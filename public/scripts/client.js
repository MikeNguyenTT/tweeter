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

const postNewTweetOnSubmit = function() {
  $('#new-tweet').on('submit', (evt) => {
    evt.preventDefault();
    muteErrorMessage();
    const tweetText = escapeScript($("#tweet-text").val());

    if (tweetText === "" || tweetText === null) {
      showErrorMessage("Please input your tweet!");
      return;
    };

    if (tweetText.length > 140) {
      showErrorMessage("Too long. Please respect our arbitrary limit of 140b chars!");
      return;
    };

    const param = $('#new-tweet').serialize();
    $.post('/tweets', param).then((responseTweet) => {
      muteErrorMessage();
      $("#tweet-text").val("");
      $('#all-tweet').prepend(createTweetElement(responseTweet));
    });
  });
}

const newTweetSlideOnClick = function() {
  $('#new').on('click', (evt) => {
    $(".new-tweet").slideToggle("slow");
  });
}

const scrollToTopOnClick = function() {
  $('#go-top').on('click', (evt) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $(".new-tweet").slideDown("slow");
  });
}

const onScrollWindowEvent = function() {
  $(document).on('scroll', (evt) => {
    if (isScrolledIntoView($("#new")[0])) {
      $("#go-top").hide();
    }
    else {
      $("#go-top").show();
    }
  });
}

function isScrolledIntoView(el) {
  var rect = el.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;
  var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
  return isVisible;
}

const showErrorMessage = function(errorMessage) {
  $("#error-message").html(errorMessage);
  $("#error").slideDown("slow");
}

const muteErrorMessage = function() {
  $("#error").slideUp()
  $("#error-message").html("");
}

const escapeScript = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

$( document ).ready(function() {
  loadtweets();
  postNewTweetOnSubmit();
  newTweetSlideOnClick();
  scrollToTopOnClick();
  onScrollWindowEvent();
  
});


