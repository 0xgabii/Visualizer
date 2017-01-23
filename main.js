(function ($) {
  
  // Future-proofing...
  var context = new AudioContext();

  // Create the analyser
  var analyser = context.createAnalyser();
  analyser.fftSize = 512;
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  // Set up the visualisation elements
  var circle = 2*Math.PI;
  var objCount = 150;
  var radius = 200;
  var step = circle / objCount;

  var parent = $('#visualizer');
  for (var deg = 0; deg < circle; deg += step) {
    var x = radius*Math.cos(deg);
    var y = radius*Math.sin(deg);

    var rad = deg - 1.57;

    $('<div />').css({
      'left': x,
      'top': y,
      'width':3,      
      'transform': 'rotate(' + rad + 'rad)'
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

  var bars = $("#visualizer > div:not(#circle) ");



  // Get the frequency data and update the visualisation
  function update() {
    requestAnimationFrame(update);

    analyser.getByteFrequencyData(frequencyData);

    bars.each(function (index, bar) {
      bar.style.height = 10 + (frequencyData[index] / 3) + 'px';
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

