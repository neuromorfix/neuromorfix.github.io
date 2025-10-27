var iTimer = 0;
var gameDuration = 23000;
var noOfColors = 4;

// 🌈 Material Design 500 colors
var arrtemp = ["e91e63", "f44336", "2196f3", "4caf50"];
var nametemp = ["PINK", "RED", "BLUE", "GREEN"];

var color1, randomName1, randomColorForName1;
var color2, randomName2, randomColorForName2;

function reInit () {
  color1 = Math.floor(Math.random() * noOfColors);
  randomName1 = Math.floor(Math.random() * noOfColors);
  randomColorForName1 = Math.floor(Math.random() * noOfColors);
  color2 = Math.floor(Math.random() * noOfColors);
  randomName2 = Math.floor(Math.random() * noOfColors);
  randomColorForName2 = Math.floor(Math.random() * noOfColors);

  if(color1 == randomColorForName1) color1 = (color1 + 1) % noOfColors;
  if(color2 == randomColorForName2) color2 = (color2 + 1) % noOfColors;

  $('.panel1').css("background-color", "#" + arrtemp[color1]);
  $('.name1').text(nametemp[randomName1]).css("color", "#" + arrtemp[randomColorForName1]);
  $('.panel2').css("background-color", "#" + arrtemp[color2]);
  $('.name2').text(nametemp[randomName2]).css("color", "#" + arrtemp[randomColorForName2]);  
}

function init() {
  $('.backgroundTimer').remove();
  $('.game').append("<div class='backgroundTimer'></div>");
  $('.backgroundTimer').css({transition: 'none', width: '0'});
  iTimer = 0;
  $('.score').text('0').css('color', 'transparent');
  $("input").css({opacity:'0', transform:'translate(-50%, -800px)'}).prop('disabled', true);
  reInit();
  initTimer();
}

function initTimer() {
  function tick() {
    iTimer++;
    let backgroundPercentage = iTimer * 100 / (gameDuration / 1000);
    $('.backgroundTimer').css({'transition': 'width 1s linear', 'width': backgroundPercentage + "%"});
    if (backgroundPercentage < 100) setTimeout(tick, 1000);
  }
  setTimeout(tick, 1000);

  setTimeout(() => {
    $('.game').append("<div class='overlay1'></div>");
    $('.score').text("GAME OVER!!").css('color', '#000');
    $("input").css({opacity:'1', transform:'translate(-50%, -50%)'}).prop('disabled', false);
  }, gameDuration);
}

// click left/right
$('.game').click(function(e) {
  if ($('input').prop('disabled') === false) return;

  let offsetX = e.pageX - $(this).offset().left;
  let half = $(this).width() / 2;

  if (offsetX < half) {
    if (nametemp[randomName1] == nametemp[color2])
      $('.score').text(parseInt($('.score').text()) + 5);
    else
      $('.score').text(parseInt($('.score').text()) - 3);
  } else {
    if (nametemp[randomName1] != nametemp[color2])
      $('.score').text(parseInt($('.score').text()) + 1);
    else
      $('.score').text(parseInt($('.score').text()) - 3);
  }
  reInit();
});

$('input').click(function () {
  $('.overlay1').remove();
  init();
});