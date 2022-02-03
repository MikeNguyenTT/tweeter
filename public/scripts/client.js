/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Create HTML element to be appended/ prepended 
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

// Helper to render a single tweet
const renderTweets = function(tweetsArr) {

  tweetsArr.sort((a, b) => (b.created_at - a.created_at));
  
  for (const tweetData of tweetsArr) {
    const tweetHTML = createTweetElement(tweetData);
    $('#all-tweet').append(tweetHTML);
  }
}

// Load all tweets after document is ready
const loadtweets = function() {
  $.get('/tweets')
  .then(function (tweetsArr) {
    renderTweets(tweetsArr);
  });
}

// POST a new tweet to the server, and get back Tweet object to be injected in the first position
const postNewTweetOnSubmit = function() {
  const maxCounter = 140;
  $('#new-tweet').on('submit', (evt) => {
    evt.preventDefault();
    muteErrorMessage();
    const tweetText = escapeScript($("#tweet-text").val());

    if (tweetText === "" || tweetText === null) {
      showErrorMessage("Please input your tweet!");
      return;
    };

    if (tweetText.length > maxCounter) {
      showErrorMessage("Too long. Please respect our arbitrary limit of 140b chars!");
      return;
    };

    const param = $('#new-tweet').serialize();
    $.post('/tweets', param).then((responseTweet) => {
      muteErrorMessage();
      $("#tweet-text").val("");
      $("[name='counter']").html(maxCounter);
      $('#all-tweet').prepend(createTweetElement(responseTweet));
    });
  });
}

// Show/hide New Tweet panel when user click on "Write a new tweet"
const newTweetSlideOnClick = function() {
  $('#new').on('click', (evt) => {
    $(".new-tweet").slideToggle("slow");
    $("#tweet-text").focus();
  });
}

// scroll to top of screen and show New Tweet panel if 2nd button is clicked
const scrollToTopOnClick = function() {
  $('#go-top').on('click', (evt) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $(".new-tweet").slideDown("slow");
    $("#tweet-text").focus();
  });
}

// Window scroll event to display/hide 2nd button
const onScrollWindowEvent = function() {
  $(document).on('scroll', (evt) => {
    if (isScrolledIntoView($("#header")[0])) {
      $("#go-top").hide();
    }
    else {
      $("#go-top").show();
    }
  });
}

// check if the header is in or out of the Viewport to display 2nd button
function isScrolledIntoView(el) {
  var rect = el.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;
  var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
  return isVisible;
}

// helper to show the error message
const showErrorMessage = function(errorMessage) {
  $("#error-message").html(errorMessage);
  $("#error").slideDown("slow");
}

// helper to clear the error message
const muteErrorMessage = function() {
  $("#error").slideUp()
  $("#error-message").html("");
}

// helper to prevent Cross Site Scripting
const escapeScript = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


$( document ).ready(function() {
  // load all the existing tweets to the page
  loadtweets();

  //register event handlers
  postNewTweetOnSubmit();
  newTweetSlideOnClick();
  scrollToTopOnClick();
  onScrollWindowEvent();
  
});


