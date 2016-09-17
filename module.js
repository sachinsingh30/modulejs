/**
 * ModuleJS is an asynchronous JavaScript and CSS file loader for performance driven websites
 * @author Sachin Singh
 * @version 0.1.0
 */
(function (w) {
    w.mod = w.mod || {};
    var modules = {},
        settings = {};

    function each(ob, callback) {
        var key = 0, result;
        if (typeof ob === "object") {
            for (key in ob) {
                result = callback && callback(index, ob[index]);
                if (typeof result === "boolean") {
                    if (!result) {
                        break;
                    } else {
                        continue;
                    }
                }
            }
        }
    }

    function triggerEvent(eventName, eventData) {
        if (Event) {
            var event = new Event(eventName, {
                detail: {
                    data: eventData
                },
                bubbles: false,
                cancelable: false
            });
            document.dispatchEvent(event);
        }
    }

    function clone(ob) {
        return ob && JSON.parse(JSON.stringify(ob));
    }

    function overrideSettings() {

    }

    function resolveAllPaths(pathList) {
        if (typeof settings.paths === "object") {
            each(pathList, function (index, path) {
                pathList[index] = settings.path[path] || path;
            });
        }
    }

    mod = (function () {
        var api = {
            config: function (conf) {
                overrideSettings(conf);
            },
            get: function (path) {
                var pathList = [];
                if (typeof path === "string") {
                    pathList.push(path);
                } else {
                    if (Array.isArray(path)) {
                        pathList = clone(path);
                    }
                }
                resolveAllPaths(pathList);

            }
        };
        return api;
    }());
}(window));