(function ($) {
  
  // Future-proofing...
  var context = new AudioContext();

  // Create the analyser
  var analyser = context.createAnalyser();
  analyser.fftSize = 128;
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  // Set up the visualisation elements
  var circle = 360;
  var objCount = 60;
  var radius = 100;
  var step = circle / objCount;

  var parent = $('#equalizer');

  for (var deg = 0; deg < circle; deg += step) {
    var rad = deg * Math.PI / (circle / 2);
    var x = Math.cos(rad);
    var y = Math.sin(rad);

    $('<div />').css({
      'left': 200,
      'top': 200,
      'width': 10,
      'transform': 'rotate(' + deg + 'deg)'
    }).appendTo(parent);
  }


  /*
  var visualisation = $("#visualisation");
  var barSpacingPercent = 100 / analyser.frequencyBinCount;
  for (var i = 0; i < analyser.frequencyBinCount; i++) {
      $("<div/>").css({

          'left': i * barSpacingPercent + '%',
          'width': 'calc(' + barSpacingPercent + '% - 10px)'
      }).appendTo(visualisation);
  }
  */

  var bars = $("#equalizer > div");



  // Get the frequency data and update the visualisation
  function update() {
    requestAnimationFrame(update);

    analyser.getByteFrequencyData(frequencyData);

    bars.each(function (index, bar) {
      bar.style.height = frequencyData[index] + 'px';
    });
  };

  // Hook up the audio routing...
  // player -> analyser -> speakers
  // (Do this after the player is ready to play - https://code.google.com/p/chromium/issues/detail?id=112368#c4)
  $("#player").on('canplaythrough', function () {
    var source = context.createMediaElementSource(this);
    source.connect(analyser);
    analyser.connect(context.destination);
  });

  $('#file').on('change', function () {
    var file = this.files[0];
    var dataFile = URL.createObjectURL(file);

    $("#player").attr('src', dataFile);
  });

  // Kick it off...
  update();


} ($));

