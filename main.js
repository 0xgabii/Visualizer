var Framer = {

    countTicks: 360,

    frequencyData: [],

    tickSize: 10,

    PI: 360,

    index: 0,

   


    getTicks: function (count, size, animationParams) {
        size = 10;
        var ticks = this.getTickPoitns(count);
        var x1, y1, x2, y2, m = [], tick, k;
        var lesser = 160;
        var allScales = [];
        for (var i = 0, len = ticks.length; i < len; ++i) {
            var coef = 1 - i / (len * 2.5);
            var delta = ((this.frequencyData[i] || 0) - lesser * coef) * this.scene.scaleCoef;
            if (delta < 0) {
                delta = 0;
            }
            tick = ticks[i];
            if (animationParams[0] <= tick.angle && tick.angle <= animationParams[1]) {
                k = this.scene.radius / (this.scene.radius - this.getSize(tick.angle, animationParams[0], animationParams[1]) - delta);
            } else {
                k = this.scene.radius / (this.scene.radius - (size + delta));
            }
            x1 = tick.x * (this.scene.radius - size);
            y1 = tick.y * (this.scene.radius - size);
            x2 = x1 * k;
            y2 = y1 * k;
            m.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
            if (i < 20) {
                var scale = delta / 50;
                scale = scale < 1 ? 1 : scale;
                allScales.push(scale);
            }
        }
        var sum = allScales.reduce(function (pv, cv) { return pv + cv; }, 0) / allScales.length;
        this.canvas.style.transform = 'scale(' + sum + ')';
        return m;
    },

  

    getTickPoitns: function (count) {
        var coords = [], step = this.PI / count;
        for (var deg = 0; deg < this.PI; deg += step) {
            var rad = deg * Math.PI / (this.PI / 2);
            coords.push({ x: Math.cos(rad), y: -Math.sin(rad), angle: deg });
        }
        return coords;
    }
};




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
            'transform': 'rotate('+deg+'deg)'
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

