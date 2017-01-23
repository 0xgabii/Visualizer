(function ($) {
  
  // Future-proofing...
  var context = new AudioContext();

  // Create the analyser
  var analyser = context.createAnalyser();
  analyser.fftSize = 2048;
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  // Set up the visualisation elements
  var circle = 2*Math.PI;  
  var radius = 200;
  var objWidth = 3;
  var objCount = 200;  
  var step = circle / objCount;

  var parent = $('#visualizer');
  $('#innerCircle').css({
    'width':radius*2 - 20,
    'height':radius*2 - 20
  });      

  for (var deg = 0; deg < circle; deg += step) {
    var x = radius*Math.cos(deg);
    var y = radius*Math.sin(deg);

    //minus 90deg
    var rad = deg - 1.57;

    $('<div />').css({
      'left': x,
      'top': y,
      'width':objWidth,      
      'transform': 'rotate(' + rad + 'rad)'
    }).appendTo(parent);
  }


  var bars = $("#visualizer > div:not(#innerCircle)");

  var prevValue = 0;

  function update() {
    requestAnimationFrame(update);

    analyser.getByteFrequencyData(frequencyData);

    var totValue = 0;

    bars.each(function (i) {
      $(this).css({'height':10 + (frequencyData[i] / 5)});
      totValue += frequencyData[i];
    });    

    var avgValue = totValue/objCount/100 - 0.3;        
    
    if(avgValue > 0.9)
      parent.css({'transform':'translate(-50%,-50%) scale('+avgValue+')'});

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

