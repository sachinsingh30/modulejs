/**
 * ModuleJS is an asynchronous JavaScript and CSS file loader for performance driven websites
 * @author Sachin Singh
 * @version 0.1.0
 */
(function (w) {
    w.mod = w.mod || {};
    var modules = {},
        settings = {},
        regex = {
            jsSuffix: /\.js$/,
            cssSuffix: /\.css$/,
            currDirPrefix: /^\.\/[^\/\\:\*\?"\'<>\|]+/,
            rootDirPrefix: /^\/{1}[^\/\\:\*\?"\'<>\|]+/,
            namePrefix: /^[^\/\\:\*\?"\'<>\|]+/,
            schemePrefix: /^([a-zA-Z]+:\/{2}|\/{2})[^\/\\:\*\?"\'<>\|]+/,
            scheme: /^([a-zA-Z]+:\/{2}|\/{2})/
        };

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

    function overrideSettings(conf) {
        if (typeof conf === "object") {
            each(conf, function (key, value) {
                settings[key] = value;
            });
        }
    }

    function validatePath(path) {
        var urlParts = path.split(regex.scheme),
            domainPart = urlParts.length === 1 ? urlParts[0] : urlParts[2],
            domainParts = domainPart.split("/"),
            error = false;
        each(domainParts, function (index, part) {
            if (!part || (/[\/\\:\*\?"\'<>\|]+/).test(part)) {
                error = true;
                return false;
            }
        });
        if (error) {
            return "";
        }
        return path;
    }

    function clean(url) {
        var path = url,
            urlParts = path.split(regex.scheme);
        if (urlParts.length === 1) {
            path = validatePath(path.replace(/\/{2,}/g, "/"));
        } else if (urlParts.length === 3) {
            urlParts[2] = urlParts[2].replace(/\/{2,}/g, "/");
            path = validatePath(urlParts.join(""));
        } else {
            path = "";
        }
        if (path.length === 0) {
            console.error("Error in path: " + url);
        }
        return path;
    }

    function refinePath(path) {
        if (!regex.jsSuffix.test(path)) {
            path += ".js";
        }
        if (regex.schemePrefix.test(path) || regex.rootDirPrefix.test(path)) {
            return clean(path);
        }
        if (regex.namePrefix.test(path)) {
            return clean("./modules/" + path);
        }
        if (regex.currDirPrefix.test(path)) {
            return clean(path);
        }
        console.error("Error in path: " + path);
        return "";
    }

    function resolveAllPaths(pathList) {
        var clonePathList;
        if (typeof settings.pathList === "object") {
            clonePathList = clone(pathList);
            pathList.length = 0;
            each(clonePathList, function (index, path) {
                clonePathList[index] = refinePath(settings.path[path] || path);
            });
        }
        each(clonePathList, function (index, path) {
            if (path) {
                pathList.push(path);
            }
        });
    }

    function getPageScripts() {
        var scripts = document.getElementsByTagName("script");
        return {
            filter: function (pathList) {
                each(scripts, function (index, scr) {
                    var index = pathList.indexOf(scr.src);
                    if(~index) {
                        pathList.splice(index, 0);
                    }
                });
            },
            list: Array.prototype.slice.call(scripts, 0)
        };
    }

    function createScriptTags(pathList) {
        var scriptTags = [];
        each(pathList, function (index, path) {
            var scriptTag = document.createElement("script");
            scriptTag.type = "text/javascript";
            scriptTag.src = path;
            scriptTags.push(scriptTag);
        });
        return scriptTags;
    }

    function _get(path) {
        var pathList = [], scripts,
            availableScripts, loadedScripts = 0;
        if (typeof path === "string") {
            pathList.push(path);
        } else {
            if (Array.isArray(path)) {
                pathList = clone(path);
            }
        }
        resolveAllPaths(pathList);
        getPageScripts().filter(pathList);
        scripts = createScriptTags(pathList);
        availableScripts = scripts.length;
        
    }

    mod = (function () {
        var api = {
            config: function (conf) {
                overrideSettings(conf);
                return this;
            },
            get: function (path) {
                return _get(path);
            }
        };
        return api;
    }());
}(window));