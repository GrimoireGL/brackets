import rr from 'regenerator-runtime';
window.regeneratorRuntime = rr;
window.brambleInit = function(Bramble) {
    load(Bramble);
};

// Allow the user to override what we do with default files using `?forceFiles=1`
var forceFiles = window.location.search.indexOf("forceFiles=1") > -1;

// Default filesystem content
var projectRoot = "/7/projects/30";

var index = "<html>\n" +
    "  <head>\n" +
    "    <title>Bramble</title>\n" +
    "  </head>\n" +
    "  <body>\n" +
    "    <p>This is the main page.</p>\n" +
    "  </body>\n" +
    "</html>";

var tutorial = "<html>\n" +
    "  <head>\n" +
    "    <title>Tutorial</title>\n" +
    "  </head>\n" +
    "  <body>\n" +
    "    <p>This is the tutorial.</p>\n" +
    "  </body>\n" +
    "</html>";

var css = "p {\n" +
    "  color: red;\n" +
    "}";

var script = "function add(a, b) {\n" +
    "  return a|0 + b|0;\n" +
    "}";

function installDefaultFiles(Bramble, callback) {
    var fs = Bramble.getFileSystem();
    var sh = new fs.Shell();
    var Path = Bramble.Filer.Path;

    // Simulate a more complex root, like Thimble does
    sh.mkdirp(projectRoot, function(err) {
        // If we run this multiple times, the dir will exist
        if (err && err.code !== "EEXIST") {
            throw err;
        }

        // Stick things in the project root
        function writeProjectFile(path, data, callback) {
            path = Path.join(projectRoot, path);

            fs.writeFile(path, data, function(err) {
                if (err) {
                    throw err;
                }
                callback();
            });
        }

        writeProjectFile("script.js", script, function() {
            writeProjectFile("style.css", css, function() {
                writeProjectFile("index.html", index, function() {
                    writeProjectFile("tutorial.html", tutorial, function() {
                        callback();
                    });
                });
            });
        });
    });
}


async function ensureFiles(Bramble, callback) {
    var fs = Bramble.getFileSystem();

    // If there's already a project dir there, don't create it again
    // so that we don't overwrite user's files.
    fs.exists(projectRoot, function(exists) {
        if (!exists || forceFiles) {
            return installDefaultFiles(Bramble, callback);
        }
        callback();
    });
}

async function load(Bramble) {
    Bramble.load("#bramble", {
        url: "index.html",
        useLocationSearch: true
    });
    // Event listeners
    Bramble.on("ready", function(bramble) {
        console.log("Bramble ready");
        // For debugging, attach to window.
        window.bramble = bramble;
    });
    Bramble.once("error", function(err) {
        console.error("Bramble error", err);
        alert("Fatal Error: " + err.message + ". If you're in Private Browsing mode, data can't be written.");
    });
    Bramble.on("readyStateChange", function(previous, current) {
        console.log("Bramble readyStateChange", previous, current);
    });
    window.be = {
      fs:Bramble.getFileSystem()
    };
    // Setup the filesystem while Bramble is loading
    await ensureFiles(Bramble);
    // Now that fs is setup, tell Bramble which root dir to mount
    // and which file within that root to open on startup.
    Bramble.mount(projectRoot);
}
