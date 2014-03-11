(function(window, $) {

    function injectScript(func) {
        var script = document.createElement('script');
        script.textContent = '(' + func.toString() +')();';
        document.body.appendChild(script);
    }

    function hackFM() {
        function scriptToInject() {
            (function anonymous() {
                console.log(window.extStatusHandler);
                if (!!window.extStatusHandler) {
                    var oldHandler = window.extStatusHandler;
                    window.extStatusHandler = function (obj) {
                        console.log(JSON.parse(obj));
                        oldHandler(obj);
                    }
                }
                else {
                    setTimeout(anonymous, 500);
                };
            })();
        };
        injectScript(scriptToInject);
    };

    hackFM();

})(window, jQuery);