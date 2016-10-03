/**
 * NOTE: this is meant for debugging Bramble, and as an example
 * of how to do basic things with the API. It wasn't intended as a production setup.
 *
 * Use ?forceFiles=1 to force startup to re-install the default files
 */
(function() {
    "use strict";

    require.config({
        baseUrl: './'
    });
    //
    // Support loading from src/ or dist/ to make local dev easier
    require(["bramble"], function(Bramble) {
        window.brambleInit(Bramble);
    }, function(err) {
        console.log("Unable to load Bramble from src/, trying from dist/");
        require(["bramble"], function(Bramble) {
            window.brambleInit(Bramble);
        });
    });
}());
