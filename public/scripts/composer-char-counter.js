$(document).ready(function() {
  const counter = $("[name='counter']");
  const maxCount = 140;
  
  $("#tweet-text").on("input", function(e) {
    const remainingLength = maxCount - this.value.length;
    counter.html(remainingLength);

    if (remainingLength < 0) {
      counter.addClass("red");
    } else {
      counter.removeClass("red");
    }
    
  });
});