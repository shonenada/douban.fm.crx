(function(window, $) {

    function injectScript(func) {
        var script = document.createElement('script');
        script.textContent = '(' + func.toString() +')();';
        document.body.appendChild(script);
    }

    function injectDoubanFMx () {
        var initDoubanFMx = function (){
            var DoubanFMx = {}; 
            DoubanFMx.data = {};

            DoubanFMx.set = function (key, value) {
                if (key != 'set' && key != 'get'){
                    DoubanFMx.data[key] = value;
                }
            }

            DoubanFMx.get = function (key, defaultValue) {
                if (key != 'set' && key != 'get'){
                    if (!! DoubanFMx.data[key]){
                        return DoubanFMx.data[key];
                    }
                    else {
                        return defaultValue || null;
                    }
                }
            }

            window.DoubanFMx = $D = DoubanFMx;
        };
        injectScript(initDoubanFMx);
    }

    function setupLayout () {
        var simulate = $('#simulate-sec');

        var cycleWrapper = $('<div id="cycleWrapper"></div>');
        var cycleBtn =  $('<div id="cycleBtn"></div>').append($('<span id="cycleInfo">单曲循环</span>'));
        cycleWrapper.append(cycleBtn);

        simulate.append(cycleWrapper);

        cycleWrapper.mouseenter(function(){
            $(this).addClass('cycleHover');
        });
        cycleWrapper.mouseleave(function() {
            $(this).removeClass('cycleHover');
        })

        cycleWrapper.toggle(function () {
            $('#cycleWrapper').addClass('cycleChosed');
        }, function () {
            $('#cycleWrapper').removeClass('cycleChosed');
        });
    }

    function injectHackFM() {
        function hackFM() {
            if (typeof window.extStatusHandler != 'undefined') {
                var oldHandler = window.extStatusHandler;
                window.extStatusHandler = function (obj) {
                    oldHandler(obj);
                    var data = JSON.parse(obj);
                    var type = data.type;
                    if (type == 'start') {
                       $D.set('currentSong', FM.getCurrentSongInfo());
                    }
                    if (type == 'e') {
                        DBR.act('skip');
                        if ($('#cycleWrapper').hasClass('cycleChosed')) {
                            var song = $D.get('currentSong');
                            var songInfo = {
                                start: song.id + 'g' + song.ssid + 'g',
                            }
                            set_cookie(songInfo, 365, 'douban.fm');
                        }
                    }
                }
            }
            else {
                setTimeout(hackFM, 500);
            };

            $('body').keypress(function (key){
                if (key.charCode == 97 || key.charCode == 65){
                    console.log(key)
                    $('#cycleWrapper').click();
                }
            });
        };
        injectScript(hackFM);
    };

    setupLayout();
    injectDoubanFMx();
    injectHackFM();

})(window, jQuery);