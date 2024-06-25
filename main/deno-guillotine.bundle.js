var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://deno.land/std@0.128.0/_util/os.ts
var osType = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }
  return "linux";
})();
var isWindows = osType === "windows";

// https://deno.land/std@0.128.0/path/win32.ts
var win32_exports = {};
__export(win32_exports, {
  basename: () => basename,
  delimiter: () => delimiter,
  dirname: () => dirname,
  extname: () => extname,
  format: () => format,
  fromFileUrl: () => fromFileUrl,
  isAbsolute: () => isAbsolute,
  join: () => join,
  normalize: () => normalize,
  parse: () => parse,
  relative: () => relative,
  resolve: () => resolve,
  sep: () => sep,
  toFileUrl: () => toFileUrl,
  toNamespacedPath: () => toNamespacedPath
});

// https://deno.land/std@0.128.0/path/_constants.ts
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;
var CHAR_QUESTION_MARK = 63;

// https://deno.land/std@0.128.0/path/_util.ts
function assertPath(path7) {
  if (typeof path7 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path7)}`
    );
  }
}
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
function isPathSeparator(code) {
  return isPosixPathSeparator(code) || code === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code) {
  return code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z || code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z;
}
function normalizeString(path7, allowAboveRoot, separator, isPathSeparator4) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0, len = path7.length; i <= len; ++i) {
    if (i < len)
      code = path7.charCodeAt(i);
    else if (isPathSeparator4(code))
      break;
    else
      code = CHAR_FORWARD_SLASH;
    if (isPathSeparator4(code)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += `${separator}..`;
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += separator + path7.slice(lastSlash + 1, i);
        else
          res = path7.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep9, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep9 + base;
}
var WHITESPACE_ENCODINGS = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace(string) {
  return string.replaceAll(/[\s]/g, (c) => {
    return WHITESPACE_ENCODINGS[c] ?? c;
  });
}

// https://deno.land/std@0.128.0/_util/assert.ts
var DenoStdInternalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}

// https://deno.land/std@0.128.0/path/win32.ts
var sep = "\\";
var delimiter = ";";
function resolve(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path7;
    const { Deno: Deno4 } = globalThis;
    if (i >= 0) {
      path7 = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path7 = Deno4.cwd();
    } else {
      if (typeof Deno4?.env?.get !== "function" || typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path7 = Deno4.cwd();
      if (path7 === void 0 || path7.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path7 = `${resolvedDevice}\\`;
      }
    }
    assertPath(path7);
    const len = path7.length;
    if (len === 0)
      continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute9 = false;
    const code = path7.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator(code)) {
        isAbsolute9 = true;
        if (isPathSeparator(path7.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            const firstPart = path7.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator(path7.charCodeAt(j)))
                break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator(path7.charCodeAt(j)))
                  break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path7.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path7.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code)) {
        if (path7.charCodeAt(1) === CHAR_COLON) {
          device = path7.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator(path7.charCodeAt(2))) {
              isAbsolute9 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator(code)) {
      rootEnd = 1;
      isAbsolute9 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path7.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute9;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0)
      break;
  }
  resolvedTail = normalizeString(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path7) {
  assertPath(path7);
  const len = path7.length;
  if (len === 0)
    return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute9 = false;
  const code = path7.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      isAbsolute9 = true;
      if (isPathSeparator(path7.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path7.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          const firstPart = path7.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path7.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path7.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path7.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path7.charCodeAt(1) === CHAR_COLON) {
        device = path7.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path7.charCodeAt(2))) {
            isAbsolute9 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString(
      path7.slice(rootEnd),
      !isAbsolute9,
      "\\",
      isPathSeparator
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute9)
    tail = ".";
  if (tail.length > 0 && isPathSeparator(path7.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute9) {
      if (tail.length > 0)
        return `\\${tail}`;
      else
        return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute9) {
    if (tail.length > 0)
      return `${device}\\${tail}`;
    else
      return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute(path7) {
  assertPath(path7);
  const len = path7.length;
  if (len === 0)
    return false;
  const code = path7.charCodeAt(0);
  if (isPathSeparator(code)) {
    return true;
  } else if (isWindowsDeviceRoot(code)) {
    if (len > 2 && path7.charCodeAt(1) === CHAR_COLON) {
      if (isPathSeparator(path7.charCodeAt(2)))
        return true;
    }
  }
  return false;
}
function join(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0)
    return ".";
  let joined;
  let firstPart = null;
  for (let i = 0; i < pathsCount; ++i) {
    const path7 = paths[i];
    assertPath(path7);
    if (path7.length > 0) {
      if (joined === void 0)
        joined = firstPart = path7;
      else
        joined += `\\${path7}`;
    }
  }
  if (joined === void 0)
    return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert(firstPart != null);
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2)))
            ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator(joined.charCodeAt(slashCount)))
        break;
    }
    if (slashCount >= 2)
      joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize(joined);
}
function relative(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  const fromOrig = resolve(from);
  const toOrig = resolve(to);
  if (fromOrig === toOrig)
    return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to)
    return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH)
      break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH)
      break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_BACKWARD_SLASH)
      lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1)
    lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
      if (out.length === 0)
        out += "..";
      else
        out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH)
      ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath(path7) {
  if (typeof path7 !== "string")
    return path7;
  if (path7.length === 0)
    return "";
  const resolvedPath = resolve(path7);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path7;
}
function dirname(path7) {
  assertPath(path7);
  const len = path7.length;
  if (len === 0)
    return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path7.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path7.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path7.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path7.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return path7;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path7.charCodeAt(1) === CHAR_COLON) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator(path7.charCodeAt(2)))
            rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    return path7;
  }
  for (let i = len - 1; i >= offset; --i) {
    if (isPathSeparator(path7.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1)
      return ".";
    else
      end = rootEnd;
  }
  return path7.slice(0, end);
}
function basename(path7, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path7);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (path7.length >= 2) {
    const drive = path7.charCodeAt(0);
    if (isWindowsDeviceRoot(drive)) {
      if (path7.charCodeAt(1) === CHAR_COLON)
        start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path7.length) {
    if (ext.length === path7.length && ext === path7)
      return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path7.length - 1; i >= start; --i) {
      const code = path7.charCodeAt(i);
      if (isPathSeparator(code)) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path7.length;
    return path7.slice(start, end);
  } else {
    for (i = path7.length - 1; i >= start; --i) {
      if (isPathSeparator(path7.charCodeAt(i))) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path7.slice(start, end);
  }
}
function extname(path7) {
  assertPath(path7);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path7.length >= 2 && path7.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path7.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path7.length - 1; i >= start; --i) {
    const code = path7.charCodeAt(i);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path7.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("\\", pathObject);
}
function parse(path7) {
  assertPath(path7);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path7.length;
  if (len === 0)
    return ret;
  let rootEnd = 0;
  let code = path7.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      rootEnd = 1;
      if (isPathSeparator(path7.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path7.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path7.charCodeAt(j)))
                break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path7.charCodeAt(1) === CHAR_COLON) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path7.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path7;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path7;
          return ret;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    ret.root = ret.dir = path7;
    return ret;
  }
  if (rootEnd > 0)
    ret.root = path7.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path7.length - 1;
  let preDotState = 0;
  for (; i >= rootEnd; --i) {
    code = path7.charCodeAt(i);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path7.slice(startPart, end);
    }
  } else {
    ret.name = path7.slice(startPart, startDot);
    ret.base = path7.slice(startPart, end);
    ret.ext = path7.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path7.slice(0, startPart - 1);
  } else
    ret.dir = ret.root;
  return ret;
}
function fromFileUrl(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path7 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path7 = `\\\\${url.hostname}${path7}`;
  }
  return path7;
}
function toFileUrl(path7) {
  if (!isAbsolute(path7)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname2, pathname] = path7.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
  if (hostname2 != null && hostname2 != "localhost") {
    url.hostname = hostname2;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.128.0/path/posix.ts
var posix_exports = {};
__export(posix_exports, {
  basename: () => basename2,
  delimiter: () => delimiter2,
  dirname: () => dirname2,
  extname: () => extname2,
  format: () => format2,
  fromFileUrl: () => fromFileUrl2,
  isAbsolute: () => isAbsolute2,
  join: () => join2,
  normalize: () => normalize2,
  parse: () => parse2,
  relative: () => relative2,
  resolve: () => resolve2,
  sep: () => sep2,
  toFileUrl: () => toFileUrl2,
  toNamespacedPath: () => toNamespacedPath2
});
var sep2 = "/";
var delimiter2 = ":";
function resolve2(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path7;
    if (i >= 0)
      path7 = pathSegments[i];
    else {
      const { Deno: Deno4 } = globalThis;
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path7 = Deno4.cwd();
    }
    assertPath(path7);
    if (path7.length === 0) {
      continue;
    }
    resolvedPath = `${path7}/${resolvedPath}`;
    resolvedAbsolute = path7.charCodeAt(0) === CHAR_FORWARD_SLASH;
  }
  resolvedPath = normalizeString(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0)
      return `/${resolvedPath}`;
    else
      return "/";
  } else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize2(path7) {
  assertPath(path7);
  if (path7.length === 0)
    return ".";
  const isAbsolute9 = path7.charCodeAt(0) === CHAR_FORWARD_SLASH;
  const trailingSeparator = path7.charCodeAt(path7.length - 1) === CHAR_FORWARD_SLASH;
  path7 = normalizeString(path7, !isAbsolute9, "/", isPosixPathSeparator);
  if (path7.length === 0 && !isAbsolute9)
    path7 = ".";
  if (path7.length > 0 && trailingSeparator)
    path7 += "/";
  if (isAbsolute9)
    return `/${path7}`;
  return path7;
}
function isAbsolute2(path7) {
  assertPath(path7);
  return path7.length > 0 && path7.charCodeAt(0) === CHAR_FORWARD_SLASH;
}
function join2(...paths) {
  if (paths.length === 0)
    return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path7 = paths[i];
    assertPath(path7);
    if (path7.length > 0) {
      if (!joined)
        joined = path7;
      else
        joined += `/${path7}`;
    }
  }
  if (!joined)
    return ".";
  return normalize2(joined);
}
function relative2(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  from = resolve2(from);
  to = resolve2(to);
  if (from === to)
    return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_FORWARD_SLASH)
      lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
    }
  }
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH)
      ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath2(path7) {
  return path7;
}
function dirname2(path7) {
  assertPath(path7);
  if (path7.length === 0)
    return ".";
  const hasRoot = path7.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let end = -1;
  let matchedSlash = true;
  for (let i = path7.length - 1; i >= 1; --i) {
    if (path7.charCodeAt(i) === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path7.slice(0, end);
}
function basename2(path7, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path7);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path7.length) {
    if (ext.length === path7.length && ext === path7)
      return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path7.length - 1; i >= 0; --i) {
      const code = path7.charCodeAt(i);
      if (code === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path7.length;
    return path7.slice(start, end);
  } else {
    for (i = path7.length - 1; i >= 0; --i) {
      if (path7.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path7.slice(start, end);
  }
}
function extname2(path7) {
  assertPath(path7);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path7.length - 1; i >= 0; --i) {
    const code = path7.charCodeAt(i);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path7.slice(startDot, end);
}
function format2(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("/", pathObject);
}
function parse2(path7) {
  assertPath(path7);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path7.length === 0)
    return ret;
  const isAbsolute9 = path7.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let start;
  if (isAbsolute9) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path7.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code = path7.charCodeAt(i);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute9) {
        ret.base = ret.name = path7.slice(1, end);
      } else {
        ret.base = ret.name = path7.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute9) {
      ret.name = path7.slice(1, startDot);
      ret.base = path7.slice(1, end);
    } else {
      ret.name = path7.slice(startPart, startDot);
      ret.base = path7.slice(startPart, end);
    }
    ret.ext = path7.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path7.slice(0, startPart - 1);
  else if (isAbsolute9)
    ret.dir = "/";
  return ret;
}
function fromFileUrl2(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl2(path7) {
  if (!isAbsolute2(path7)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(
    path7.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.128.0/path/glob.ts
var path = isWindows ? win32_exports : posix_exports;
var { join: join3, normalize: normalize3 } = path;

// https://deno.land/std@0.128.0/path/mod.ts
var path2 = isWindows ? win32_exports : posix_exports;
var {
  basename: basename3,
  delimiter: delimiter3,
  dirname: dirname3,
  extname: extname3,
  format: format3,
  fromFileUrl: fromFileUrl3,
  isAbsolute: isAbsolute3,
  join: join4,
  normalize: normalize4,
  parse: parse3,
  relative: relative3,
  resolve: resolve3,
  sep: sep3,
  toFileUrl: toFileUrl3,
  toNamespacedPath: toNamespacedPath3
} = path2;

// https://deno.land/std@0.133.0/_util/os.ts
var osType2 = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }
  return "linux";
})();
var isWindows2 = osType2 === "windows";

// https://deno.land/std@0.133.0/path/win32.ts
var win32_exports2 = {};
__export(win32_exports2, {
  basename: () => basename4,
  delimiter: () => delimiter4,
  dirname: () => dirname4,
  extname: () => extname4,
  format: () => format4,
  fromFileUrl: () => fromFileUrl4,
  isAbsolute: () => isAbsolute4,
  join: () => join5,
  normalize: () => normalize5,
  parse: () => parse4,
  relative: () => relative4,
  resolve: () => resolve4,
  sep: () => sep4,
  toFileUrl: () => toFileUrl4,
  toNamespacedPath: () => toNamespacedPath4
});

// https://deno.land/std@0.133.0/path/_constants.ts
var CHAR_UPPERCASE_A2 = 65;
var CHAR_LOWERCASE_A2 = 97;
var CHAR_UPPERCASE_Z2 = 90;
var CHAR_LOWERCASE_Z2 = 122;
var CHAR_DOT2 = 46;
var CHAR_FORWARD_SLASH2 = 47;
var CHAR_BACKWARD_SLASH2 = 92;
var CHAR_COLON2 = 58;
var CHAR_QUESTION_MARK2 = 63;

// https://deno.land/std@0.133.0/path/_util.ts
function assertPath2(path7) {
  if (typeof path7 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path7)}`
    );
  }
}
function isPosixPathSeparator2(code) {
  return code === CHAR_FORWARD_SLASH2;
}
function isPathSeparator2(code) {
  return isPosixPathSeparator2(code) || code === CHAR_BACKWARD_SLASH2;
}
function isWindowsDeviceRoot2(code) {
  return code >= CHAR_LOWERCASE_A2 && code <= CHAR_LOWERCASE_Z2 || code >= CHAR_UPPERCASE_A2 && code <= CHAR_UPPERCASE_Z2;
}
function normalizeString2(path7, allowAboveRoot, separator, isPathSeparator4) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0, len = path7.length; i <= len; ++i) {
    if (i < len)
      code = path7.charCodeAt(i);
    else if (isPathSeparator4(code))
      break;
    else
      code = CHAR_FORWARD_SLASH2;
    if (isPathSeparator4(code)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT2 || res.charCodeAt(res.length - 2) !== CHAR_DOT2) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += `${separator}..`;
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += separator + path7.slice(lastSlash + 1, i);
        else
          res = path7.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT2 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format2(sep9, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep9 + base;
}
var WHITESPACE_ENCODINGS2 = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace2(string) {
  return string.replaceAll(/[\s]/g, (c) => {
    return WHITESPACE_ENCODINGS2[c] ?? c;
  });
}

// https://deno.land/std@0.133.0/_util/assert.ts
var DenoStdInternalError2 = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert2(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError2(msg);
  }
}

// https://deno.land/std@0.133.0/path/win32.ts
var sep4 = "\\";
var delimiter4 = ";";
function resolve4(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path7;
    const { Deno: Deno4 } = globalThis;
    if (i >= 0) {
      path7 = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path7 = Deno4.cwd();
    } else {
      if (typeof Deno4?.env?.get !== "function" || typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path7 = Deno4.cwd();
      if (path7 === void 0 || path7.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path7 = `${resolvedDevice}\\`;
      }
    }
    assertPath2(path7);
    const len = path7.length;
    if (len === 0)
      continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute9 = false;
    const code = path7.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator2(code)) {
        isAbsolute9 = true;
        if (isPathSeparator2(path7.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator2(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            const firstPart = path7.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator2(path7.charCodeAt(j)))
                break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator2(path7.charCodeAt(j)))
                  break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path7.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path7.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot2(code)) {
        if (path7.charCodeAt(1) === CHAR_COLON2) {
          device = path7.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator2(path7.charCodeAt(2))) {
              isAbsolute9 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator2(code)) {
      rootEnd = 1;
      isAbsolute9 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path7.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute9;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0)
      break;
  }
  resolvedTail = normalizeString2(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator2
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize5(path7) {
  assertPath2(path7);
  const len = path7.length;
  if (len === 0)
    return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute9 = false;
  const code = path7.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      isAbsolute9 = true;
      if (isPathSeparator2(path7.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path7.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          const firstPart = path7.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path7.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path7.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path7.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path7.charCodeAt(1) === CHAR_COLON2) {
        device = path7.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path7.charCodeAt(2))) {
            isAbsolute9 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString2(
      path7.slice(rootEnd),
      !isAbsolute9,
      "\\",
      isPathSeparator2
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute9)
    tail = ".";
  if (tail.length > 0 && isPathSeparator2(path7.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute9) {
      if (tail.length > 0)
        return `\\${tail}`;
      else
        return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute9) {
    if (tail.length > 0)
      return `${device}\\${tail}`;
    else
      return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute4(path7) {
  assertPath2(path7);
  const len = path7.length;
  if (len === 0)
    return false;
  const code = path7.charCodeAt(0);
  if (isPathSeparator2(code)) {
    return true;
  } else if (isWindowsDeviceRoot2(code)) {
    if (len > 2 && path7.charCodeAt(1) === CHAR_COLON2) {
      if (isPathSeparator2(path7.charCodeAt(2)))
        return true;
    }
  }
  return false;
}
function join5(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0)
    return ".";
  let joined;
  let firstPart = null;
  for (let i = 0; i < pathsCount; ++i) {
    const path7 = paths[i];
    assertPath2(path7);
    if (path7.length > 0) {
      if (joined === void 0)
        joined = firstPart = path7;
      else
        joined += `\\${path7}`;
    }
  }
  if (joined === void 0)
    return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert2(firstPart != null);
  if (isPathSeparator2(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator2(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator2(firstPart.charCodeAt(2)))
            ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator2(joined.charCodeAt(slashCount)))
        break;
    }
    if (slashCount >= 2)
      joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize5(joined);
}
function relative4(from, to) {
  assertPath2(from);
  assertPath2(to);
  if (from === to)
    return "";
  const fromOrig = resolve4(from);
  const toOrig = resolve4(to);
  if (fromOrig === toOrig)
    return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to)
    return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH2)
      break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH2)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH2)
      break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH2)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH2) {
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH2) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_BACKWARD_SLASH2)
      lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1)
    lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH2) {
      if (out.length === 0)
        out += "..";
      else
        out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH2)
      ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath4(path7) {
  if (typeof path7 !== "string")
    return path7;
  if (path7.length === 0)
    return "";
  const resolvedPath = resolve4(path7);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH2) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH2) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK2 && code !== CHAR_DOT2) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot2(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON2 && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH2) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path7;
}
function dirname4(path7) {
  assertPath2(path7);
  const len = path7.length;
  if (len === 0)
    return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path7.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator2(path7.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path7.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path7.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return path7;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path7.charCodeAt(1) === CHAR_COLON2) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator2(path7.charCodeAt(2)))
            rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    return path7;
  }
  for (let i = len - 1; i >= offset; --i) {
    if (isPathSeparator2(path7.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1)
      return ".";
    else
      end = rootEnd;
  }
  return path7.slice(0, end);
}
function basename4(path7, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath2(path7);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (path7.length >= 2) {
    const drive = path7.charCodeAt(0);
    if (isWindowsDeviceRoot2(drive)) {
      if (path7.charCodeAt(1) === CHAR_COLON2)
        start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path7.length) {
    if (ext.length === path7.length && ext === path7)
      return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path7.length - 1; i >= start; --i) {
      const code = path7.charCodeAt(i);
      if (isPathSeparator2(code)) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path7.length;
    return path7.slice(start, end);
  } else {
    for (i = path7.length - 1; i >= start; --i) {
      if (isPathSeparator2(path7.charCodeAt(i))) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path7.slice(start, end);
  }
}
function extname4(path7) {
  assertPath2(path7);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path7.length >= 2 && path7.charCodeAt(1) === CHAR_COLON2 && isWindowsDeviceRoot2(path7.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path7.length - 1; i >= start; --i) {
    const code = path7.charCodeAt(i);
    if (isPathSeparator2(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path7.slice(startDot, end);
}
function format4(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format2("\\", pathObject);
}
function parse4(path7) {
  assertPath2(path7);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path7.length;
  if (len === 0)
    return ret;
  let rootEnd = 0;
  let code = path7.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      rootEnd = 1;
      if (isPathSeparator2(path7.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path7.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path7.charCodeAt(j)))
                break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path7.charCodeAt(1) === CHAR_COLON2) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path7.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path7;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path7;
          return ret;
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    ret.root = ret.dir = path7;
    return ret;
  }
  if (rootEnd > 0)
    ret.root = path7.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path7.length - 1;
  let preDotState = 0;
  for (; i >= rootEnd; --i) {
    code = path7.charCodeAt(i);
    if (isPathSeparator2(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path7.slice(startPart, end);
    }
  } else {
    ret.name = path7.slice(startPart, startDot);
    ret.base = path7.slice(startPart, end);
    ret.ext = path7.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path7.slice(0, startPart - 1);
  } else
    ret.dir = ret.root;
  return ret;
}
function fromFileUrl4(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path7 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path7 = `\\\\${url.hostname}${path7}`;
  }
  return path7;
}
function toFileUrl4(path7) {
  if (!isAbsolute4(path7)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname2, pathname] = path7.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(pathname.replace(/%/g, "%25"));
  if (hostname2 != null && hostname2 != "localhost") {
    url.hostname = hostname2;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.133.0/path/posix.ts
var posix_exports2 = {};
__export(posix_exports2, {
  basename: () => basename5,
  delimiter: () => delimiter5,
  dirname: () => dirname5,
  extname: () => extname5,
  format: () => format5,
  fromFileUrl: () => fromFileUrl5,
  isAbsolute: () => isAbsolute5,
  join: () => join6,
  normalize: () => normalize6,
  parse: () => parse5,
  relative: () => relative5,
  resolve: () => resolve5,
  sep: () => sep5,
  toFileUrl: () => toFileUrl5,
  toNamespacedPath: () => toNamespacedPath5
});
var sep5 = "/";
var delimiter5 = ":";
function resolve5(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path7;
    if (i >= 0)
      path7 = pathSegments[i];
    else {
      const { Deno: Deno4 } = globalThis;
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path7 = Deno4.cwd();
    }
    assertPath2(path7);
    if (path7.length === 0) {
      continue;
    }
    resolvedPath = `${path7}/${resolvedPath}`;
    resolvedAbsolute = path7.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  }
  resolvedPath = normalizeString2(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator2
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0)
      return `/${resolvedPath}`;
    else
      return "/";
  } else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize6(path7) {
  assertPath2(path7);
  if (path7.length === 0)
    return ".";
  const isAbsolute9 = path7.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  const trailingSeparator = path7.charCodeAt(path7.length - 1) === CHAR_FORWARD_SLASH2;
  path7 = normalizeString2(path7, !isAbsolute9, "/", isPosixPathSeparator2);
  if (path7.length === 0 && !isAbsolute9)
    path7 = ".";
  if (path7.length > 0 && trailingSeparator)
    path7 += "/";
  if (isAbsolute9)
    return `/${path7}`;
  return path7;
}
function isAbsolute5(path7) {
  assertPath2(path7);
  return path7.length > 0 && path7.charCodeAt(0) === CHAR_FORWARD_SLASH2;
}
function join6(...paths) {
  if (paths.length === 0)
    return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path7 = paths[i];
    assertPath2(path7);
    if (path7.length > 0) {
      if (!joined)
        joined = path7;
      else
        joined += `/${path7}`;
    }
  }
  if (!joined)
    return ".";
  return normalize6(joined);
}
function relative5(from, to) {
  assertPath2(from);
  assertPath2(to);
  if (from === to)
    return "";
  from = resolve5(from);
  to = resolve5(to);
  if (from === to)
    return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH2)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH2)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH2) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH2) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_FORWARD_SLASH2)
      lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH2) {
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
    }
  }
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH2)
      ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath5(path7) {
  return path7;
}
function dirname5(path7) {
  assertPath2(path7);
  if (path7.length === 0)
    return ".";
  const hasRoot = path7.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  let end = -1;
  let matchedSlash = true;
  for (let i = path7.length - 1; i >= 1; --i) {
    if (path7.charCodeAt(i) === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path7.slice(0, end);
}
function basename5(path7, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath2(path7);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path7.length) {
    if (ext.length === path7.length && ext === path7)
      return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path7.length - 1; i >= 0; --i) {
      const code = path7.charCodeAt(i);
      if (code === CHAR_FORWARD_SLASH2) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path7.length;
    return path7.slice(start, end);
  } else {
    for (i = path7.length - 1; i >= 0; --i) {
      if (path7.charCodeAt(i) === CHAR_FORWARD_SLASH2) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path7.slice(start, end);
  }
}
function extname5(path7) {
  assertPath2(path7);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path7.length - 1; i >= 0; --i) {
    const code = path7.charCodeAt(i);
    if (code === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path7.slice(startDot, end);
}
function format5(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format2("/", pathObject);
}
function parse5(path7) {
  assertPath2(path7);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path7.length === 0)
    return ret;
  const isAbsolute9 = path7.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  let start;
  if (isAbsolute9) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path7.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code = path7.charCodeAt(i);
    if (code === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute9) {
        ret.base = ret.name = path7.slice(1, end);
      } else {
        ret.base = ret.name = path7.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute9) {
      ret.name = path7.slice(1, startDot);
      ret.base = path7.slice(1, end);
    } else {
      ret.name = path7.slice(startPart, startDot);
      ret.base = path7.slice(startPart, end);
    }
    ret.ext = path7.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path7.slice(0, startPart - 1);
  else if (isAbsolute9)
    ret.dir = "/";
  return ret;
}
function fromFileUrl5(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl5(path7) {
  if (!isAbsolute5(path7)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(
    path7.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.133.0/path/glob.ts
var path3 = isWindows2 ? win32_exports2 : posix_exports2;
var { join: join7, normalize: normalize7 } = path3;

// https://deno.land/std@0.133.0/path/mod.ts
var path4 = isWindows2 ? win32_exports2 : posix_exports2;
var {
  basename: basename6,
  delimiter: delimiter6,
  dirname: dirname6,
  extname: extname6,
  format: format6,
  fromFileUrl: fromFileUrl6,
  isAbsolute: isAbsolute6,
  join: join8,
  normalize: normalize8,
  parse: parse6,
  relative: relative6,
  resolve: resolve6,
  sep: sep6,
  toFileUrl: toFileUrl6,
  toNamespacedPath: toNamespacedPath6
} = path4;

// https://deno.land/std@0.133.0/fs/_util.ts
function isSubdir(src, dest, sep9 = sep6) {
  if (src === dest) {
    return false;
  }
  const srcArray = src.split(sep9);
  const destArray = dest.split(sep9);
  return srcArray.every((current, i) => destArray[i] === current);
}
function getFileInfoType(fileInfo) {
  return fileInfo.isFile ? "file" : fileInfo.isDirectory ? "dir" : fileInfo.isSymlink ? "symlink" : void 0;
}

// https://deno.land/std@0.133.0/fs/ensure_dir.ts
async function ensureDir(dir) {
  try {
    const fileInfo = await Deno.lstat(dir);
    if (!fileInfo.isDirectory) {
      throw new Error(
        `Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`
      );
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      await Deno.mkdir(dir, { recursive: true });
      return;
    }
    throw err;
  }
}
function ensureDirSync(dir) {
  try {
    const fileInfo = Deno.lstatSync(dir);
    if (!fileInfo.isDirectory) {
      throw new Error(
        `Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`
      );
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      Deno.mkdirSync(dir, { recursive: true });
      return;
    }
    throw err;
  }
}

// https://deno.land/std@0.133.0/fs/exists.ts
async function exists(filePath) {
  try {
    await Deno.lstat(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
function existsSync(filePath) {
  try {
    Deno.lstatSync(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}

// https://deno.land/std@0.133.0/fs/move.ts
async function move(src, dest, { overwrite = false } = {}) {
  const srcStat = await Deno.stat(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (overwrite) {
    if (await exists(dest)) {
      await Deno.remove(dest, { recursive: true });
    }
  } else {
    if (await exists(dest)) {
      throw new Error("dest already exists.");
    }
  }
  await Deno.rename(src, dest);
  return;
}
function moveSync(src, dest, { overwrite = false } = {}) {
  const srcStat = Deno.statSync(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (overwrite) {
    if (existsSync(dest)) {
      Deno.removeSync(dest, { recursive: true });
    }
  } else {
    if (existsSync(dest)) {
      throw new Error("dest already exists.");
    }
  }
  Deno.renameSync(src, dest);
}

// https://deno.land/std@0.133.0/_deno_unstable.ts
function utime(...args2) {
  if (typeof Deno.utime == "function") {
    return Deno.utime(...args2);
  } else {
    return Promise.reject(new TypeError("Requires --unstable"));
  }
}
function utimeSync(...args2) {
  if (typeof Deno.utimeSync == "function") {
    return Deno.utimeSync(...args2);
  } else {
    throw new TypeError("Requires --unstable");
  }
}

// https://deno.land/std@0.133.0/fs/copy.ts
async function ensureValidCopy(src, dest, options) {
  let destStat;
  try {
    destStat = await Deno.lstat(dest);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return;
    }
    throw err;
  }
  if (options.isFolder && !destStat.isDirectory) {
    throw new Error(
      `Cannot overwrite non-directory '${dest}' with directory '${src}'.`
    );
  }
  if (!options.overwrite) {
    throw new Error(`'${dest}' already exists.`);
  }
  return destStat;
}
function ensureValidCopySync(src, dest, options) {
  let destStat;
  try {
    destStat = Deno.lstatSync(dest);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return;
    }
    throw err;
  }
  if (options.isFolder && !destStat.isDirectory) {
    throw new Error(
      `Cannot overwrite non-directory '${dest}' with directory '${src}'.`
    );
  }
  if (!options.overwrite) {
    throw new Error(`'${dest}' already exists.`);
  }
  return destStat;
}
async function copyFile(src, dest, options) {
  await ensureValidCopy(src, dest, options);
  await Deno.copyFile(src, dest);
  if (options.preserveTimestamps) {
    const statInfo = await Deno.stat(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await utime(dest, statInfo.atime, statInfo.mtime);
  }
}
function copyFileSync(src, dest, options) {
  ensureValidCopySync(src, dest, options);
  Deno.copyFileSync(src, dest);
  if (options.preserveTimestamps) {
    const statInfo = Deno.statSync(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    utimeSync(dest, statInfo.atime, statInfo.mtime);
  }
}
async function copySymLink(src, dest, options) {
  await ensureValidCopy(src, dest, options);
  const originSrcFilePath = await Deno.readLink(src);
  const type = getFileInfoType(await Deno.lstat(src));
  if (isWindows2) {
    await Deno.symlink(originSrcFilePath, dest, {
      type: type === "dir" ? "dir" : "file"
    });
  } else {
    await Deno.symlink(originSrcFilePath, dest);
  }
  if (options.preserveTimestamps) {
    const statInfo = await Deno.lstat(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await utime(dest, statInfo.atime, statInfo.mtime);
  }
}
function copySymlinkSync(src, dest, options) {
  ensureValidCopySync(src, dest, options);
  const originSrcFilePath = Deno.readLinkSync(src);
  const type = getFileInfoType(Deno.lstatSync(src));
  if (isWindows2) {
    Deno.symlinkSync(originSrcFilePath, dest, {
      type: type === "dir" ? "dir" : "file"
    });
  } else {
    Deno.symlinkSync(originSrcFilePath, dest);
  }
  if (options.preserveTimestamps) {
    const statInfo = Deno.lstatSync(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    utimeSync(dest, statInfo.atime, statInfo.mtime);
  }
}
async function copyDir(src, dest, options) {
  const destStat = await ensureValidCopy(src, dest, {
    ...options,
    isFolder: true
  });
  if (!destStat) {
    await ensureDir(dest);
  }
  if (options.preserveTimestamps) {
    const srcStatInfo = await Deno.stat(src);
    assert2(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
  }
  for await (const entry of Deno.readDir(src)) {
    const srcPath = join8(src, entry.name);
    const destPath = join8(dest, basename6(srcPath));
    if (entry.isSymlink) {
      await copySymLink(srcPath, destPath, options);
    } else if (entry.isDirectory) {
      await copyDir(srcPath, destPath, options);
    } else if (entry.isFile) {
      await copyFile(srcPath, destPath, options);
    }
  }
}
function copyDirSync(src, dest, options) {
  const destStat = ensureValidCopySync(src, dest, {
    ...options,
    isFolder: true
  });
  if (!destStat) {
    ensureDirSync(dest);
  }
  if (options.preserveTimestamps) {
    const srcStatInfo = Deno.statSync(src);
    assert2(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
  }
  for (const entry of Deno.readDirSync(src)) {
    assert2(entry.name != null, "file.name must be set");
    const srcPath = join8(src, entry.name);
    const destPath = join8(dest, basename6(srcPath));
    if (entry.isSymlink) {
      copySymlinkSync(srcPath, destPath, options);
    } else if (entry.isDirectory) {
      copyDirSync(srcPath, destPath, options);
    } else if (entry.isFile) {
      copyFileSync(srcPath, destPath, options);
    }
  }
}
async function copy(src, dest, options = {}) {
  src = resolve6(src);
  dest = resolve6(dest);
  if (src === dest) {
    throw new Error("Source and destination cannot be the same.");
  }
  const srcStat = await Deno.lstat(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (srcStat.isSymlink) {
    await copySymLink(src, dest, options);
  } else if (srcStat.isDirectory) {
    await copyDir(src, dest, options);
  } else if (srcStat.isFile) {
    await copyFile(src, dest, options);
  }
}
function copySync(src, dest, options = {}) {
  src = resolve6(src);
  dest = resolve6(dest);
  if (src === dest) {
    throw new Error("Source and destination cannot be the same.");
  }
  const srcStat = Deno.lstatSync(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (srcStat.isSymlink) {
    copySymlinkSync(src, dest, options);
  } else if (srcStat.isDirectory) {
    copyDirSync(src, dest, options);
  } else if (srcStat.isFile) {
    copyFileSync(src, dest, options);
  }
}

// https://deno.land/x/good@1.6.0.1/value.js
var typedArrayClasses = [
  Uint16Array,
  Uint32Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Int32Array,
  Int8Array,
  Float32Array,
  Float64Array,
  globalThis.BigInt64Array,
  globalThis.BigUint64Array
].filter((each2) => each2);
var copyableClasses = /* @__PURE__ */ new Set([RegExp, Date, URL, ...typedArrayClasses, globalThis.ArrayBuffer, globalThis.DataView]);
var IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
var ArrayIterator = Object.getPrototypeOf([][Symbol.iterator]);
var MapIterator = Object.getPrototypeOf((/* @__PURE__ */ new Map())[Symbol.iterator]);
var SetIterator = Object.getPrototypeOf((/* @__PURE__ */ new Set())[Symbol.iterator]);
var AsyncFunction = class {
};
var GeneratorFunction = class {
};
var AsyncGeneratorFunction = class {
};
var SyncGenerator = class {
};
var AsyncGenerator = class {
};
try {
  AsyncFunction = eval("(async function(){}).constructor");
  GeneratorFunction = eval("(function*(){}).constructor");
  AsyncGeneratorFunction = eval("(async function*(){}).constructor");
  SyncGenerator = eval("((function*(){})()).constructor");
  AsyncGenerator = eval("((async function*(){})()).constructor");
} catch (error) {
}
var isPrimitive = (value) => !(value instanceof Object);
var isPureObject = (value) => value instanceof Object && Object.getPrototypeOf(value).constructor == Object;
var isPracticallyPrimitive = (value) => isPrimitive(value) || value instanceof Date || value instanceof RegExp || value instanceof URL;
var isBuiltInIterator = (value) => IteratorPrototype.isPrototypeOf(value);
var isGeneratorType = (value) => {
  if (value instanceof Object) {
    if (isBuiltInIterator(value)) {
      return true;
    }
    const constructor = value.constructor;
    return constructor == SyncGenerator || constructor == AsyncGenerator;
  }
  return false;
};
var isAsyncIterable = function(value) {
  return value && typeof value[Symbol.asyncIterator] === "function";
};
var isSyncIterable = function(value) {
  return value && typeof value[Symbol.iterator] === "function";
};
var isIterableObjectOrContainer = function(value) {
  return value instanceof Object && (typeof value[Symbol.iterator] == "function" || typeof value[Symbol.asyncIterator] === "function");
};
var isTechnicallyIterable = function(value) {
  return value instanceof Object || typeof value == "string";
};
var isSyncIterableObjectOrContainer = function(value) {
  return value instanceof Object && typeof value[Symbol.iterator] == "function";
};
var deepCopySymbol = Symbol.for("deepCopy");
var clonedFromSymbol = Symbol();
var getThis = Symbol();
Object.getPrototypeOf(function() {
})[getThis] = function() {
  return this;
};
function deepCopyInner(value, valueChain = [], originalToCopyMap = /* @__PURE__ */ new Map()) {
  valueChain.push(value);
  if (value == null) {
    return value;
  }
  if (!(value instanceof Object)) {
    return value;
  }
  if (originalToCopyMap.has(value)) {
    return originalToCopyMap.get(value);
  }
  if (value[deepCopySymbol] instanceof Function) {
    const clonedValue = value[deepCopySymbol](originalToCopyMap);
    originalToCopyMap.set(value, clonedValue);
    return clonedValue;
  }
  if (isGeneratorType(value)) {
    throw Error(`Sadly built-in generators cannot be deep copied.
And I found a generator along this path:
${valueChain.reverse().map((each2) => `${each2},
`)}`);
  }
  let object, theThis, thisCopy;
  if (value instanceof Date) {
    object = new Date(value.getTime());
  } else if (value instanceof RegExp) {
    object = new RegExp(value);
  } else if (value instanceof URL) {
    object = new URL(value);
  } else if (value instanceof Function) {
    theThis = value[getThis]();
    object = value.bind(theThis);
  } else if (copyableClasses.has(value.constructor)) {
    object = new value.constructor(value);
  } else if (value instanceof Array) {
    object = [];
  } else if (value instanceof Set) {
    object = /* @__PURE__ */ new Set();
  } else if (value instanceof Map) {
    object = /* @__PURE__ */ new Map();
  }
  originalToCopyMap.set(value, object);
  if (object instanceof Function) {
    thisCopy = deepCopyInner(theThis, valueChain, originalToCopyMap);
    object = object.bind(thisCopy);
  }
  const output2 = object;
  try {
    output2.constructor = value.constructor;
  } catch (error) {
  }
  Object.setPrototypeOf(output2, Object.getPrototypeOf(value));
  const propertyDefinitions = {};
  for (const [key, description] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    const { value: value2, get, set, ...options } = description;
    const getIsFunc = get instanceof Function;
    const setIsFunc = set instanceof Function;
    if (getIsFunc || setIsFunc) {
      propertyDefinitions[key] = {
        ...options,
        get: get ? function(...args2) {
          return get.apply(output2, args2);
        } : void 0,
        set: set ? function(...args2) {
          return set.apply(output2, args2);
        } : void 0
      };
    } else {
      if (key == "length" && output2 instanceof Array) {
        continue;
      }
      propertyDefinitions[key] = {
        ...options,
        value: deepCopyInner(value2, valueChain, originalToCopyMap)
      };
    }
  }
  Object.defineProperties(output2, propertyDefinitions);
  return output2;
}
var deepCopy = (value) => deepCopyInner(value);
var shallowSortObject = (obj) => {
  return Object.keys(obj).sort().reduce(
    (newObj, key) => {
      newObj[key] = obj[key];
      return newObj;
    },
    {}
  );
};
var deepSortObject = (obj, seen = /* @__PURE__ */ new Map()) => {
  if (!(obj instanceof Object)) {
    return obj;
  } else if (seen.has(obj)) {
    return seen.get(obj);
  } else {
    if (obj instanceof Array) {
      const sortedChildren = [];
      seen.set(obj, sortedChildren);
      for (const each2 of obj) {
        sortedChildren.push(deepSortObject(each2, seen));
      }
      return sortedChildren;
    } else {
      const sorted = {};
      seen.set(obj, sorted);
      for (const eachKey of Object.keys(obj).sort()) {
        sorted[eachKey] = deepSortObject(obj[eachKey], seen);
      }
      return sorted;
    }
  }
};
var stableStringify = (value, ...args2) => {
  return JSON.stringify(deepSortObject(value), ...args2);
};
var allKeys = function(obj) {
  let keys = [];
  if (obj == null) {
    return [];
  }
  if (!(obj instanceof Object)) {
    obj = Object.getPrototypeOf(obj);
  }
  while (obj) {
    keys = keys.concat(Reflect.ownKeys(obj));
    obj = Object.getPrototypeOf(obj);
  }
  return keys;
};
var ownKeyDescriptions = Object.getOwnPropertyDescriptors;
var allKeyDescriptions = function(value, options = { includingBuiltin: false }) {
  var { includingBuiltin } = { ...options };
  let descriptions = [];
  if (value == null) {
    return {};
  }
  if (!(value instanceof Object)) {
    value = Object.getPrototypeOf(value);
  }
  const rootPrototype = Object.getPrototypeOf({});
  let prevObj;
  while (value && value != prevObj) {
    if (!includingBuiltin && value == rootPrototype) {
      break;
    }
    descriptions = descriptions.concat(Object.entries(Object.getOwnPropertyDescriptors(value)));
    prevObj = value;
    value = Object.getPrototypeOf(value);
  }
  descriptions.reverse();
  return Object.fromEntries(descriptions);
};

// https://deno.land/x/good@1.6.0.1/async.js
var objectPrototype = Object.getPrototypeOf({});

// https://deno.land/x/good@1.6.0.1/iterable.js
var emptyIterator = /* @__PURE__ */ function* () {
}();
var makeIterable = (object) => {
  if (object == null) {
    return emptyIterator;
  }
  if (object[Symbol.iterator] instanceof Function || object[Symbol.asyncIterator] instanceof Function) {
    return object;
  }
  if (Object.getPrototypeOf(object).constructor == Object) {
    return Object.entries(object);
  }
  return emptyIterator;
};
var Stop = Symbol("iterationStop");
var iter = (object) => {
  const iterable = makeIterable(object);
  if (iterable[Symbol.asyncIterator]) {
    return iterable[Symbol.asyncIterator]();
  } else {
    return iterable[Symbol.iterator]();
  }
};
async function asyncIteratorToList(asyncIterator) {
  const results = [];
  for await (const each2 of asyncIterator) {
    results.push(each2);
  }
  return results;
}
var zip = function* (...iterables) {
  iterables = iterables.map((each2) => iter(each2));
  while (true) {
    const nexts = iterables.map((each2) => each2.next());
    if (nexts.every((each2) => each2.done)) {
      break;
    }
    yield nexts.map((each2) => each2.value);
  }
};
var ERROR_WHILE_MAPPING_MESSAGE = "Threw while mapping.";
function concurrentlyTransform({ iterator, transformFunction, poolLimit = null, awaitAll = false }) {
  poolLimit = poolLimit || concurrentlyTransform.defaultPoolLimit;
  const res = new TransformStream({
    async transform(p, controller) {
      try {
        const s = await p;
        controller.enqueue(s);
      } catch (e) {
        if (e instanceof AggregateError && e.message == ERROR_WHILE_MAPPING_MESSAGE) {
          controller.error(e);
        }
      }
    }
  });
  const mainPromise = (async () => {
    const writer = res.writable.getWriter();
    const executing = [];
    try {
      let index = 0;
      for await (const item of iterator) {
        const p = Promise.resolve().then(() => transformFunction(item, index));
        index++;
        writer.write(p);
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= poolLimit) {
          await Promise.race(executing);
        }
      }
      await Promise.all(executing);
      writer.close();
    } catch {
      const errors2 = [];
      for (const result of await Promise.allSettled(executing)) {
        if (result.status == "rejected") {
          errors2.push(result.reason);
        }
      }
      writer.write(Promise.reject(
        new AggregateError(errors2, ERROR_WHILE_MAPPING_MESSAGE)
      )).catch(() => {
      });
    }
  })();
  const asyncIterator = res.readable[Symbol.asyncIterator]();
  if (!awaitAll) {
    return asyncIterator;
  } else {
    return mainPromise.then(() => asyncIteratorToList(asyncIterator));
  }
}
concurrentlyTransform.defaultPoolLimit = 40;

// https://deno.land/x/good@1.6.0.1/string.js
var indent = ({ string, by = "    ", noLead = false }) => (noLead ? "" : by) + string.replace(/\n/g, "\n" + by);
var toString = (value) => {
  if (typeof value == "symbol") {
    return toRepresentation(value);
  } else if (!(value instanceof Object)) {
    return value != null ? value.toString() : `${value}`;
  } else {
    return toRepresentation(value);
  }
};
var reprSymbol = Symbol.for("representation");
var denoInspectSymbol = Symbol.for("Deno.customInspect");
var toRepresentation = (item) => {
  const alreadySeen = /* @__PURE__ */ new Set();
  const recursionWrapper = (item2) => {
    if (item2 instanceof Object) {
      if (alreadySeen.has(item2)) {
        return `[Self Reference]`;
      } else {
        alreadySeen.add(item2);
      }
    }
    let output2;
    if (item2 === void 0) {
      output2 = "undefined";
    } else if (item2 === null) {
      output2 = "null";
    } else if (typeof item2 == "string") {
      output2 = JSON.stringify(item2);
    } else if (typeof item2 == "symbol") {
      if (!item2.description) {
        output2 = "Symbol()";
      } else {
        const globalVersion = Symbol.for(item2.description);
        if (globalVersion == item2) {
          output2 = `Symbol.for(${JSON.stringify(item2.description)})`;
        } else {
          output2 = `Symbol(${JSON.stringify(item2.description)})`;
        }
      }
    } else if (item2 instanceof Date) {
      output2 = `new Date(${item2.getTime()})`;
    } else if (item2 instanceof Array) {
      output2 = `[${item2.map((each2) => recursionWrapper(each2)).join(",")}]`;
    } else if (item2 instanceof Set) {
      output2 = `new Set(${[...item2].map((each2) => recursionWrapper(each2)).join(",")})`;
    } else if (item2 instanceof Object && item2.constructor == Object) {
      output2 = pureObjectRepr(item2);
    } else if (item2 instanceof Map) {
      let string = "new Map(";
      for (const [key, value] of item2.entries()) {
        const stringKey = recursionWrapper(key);
        const stringValue = recursionWrapper(value);
        if (!stringKey.match(/\n/g)) {
          string += `
  [${stringKey}, ${indent({ string: stringValue, by: "  ", noLead: true })}],`;
        } else {
          string += `
  [${indent({ string: stringKey, by: "  ", noLead: true })},
  ${indent({ string: stringValue, by: "    ", noLead: true })}],`;
        }
      }
      string += "\n)";
      output2 = string;
    } else {
      if (item2[reprSymbol] instanceof Function) {
        try {
          output2 = item2[reprSymbol]();
          return output2;
        } catch (error) {
        }
      }
      if (item2[denoInspectSymbol] instanceof Function) {
        try {
          output2 = item2[denoInspectSymbol]();
          return output2;
        } catch (error) {
        }
      }
      try {
        output2 = item2.toString();
        if (output2 !== "[object Object]") {
          return output2;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && item2.prototype && typeof item2.name == "string") {
          output2 = `class ${item2.name} { /*...*/ }`;
          return output2;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && typeof item2.constructor.name == "string") {
          output2 = `new ${item2.constructor.name}(${pureObjectRepr(item2)})`;
          return output2;
        }
      } catch (error) {
      }
      return pureObjectRepr(item2);
    }
    return output2;
  };
  const pureObjectRepr = (item2) => {
    let string = "{";
    for (const [key, value] of Object.entries(item2)) {
      const stringKey = recursionWrapper(key);
      const stringValue = recursionWrapper(value);
      string += `
  ${stringKey}: ${indent({ string: stringValue, by: "  ", noLead: true })},`;
    }
    string += "\n}";
    return string;
  };
  return recursionWrapper(item);
};
var findAll = (regexPattern, sourceString) => {
  var output2 = [];
  var match;
  var regexPatternWithGlobal = regexPattern.global ? regexPattern : RegExp(regexPattern, regexPattern.flags + "g");
  while (match = regexPatternWithGlobal.exec(sourceString)) {
    output2.push(match);
    if (match[0].length == 0) {
      regexPatternWithGlobal.lastIndex += 1;
    }
  }
  return output2;
};
var reservedCharMap = {
  "&": "\\x26",
  "!": "\\x21",
  "#": "\\x23",
  "$": "\\$",
  "%": "\\x25",
  "*": "\\*",
  "+": "\\+",
  ",": "\\x2c",
  ".": "\\.",
  ":": "\\x3a",
  ";": "\\x3b",
  "<": "\\x3c",
  "=": "\\x3d",
  ">": "\\x3e",
  "?": "\\?",
  "@": "\\x40",
  "^": "\\^",
  "`": "\\x60",
  "~": "\\x7e",
  "(": "\\(",
  ")": "\\)",
  "[": "\\[",
  "]": "\\]",
  "{": "\\{",
  "}": "\\}",
  "/": "\\/",
  "-": "\\x2d",
  "\\": "\\\\",
  "|": "\\|"
};
var RX_REGEXP_ESCAPE = new RegExp(
  `[${Object.values(reservedCharMap).join("")}]`,
  "gu"
);
function escapeRegexMatch(str) {
  return str.replaceAll(
    RX_REGEXP_ESCAPE,
    (m) => reservedCharMap[m]
  );
}
var regexpProxy = Symbol("regexpProxy");
var realExec = RegExp.prototype.exec;
RegExp.prototype.exec = function(...args2) {
  if (this[regexpProxy]) {
    return realExec.apply(this[regexpProxy], args2);
  }
  return realExec.apply(this, args2);
};
var proxyRegExp;
var regexProxyOptions = Object.freeze({
  get(original, key) {
    if (typeof key == "string" && key.match(/^[igmusyv]+$/)) {
      return proxyRegExp(original, key);
    }
    if (key == regexpProxy) {
      return original;
    }
    return original[key];
  },
  set(original, key, value) {
    original[key] = value;
    return true;
  }
});
proxyRegExp = (parent, flags) => {
  const regex2 = new RegExp(parent, flags);
  const output2 = new Proxy(regex2, regexProxyOptions);
  Object.setPrototypeOf(output2, Object.getPrototypeOf(regex2));
  return output2;
};
function regexWithStripWarning(shouldStrip) {
  return (strings, ...values) => {
    let newRegexString = "";
    for (const [string, value] of zip(strings, values)) {
      newRegexString += string;
      if (value instanceof RegExp) {
        if (!shouldStrip && value.flags.replace(/g/, "").length > 0) {
          console.warn(`Warning: flags inside of regex:
    The RegExp trigging this warning is: ${value}
    When calling the regex interpolater (e.g. regex\`something\${stuff}\`)
    one of the \${} values (the one above) was a RegExp with a flag enabled
    e.g. /stuff/i  <- i = ignoreCase flag enabled
    When the /stuff/i gets interpolated, its going to loose its flags
    (thats what I'm warning you about)
    
    To disable/ignore this warning do:
        regex.stripFlags\`something\${/stuff/i}\`
    If you want to add flags to the output of regex\`something\${stuff}\` do:
        regex\`something\${stuff}\`.i   // ignoreCase
        regex\`something\${stuff}\`.ig  // ignoreCase and global
        regex\`something\${stuff}\`.gi  // functionally equivlent
`);
        }
        newRegexString += `(?:${value.source})`;
      } else if (value != null) {
        newRegexString += escapeRegexMatch(toString(value));
      }
    }
    return proxyRegExp(newRegexString, "");
  };
}
var regex = regexWithStripWarning(false);
regex.stripFlags = regexWithStripWarning(true);
var textDecoder = new TextDecoder("utf-8");
var textEncoder = new TextEncoder("utf-8");
var utf8BytesToString = textDecoder.decode.bind(textDecoder);
var stringToUtf8Bytes = textEncoder.encode.bind(textEncoder);

// https://deno.land/std@0.191.0/_util/os.ts
var osType3 = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win")) {
    return "windows";
  }
  return "linux";
})();
var isWindows3 = osType3 === "windows";

// https://deno.land/std@0.191.0/path/win32.ts
var win32_exports3 = {};
__export(win32_exports3, {
  basename: () => basename7,
  delimiter: () => delimiter7,
  dirname: () => dirname7,
  extname: () => extname7,
  format: () => format7,
  fromFileUrl: () => fromFileUrl7,
  isAbsolute: () => isAbsolute7,
  join: () => join9,
  normalize: () => normalize9,
  parse: () => parse7,
  relative: () => relative7,
  resolve: () => resolve7,
  sep: () => sep7,
  toFileUrl: () => toFileUrl7,
  toNamespacedPath: () => toNamespacedPath7
});

// https://deno.land/std@0.191.0/path/_constants.ts
var CHAR_UPPERCASE_A3 = 65;
var CHAR_LOWERCASE_A3 = 97;
var CHAR_UPPERCASE_Z3 = 90;
var CHAR_LOWERCASE_Z3 = 122;
var CHAR_DOT3 = 46;
var CHAR_FORWARD_SLASH3 = 47;
var CHAR_BACKWARD_SLASH3 = 92;
var CHAR_COLON3 = 58;
var CHAR_QUESTION_MARK3 = 63;

// https://deno.land/std@0.191.0/path/_util.ts
function assertPath3(path7) {
  if (typeof path7 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path7)}`
    );
  }
}
function isPosixPathSeparator3(code) {
  return code === CHAR_FORWARD_SLASH3;
}
function isPathSeparator3(code) {
  return isPosixPathSeparator3(code) || code === CHAR_BACKWARD_SLASH3;
}
function isWindowsDeviceRoot3(code) {
  return code >= CHAR_LOWERCASE_A3 && code <= CHAR_LOWERCASE_Z3 || code >= CHAR_UPPERCASE_A3 && code <= CHAR_UPPERCASE_Z3;
}
function normalizeString3(path7, allowAboveRoot, separator, isPathSeparator4) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0, len = path7.length; i <= len; ++i) {
    if (i < len)
      code = path7.charCodeAt(i);
    else if (isPathSeparator4(code))
      break;
    else
      code = CHAR_FORWARD_SLASH3;
    if (isPathSeparator4(code)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT3 || res.charCodeAt(res.length - 2) !== CHAR_DOT3) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += `${separator}..`;
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += separator + path7.slice(lastSlash + 1, i);
        else
          res = path7.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT3 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format3(sep9, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (base === sep9)
    return dir;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep9 + base;
}
var WHITESPACE_ENCODINGS3 = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace3(string) {
  return string.replaceAll(/[\s]/g, (c) => {
    return WHITESPACE_ENCODINGS3[c] ?? c;
  });
}
function lastPathSegment(path7, isSep, start = 0) {
  let matchedNonSeparator = false;
  let end = path7.length;
  for (let i = path7.length - 1; i >= start; --i) {
    if (isSep(path7.charCodeAt(i))) {
      if (matchedNonSeparator) {
        start = i + 1;
        break;
      }
    } else if (!matchedNonSeparator) {
      matchedNonSeparator = true;
      end = i + 1;
    }
  }
  return path7.slice(start, end);
}
function stripTrailingSeparators(segment, isSep) {
  if (segment.length <= 1) {
    return segment;
  }
  let end = segment.length;
  for (let i = segment.length - 1; i > 0; i--) {
    if (isSep(segment.charCodeAt(i))) {
      end = i;
    } else {
      break;
    }
  }
  return segment.slice(0, end);
}
function stripSuffix(name, suffix) {
  if (suffix.length >= name.length) {
    return name;
  }
  const lenDiff = name.length - suffix.length;
  for (let i = suffix.length - 1; i >= 0; --i) {
    if (name.charCodeAt(lenDiff + i) !== suffix.charCodeAt(i)) {
      return name;
    }
  }
  return name.slice(0, -suffix.length);
}

// https://deno.land/std@0.191.0/_util/asserts.ts
var DenoStdInternalError3 = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert3(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError3(msg);
  }
}

// https://deno.land/std@0.191.0/path/win32.ts
var sep7 = "\\";
var delimiter7 = ";";
function resolve7(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path7;
    const { Deno: Deno4 } = globalThis;
    if (i >= 0) {
      path7 = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path7 = Deno4.cwd();
    } else {
      if (typeof Deno4?.env?.get !== "function" || typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path7 = Deno4.cwd();
      if (path7 === void 0 || path7.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path7 = `${resolvedDevice}\\`;
      }
    }
    assertPath3(path7);
    const len = path7.length;
    if (len === 0)
      continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute9 = false;
    const code = path7.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator3(code)) {
        isAbsolute9 = true;
        if (isPathSeparator3(path7.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator3(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            const firstPart = path7.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator3(path7.charCodeAt(j)))
                break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator3(path7.charCodeAt(j)))
                  break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path7.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path7.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot3(code)) {
        if (path7.charCodeAt(1) === CHAR_COLON3) {
          device = path7.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator3(path7.charCodeAt(2))) {
              isAbsolute9 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator3(code)) {
      rootEnd = 1;
      isAbsolute9 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path7.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute9;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0)
      break;
  }
  resolvedTail = normalizeString3(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator3
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize9(path7) {
  assertPath3(path7);
  const len = path7.length;
  if (len === 0)
    return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute9 = false;
  const code = path7.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator3(code)) {
      isAbsolute9 = true;
      if (isPathSeparator3(path7.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator3(path7.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          const firstPart = path7.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator3(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator3(path7.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path7.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path7.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot3(code)) {
      if (path7.charCodeAt(1) === CHAR_COLON3) {
        device = path7.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator3(path7.charCodeAt(2))) {
            isAbsolute9 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator3(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString3(
      path7.slice(rootEnd),
      !isAbsolute9,
      "\\",
      isPathSeparator3
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute9)
    tail = ".";
  if (tail.length > 0 && isPathSeparator3(path7.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute9) {
      if (tail.length > 0)
        return `\\${tail}`;
      else
        return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute9) {
    if (tail.length > 0)
      return `${device}\\${tail}`;
    else
      return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute7(path7) {
  assertPath3(path7);
  const len = path7.length;
  if (len === 0)
    return false;
  const code = path7.charCodeAt(0);
  if (isPathSeparator3(code)) {
    return true;
  } else if (isWindowsDeviceRoot3(code)) {
    if (len > 2 && path7.charCodeAt(1) === CHAR_COLON3) {
      if (isPathSeparator3(path7.charCodeAt(2)))
        return true;
    }
  }
  return false;
}
function join9(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0)
    return ".";
  let joined;
  let firstPart = null;
  for (let i = 0; i < pathsCount; ++i) {
    const path7 = paths[i];
    assertPath3(path7);
    if (path7.length > 0) {
      if (joined === void 0)
        joined = firstPart = path7;
      else
        joined += `\\${path7}`;
    }
  }
  if (joined === void 0)
    return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert3(firstPart != null);
  if (isPathSeparator3(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator3(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator3(firstPart.charCodeAt(2)))
            ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator3(joined.charCodeAt(slashCount)))
        break;
    }
    if (slashCount >= 2)
      joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize9(joined);
}
function relative7(from, to) {
  assertPath3(from);
  assertPath3(to);
  if (from === to)
    return "";
  const fromOrig = resolve7(from);
  const toOrig = resolve7(to);
  if (fromOrig === toOrig)
    return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to)
    return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH3)
      break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH3)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH3)
      break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH3)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH3) {
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH3) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_BACKWARD_SLASH3)
      lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1)
    lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH3) {
      if (out.length === 0)
        out += "..";
      else
        out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH3)
      ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath7(path7) {
  if (typeof path7 !== "string")
    return path7;
  if (path7.length === 0)
    return "";
  const resolvedPath = resolve7(path7);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH3) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH3) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK3 && code !== CHAR_DOT3) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot3(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON3 && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH3) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path7;
}
function dirname7(path7) {
  assertPath3(path7);
  const len = path7.length;
  if (len === 0)
    return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path7.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator3(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator3(path7.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator3(path7.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator3(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator3(path7.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return path7;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot3(code)) {
      if (path7.charCodeAt(1) === CHAR_COLON3) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator3(path7.charCodeAt(2)))
            rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator3(code)) {
    return path7;
  }
  for (let i = len - 1; i >= offset; --i) {
    if (isPathSeparator3(path7.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1)
      return ".";
    else
      end = rootEnd;
  }
  return stripTrailingSeparators(path7.slice(0, end), isPosixPathSeparator3);
}
function basename7(path7, suffix = "") {
  assertPath3(path7);
  if (path7.length === 0)
    return path7;
  if (typeof suffix !== "string") {
    throw new TypeError(
      `Suffix must be a string. Received ${JSON.stringify(suffix)}`
    );
  }
  let start = 0;
  if (path7.length >= 2) {
    const drive = path7.charCodeAt(0);
    if (isWindowsDeviceRoot3(drive)) {
      if (path7.charCodeAt(1) === CHAR_COLON3)
        start = 2;
    }
  }
  const lastSegment = lastPathSegment(path7, isPathSeparator3, start);
  const strippedSegment = stripTrailingSeparators(lastSegment, isPathSeparator3);
  return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}
function extname7(path7) {
  assertPath3(path7);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path7.length >= 2 && path7.charCodeAt(1) === CHAR_COLON3 && isWindowsDeviceRoot3(path7.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path7.length - 1; i >= start; --i) {
    const code = path7.charCodeAt(i);
    if (isPathSeparator3(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT3) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path7.slice(startDot, end);
}
function format7(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format3("\\", pathObject);
}
function parse7(path7) {
  assertPath3(path7);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path7.length;
  if (len === 0)
    return ret;
  let rootEnd = 0;
  let code = path7.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator3(code)) {
      rootEnd = 1;
      if (isPathSeparator3(path7.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator3(path7.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator3(path7.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator3(path7.charCodeAt(j)))
                break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot3(code)) {
      if (path7.charCodeAt(1) === CHAR_COLON3) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator3(path7.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path7;
              ret.base = "\\";
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path7;
          return ret;
        }
      }
    }
  } else if (isPathSeparator3(code)) {
    ret.root = ret.dir = path7;
    ret.base = "\\";
    return ret;
  }
  if (rootEnd > 0)
    ret.root = path7.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path7.length - 1;
  let preDotState = 0;
  for (; i >= rootEnd; --i) {
    code = path7.charCodeAt(i);
    if (isPathSeparator3(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT3) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path7.slice(startPart, end);
    }
  } else {
    ret.name = path7.slice(startPart, startDot);
    ret.base = path7.slice(startPart, end);
    ret.ext = path7.slice(startDot, end);
  }
  ret.base = ret.base || "\\";
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path7.slice(0, startPart - 1);
  } else
    ret.dir = ret.root;
  return ret;
}
function fromFileUrl7(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path7 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path7 = `\\\\${url.hostname}${path7}`;
  }
  return path7;
}
function toFileUrl7(path7) {
  if (!isAbsolute7(path7)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname2, pathname] = path7.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace3(pathname.replace(/%/g, "%25"));
  if (hostname2 != null && hostname2 != "localhost") {
    url.hostname = hostname2;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.191.0/path/posix.ts
var posix_exports3 = {};
__export(posix_exports3, {
  basename: () => basename8,
  delimiter: () => delimiter8,
  dirname: () => dirname8,
  extname: () => extname8,
  format: () => format8,
  fromFileUrl: () => fromFileUrl8,
  isAbsolute: () => isAbsolute8,
  join: () => join10,
  normalize: () => normalize10,
  parse: () => parse8,
  relative: () => relative8,
  resolve: () => resolve8,
  sep: () => sep8,
  toFileUrl: () => toFileUrl8,
  toNamespacedPath: () => toNamespacedPath8
});
var sep8 = "/";
var delimiter8 = ":";
function resolve8(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path7;
    if (i >= 0)
      path7 = pathSegments[i];
    else {
      const { Deno: Deno4 } = globalThis;
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path7 = Deno4.cwd();
    }
    assertPath3(path7);
    if (path7.length === 0) {
      continue;
    }
    resolvedPath = `${path7}/${resolvedPath}`;
    resolvedAbsolute = isPosixPathSeparator3(path7.charCodeAt(0));
  }
  resolvedPath = normalizeString3(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator3
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0)
      return `/${resolvedPath}`;
    else
      return "/";
  } else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize10(path7) {
  assertPath3(path7);
  if (path7.length === 0)
    return ".";
  const isAbsolute9 = isPosixPathSeparator3(path7.charCodeAt(0));
  const trailingSeparator = isPosixPathSeparator3(
    path7.charCodeAt(path7.length - 1)
  );
  path7 = normalizeString3(path7, !isAbsolute9, "/", isPosixPathSeparator3);
  if (path7.length === 0 && !isAbsolute9)
    path7 = ".";
  if (path7.length > 0 && trailingSeparator)
    path7 += "/";
  if (isAbsolute9)
    return `/${path7}`;
  return path7;
}
function isAbsolute8(path7) {
  assertPath3(path7);
  return path7.length > 0 && isPosixPathSeparator3(path7.charCodeAt(0));
}
function join10(...paths) {
  if (paths.length === 0)
    return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path7 = paths[i];
    assertPath3(path7);
    if (path7.length > 0) {
      if (!joined)
        joined = path7;
      else
        joined += `/${path7}`;
    }
  }
  if (!joined)
    return ".";
  return normalize10(joined);
}
function relative8(from, to) {
  assertPath3(from);
  assertPath3(to);
  if (from === to)
    return "";
  from = resolve8(from);
  to = resolve8(to);
  if (from === to)
    return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (!isPosixPathSeparator3(from.charCodeAt(fromStart)))
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (!isPosixPathSeparator3(to.charCodeAt(toStart)))
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (isPosixPathSeparator3(to.charCodeAt(toStart + i))) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (isPosixPathSeparator3(from.charCodeAt(fromStart + i))) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (isPosixPathSeparator3(fromCode))
      lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || isPosixPathSeparator3(from.charCodeAt(i))) {
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
    }
  }
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (isPosixPathSeparator3(to.charCodeAt(toStart)))
      ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath8(path7) {
  return path7;
}
function dirname8(path7) {
  if (path7.length === 0)
    return ".";
  let end = -1;
  let matchedNonSeparator = false;
  for (let i = path7.length - 1; i >= 1; --i) {
    if (isPosixPathSeparator3(path7.charCodeAt(i))) {
      if (matchedNonSeparator) {
        end = i;
        break;
      }
    } else {
      matchedNonSeparator = true;
    }
  }
  if (end === -1) {
    return isPosixPathSeparator3(path7.charCodeAt(0)) ? "/" : ".";
  }
  return stripTrailingSeparators(
    path7.slice(0, end),
    isPosixPathSeparator3
  );
}
function basename8(path7, suffix = "") {
  assertPath3(path7);
  if (path7.length === 0)
    return path7;
  if (typeof suffix !== "string") {
    throw new TypeError(
      `Suffix must be a string. Received ${JSON.stringify(suffix)}`
    );
  }
  const lastSegment = lastPathSegment(path7, isPosixPathSeparator3);
  const strippedSegment = stripTrailingSeparators(
    lastSegment,
    isPosixPathSeparator3
  );
  return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}
function extname8(path7) {
  assertPath3(path7);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path7.length - 1; i >= 0; --i) {
    const code = path7.charCodeAt(i);
    if (isPosixPathSeparator3(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT3) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path7.slice(startDot, end);
}
function format8(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format3("/", pathObject);
}
function parse8(path7) {
  assertPath3(path7);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path7.length === 0)
    return ret;
  const isAbsolute9 = isPosixPathSeparator3(path7.charCodeAt(0));
  let start;
  if (isAbsolute9) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path7.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code = path7.charCodeAt(i);
    if (isPosixPathSeparator3(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT3) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute9) {
        ret.base = ret.name = path7.slice(1, end);
      } else {
        ret.base = ret.name = path7.slice(startPart, end);
      }
    }
    ret.base = ret.base || "/";
  } else {
    if (startPart === 0 && isAbsolute9) {
      ret.name = path7.slice(1, startDot);
      ret.base = path7.slice(1, end);
    } else {
      ret.name = path7.slice(startPart, startDot);
      ret.base = path7.slice(startPart, end);
    }
    ret.ext = path7.slice(startDot, end);
  }
  if (startPart > 0) {
    ret.dir = stripTrailingSeparators(
      path7.slice(0, startPart - 1),
      isPosixPathSeparator3
    );
  } else if (isAbsolute9)
    ret.dir = "/";
  return ret;
}
function fromFileUrl8(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl8(path7) {
  if (!isAbsolute8(path7)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace3(
    path7.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.191.0/path/glob.ts
var path5 = isWindows3 ? win32_exports3 : posix_exports3;
var { join: join11, normalize: normalize11 } = path5;
var regExpEscapeChars = [
  "!",
  "$",
  "(",
  ")",
  "*",
  "+",
  ".",
  "=",
  "?",
  "[",
  "\\",
  "^",
  "{",
  "|"
];
var rangeEscapeChars = ["-", "\\", "]"];
function globToRegExp2(glob2, {
  extended = true,
  globstar: globstarOption = true,
  os = osType3,
  caseInsensitive = false
} = {}) {
  if (glob2 == "") {
    return /(?!)/;
  }
  const sep9 = os == "windows" ? "(?:\\\\|/)+" : "/+";
  const sepMaybe = os == "windows" ? "(?:\\\\|/)*" : "/*";
  const seps = os == "windows" ? ["\\", "/"] : ["/"];
  const globstar = os == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*";
  const wildcard = os == "windows" ? "[^\\\\/]*" : "[^/]*";
  const escapePrefix = os == "windows" ? "`" : "\\";
  let newLength = glob2.length;
  for (; newLength > 1 && seps.includes(glob2[newLength - 1]); newLength--)
    ;
  glob2 = glob2.slice(0, newLength);
  let regExpString = "";
  for (let j = 0; j < glob2.length; ) {
    let segment = "";
    const groupStack = [];
    let inRange = false;
    let inEscape = false;
    let endsWithSep = false;
    let i = j;
    for (; i < glob2.length && !seps.includes(glob2[i]); i++) {
      if (inEscape) {
        inEscape = false;
        const escapeChars = inRange ? rangeEscapeChars : regExpEscapeChars;
        segment += escapeChars.includes(glob2[i]) ? `\\${glob2[i]}` : glob2[i];
        continue;
      }
      if (glob2[i] == escapePrefix) {
        inEscape = true;
        continue;
      }
      if (glob2[i] == "[") {
        if (!inRange) {
          inRange = true;
          segment += "[";
          if (glob2[i + 1] == "!") {
            i++;
            segment += "^";
          } else if (glob2[i + 1] == "^") {
            i++;
            segment += "\\^";
          }
          continue;
        } else if (glob2[i + 1] == ":") {
          let k = i + 1;
          let value = "";
          while (glob2[k + 1] != null && glob2[k + 1] != ":") {
            value += glob2[k + 1];
            k++;
          }
          if (glob2[k + 1] == ":" && glob2[k + 2] == "]") {
            i = k + 2;
            if (value == "alnum")
              segment += "\\dA-Za-z";
            else if (value == "alpha")
              segment += "A-Za-z";
            else if (value == "ascii")
              segment += "\0-\x7F";
            else if (value == "blank")
              segment += "	 ";
            else if (value == "cntrl")
              segment += "\0-\x7F";
            else if (value == "digit")
              segment += "\\d";
            else if (value == "graph")
              segment += "!-~";
            else if (value == "lower")
              segment += "a-z";
            else if (value == "print")
              segment += " -~";
            else if (value == "punct") {
              segment += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_\u2018{|}~`;
            } else if (value == "space")
              segment += "\\s\v";
            else if (value == "upper")
              segment += "A-Z";
            else if (value == "word")
              segment += "\\w";
            else if (value == "xdigit")
              segment += "\\dA-Fa-f";
            continue;
          }
        }
      }
      if (glob2[i] == "]" && inRange) {
        inRange = false;
        segment += "]";
        continue;
      }
      if (inRange) {
        if (glob2[i] == "\\") {
          segment += `\\\\`;
        } else {
          segment += glob2[i];
        }
        continue;
      }
      if (glob2[i] == ")" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
        segment += ")";
        const type = groupStack.pop();
        if (type == "!") {
          segment += wildcard;
        } else if (type != "@") {
          segment += type;
        }
        continue;
      }
      if (glob2[i] == "|" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
        segment += "|";
        continue;
      }
      if (glob2[i] == "+" && extended && glob2[i + 1] == "(") {
        i++;
        groupStack.push("+");
        segment += "(?:";
        continue;
      }
      if (glob2[i] == "@" && extended && glob2[i + 1] == "(") {
        i++;
        groupStack.push("@");
        segment += "(?:";
        continue;
      }
      if (glob2[i] == "?") {
        if (extended && glob2[i + 1] == "(") {
          i++;
          groupStack.push("?");
          segment += "(?:";
        } else {
          segment += ".";
        }
        continue;
      }
      if (glob2[i] == "!" && extended && glob2[i + 1] == "(") {
        i++;
        groupStack.push("!");
        segment += "(?!";
        continue;
      }
      if (glob2[i] == "{") {
        groupStack.push("BRACE");
        segment += "(?:";
        continue;
      }
      if (glob2[i] == "}" && groupStack[groupStack.length - 1] == "BRACE") {
        groupStack.pop();
        segment += ")";
        continue;
      }
      if (glob2[i] == "," && groupStack[groupStack.length - 1] == "BRACE") {
        segment += "|";
        continue;
      }
      if (glob2[i] == "*") {
        if (extended && glob2[i + 1] == "(") {
          i++;
          groupStack.push("*");
          segment += "(?:";
        } else {
          const prevChar = glob2[i - 1];
          let numStars = 1;
          while (glob2[i + 1] == "*") {
            i++;
            numStars++;
          }
          const nextChar = glob2[i + 1];
          if (globstarOption && numStars == 2 && [...seps, void 0].includes(prevChar) && [...seps, void 0].includes(nextChar)) {
            segment += globstar;
            endsWithSep = true;
          } else {
            segment += wildcard;
          }
        }
        continue;
      }
      segment += regExpEscapeChars.includes(glob2[i]) ? `\\${glob2[i]}` : glob2[i];
    }
    if (groupStack.length > 0 || inRange || inEscape) {
      segment = "";
      for (const c of glob2.slice(j, i)) {
        segment += regExpEscapeChars.includes(c) ? `\\${c}` : c;
        endsWithSep = false;
      }
    }
    regExpString += segment;
    if (!endsWithSep) {
      regExpString += i < glob2.length ? sep9 : sepMaybe;
      endsWithSep = true;
    }
    while (seps.includes(glob2[i]))
      i++;
    if (!(i > j)) {
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    }
    j = i;
  }
  regExpString = `^${regExpString}$`;
  return new RegExp(regExpString, caseInsensitive ? "i" : "");
}

// https://deno.land/std@0.191.0/bytes/copy.ts
function copy2(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}

// https://deno.land/std@0.191.0/io/buf_reader.ts
var DEFAULT_BUF_SIZE = 4096;
var MIN_BUF_SIZE = 16;
var MAX_CONSECUTIVE_EMPTY_READS = 100;
var CR = "\r".charCodeAt(0);
var LF = "\n".charCodeAt(0);
var BufferFullError = class extends Error {
  constructor(partial) {
    super("Buffer full");
    this.partial = partial;
  }
  name = "BufferFullError";
};
var PartialReadError = class extends Error {
  name = "PartialReadError";
  partial;
  constructor() {
    super("Encountered UnexpectedEof, data only partially read");
  }
};
var BufReader = class _BufReader {
  #buf;
  #rd;
  // Reader provided by caller.
  #r = 0;
  // buf read position.
  #w = 0;
  // buf write position.
  #eof = false;
  // private lastByte: number;
  // private lastCharSize: number;
  /** return new BufReader unless r is BufReader */
  static create(r, size = DEFAULT_BUF_SIZE) {
    return r instanceof _BufReader ? r : new _BufReader(r, size);
  }
  constructor(rd, size = DEFAULT_BUF_SIZE) {
    if (size < MIN_BUF_SIZE) {
      size = MIN_BUF_SIZE;
    }
    this.#reset(new Uint8Array(size), rd);
  }
  /** Returns the size of the underlying buffer in bytes. */
  size() {
    return this.#buf.byteLength;
  }
  buffered() {
    return this.#w - this.#r;
  }
  // Reads a new chunk into the buffer.
  #fill = async () => {
    if (this.#r > 0) {
      this.#buf.copyWithin(0, this.#r, this.#w);
      this.#w -= this.#r;
      this.#r = 0;
    }
    if (this.#w >= this.#buf.byteLength) {
      throw Error("bufio: tried to fill full buffer");
    }
    for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
      const rr = await this.#rd.read(this.#buf.subarray(this.#w));
      if (rr === null) {
        this.#eof = true;
        return;
      }
      assert3(rr >= 0, "negative read");
      this.#w += rr;
      if (rr > 0) {
        return;
      }
    }
    throw new Error(
      `No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`
    );
  };
  /** Discards any buffered data, resets all state, and switches
   * the buffered reader to read from r.
   */
  reset(r) {
    this.#reset(this.#buf, r);
  }
  #reset = (buf, rd) => {
    this.#buf = buf;
    this.#rd = rd;
    this.#eof = false;
  };
  /** reads data into p.
   * It returns the number of bytes read into p.
   * The bytes are taken from at most one Read on the underlying Reader,
   * hence n may be less than len(p).
   * To read exactly len(p) bytes, use io.ReadFull(b, p).
   */
  async read(p) {
    let rr = p.byteLength;
    if (p.byteLength === 0)
      return rr;
    if (this.#r === this.#w) {
      if (p.byteLength >= this.#buf.byteLength) {
        const rr2 = await this.#rd.read(p);
        const nread = rr2 ?? 0;
        assert3(nread >= 0, "negative read");
        return rr2;
      }
      this.#r = 0;
      this.#w = 0;
      rr = await this.#rd.read(this.#buf);
      if (rr === 0 || rr === null)
        return rr;
      assert3(rr >= 0, "negative read");
      this.#w += rr;
    }
    const copied = copy2(this.#buf.subarray(this.#r, this.#w), p, 0);
    this.#r += copied;
    return copied;
  }
  /** reads exactly `p.length` bytes into `p`.
   *
   * If successful, `p` is returned.
   *
   * If the end of the underlying stream has been reached, and there are no more
   * bytes available in the buffer, `readFull()` returns `null` instead.
   *
   * An error is thrown if some bytes could be read, but not enough to fill `p`
   * entirely before the underlying stream reported an error or EOF. Any error
   * thrown will have a `partial` property that indicates the slice of the
   * buffer that has been successfully filled with data.
   *
   * Ported from https://golang.org/pkg/io/#ReadFull
   */
  async readFull(p) {
    let bytesRead = 0;
    while (bytesRead < p.length) {
      try {
        const rr = await this.read(p.subarray(bytesRead));
        if (rr === null) {
          if (bytesRead === 0) {
            return null;
          } else {
            throw new PartialReadError();
          }
        }
        bytesRead += rr;
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = p.subarray(0, bytesRead);
        }
        throw err;
      }
    }
    return p;
  }
  /** Returns the next byte [0, 255] or `null`. */
  async readByte() {
    while (this.#r === this.#w) {
      if (this.#eof)
        return null;
      await this.#fill();
    }
    const c = this.#buf[this.#r];
    this.#r++;
    return c;
  }
  /** readString() reads until the first occurrence of delim in the input,
   * returning a string containing the data up to and including the delimiter.
   * If ReadString encounters an error before finding a delimiter,
   * it returns the data read before the error and the error itself
   * (often `null`).
   * ReadString returns err != nil if and only if the returned data does not end
   * in delim.
   * For simple uses, a Scanner may be more convenient.
   */
  async readString(delim) {
    if (delim.length !== 1) {
      throw new Error("Delimiter should be a single character");
    }
    const buffer = await this.readSlice(delim.charCodeAt(0));
    if (buffer === null)
      return null;
    return new TextDecoder().decode(buffer);
  }
  /** `readLine()` is a low-level line-reading primitive. Most callers should
   * use `readString('\n')` instead or use a Scanner.
   *
   * `readLine()` tries to return a single line, not including the end-of-line
   * bytes. If the line was too long for the buffer then `more` is set and the
   * beginning of the line is returned. The rest of the line will be returned
   * from future calls. `more` will be false when returning the last fragment
   * of the line. The returned buffer is only valid until the next call to
   * `readLine()`.
   *
   * The text returned from ReadLine does not include the line end ("\r\n" or
   * "\n").
   *
   * When the end of the underlying stream is reached, the final bytes in the
   * stream are returned. No indication or error is given if the input ends
   * without a final line end. When there are no more trailing bytes to read,
   * `readLine()` returns `null`.
   *
   * Calling `unreadByte()` after `readLine()` will always unread the last byte
   * read (possibly a character belonging to the line end) even if that byte is
   * not part of the line returned by `readLine()`.
   */
  async readLine() {
    let line = null;
    try {
      line = await this.readSlice(LF);
    } catch (err) {
      let partial;
      if (err instanceof PartialReadError) {
        partial = err.partial;
        assert3(
          partial instanceof Uint8Array,
          "bufio: caught error from `readSlice()` without `partial` property"
        );
      }
      if (!(err instanceof BufferFullError)) {
        throw err;
      }
      partial = err.partial;
      if (!this.#eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
        assert3(this.#r > 0, "bufio: tried to rewind past start of buffer");
        this.#r--;
        partial = partial.subarray(0, partial.byteLength - 1);
      }
      if (partial) {
        return { line: partial, more: !this.#eof };
      }
    }
    if (line === null) {
      return null;
    }
    if (line.byteLength === 0) {
      return { line, more: false };
    }
    if (line[line.byteLength - 1] == LF) {
      let drop = 1;
      if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
        drop = 2;
      }
      line = line.subarray(0, line.byteLength - drop);
    }
    return { line, more: false };
  }
  /** `readSlice()` reads until the first occurrence of `delim` in the input,
   * returning a slice pointing at the bytes in the buffer. The bytes stop
   * being valid at the next read.
   *
   * If `readSlice()` encounters an error before finding a delimiter, or the
   * buffer fills without finding a delimiter, it throws an error with a
   * `partial` property that contains the entire buffer.
   *
   * If `readSlice()` encounters the end of the underlying stream and there are
   * any bytes left in the buffer, the rest of the buffer is returned. In other
   * words, EOF is always treated as a delimiter. Once the buffer is empty,
   * it returns `null`.
   *
   * Because the data returned from `readSlice()` will be overwritten by the
   * next I/O operation, most clients should use `readString()` instead.
   */
  async readSlice(delim) {
    let s = 0;
    let slice;
    while (true) {
      let i = this.#buf.subarray(this.#r + s, this.#w).indexOf(delim);
      if (i >= 0) {
        i += s;
        slice = this.#buf.subarray(this.#r, this.#r + i + 1);
        this.#r += i + 1;
        break;
      }
      if (this.#eof) {
        if (this.#r === this.#w) {
          return null;
        }
        slice = this.#buf.subarray(this.#r, this.#w);
        this.#r = this.#w;
        break;
      }
      if (this.buffered() >= this.#buf.byteLength) {
        this.#r = this.#w;
        const oldbuf = this.#buf;
        const newbuf = this.#buf.slice(0);
        this.#buf = newbuf;
        throw new BufferFullError(oldbuf);
      }
      s = this.#w - this.#r;
      try {
        await this.#fill();
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = slice;
        }
        throw err;
      }
    }
    return slice;
  }
  /** `peek()` returns the next `n` bytes without advancing the reader. The
   * bytes stop being valid at the next read call.
   *
   * When the end of the underlying stream is reached, but there are unread
   * bytes left in the buffer, those bytes are returned. If there are no bytes
   * left in the buffer, it returns `null`.
   *
   * If an error is encountered before `n` bytes are available, `peek()` throws
   * an error with the `partial` property set to a slice of the buffer that
   * contains the bytes that were available before the error occurred.
   */
  async peek(n) {
    if (n < 0) {
      throw Error("negative count");
    }
    let avail = this.#w - this.#r;
    while (avail < n && avail < this.#buf.byteLength && !this.#eof) {
      try {
        await this.#fill();
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = this.#buf.subarray(this.#r, this.#w);
        }
        throw err;
      }
      avail = this.#w - this.#r;
    }
    if (avail === 0 && this.#eof) {
      return null;
    } else if (avail < n && this.#eof) {
      return this.#buf.subarray(this.#r, this.#r + avail);
    } else if (avail < n) {
      throw new BufferFullError(this.#buf.subarray(this.#r, this.#w));
    }
    return this.#buf.subarray(this.#r, this.#r + n);
  }
};

// https://deno.land/std@0.191.0/bytes/concat.ts
function concat(...buf) {
  let length = 0;
  for (const b of buf) {
    length += b.length;
  }
  const output2 = new Uint8Array(length);
  let index = 0;
  for (const b of buf) {
    output2.set(b, index);
    index += b.length;
  }
  return output2;
}

// https://deno.land/std@0.191.0/io/read_lines.ts
async function* readLines(reader, decoderOpts) {
  const bufReader = new BufReader(reader);
  let chunks = [];
  const decoder = new TextDecoder(decoderOpts?.encoding, decoderOpts);
  while (true) {
    const res = await bufReader.readLine();
    if (!res) {
      if (chunks.length > 0) {
        yield decoder.decode(concat(...chunks));
      }
      break;
    }
    chunks.push(res.line);
    if (!res.more) {
      yield decoder.decode(concat(...chunks));
      chunks = [];
    }
  }
}

// https://deno.land/x/good@1.5.0.3/value.js
var typedArrayClasses2 = [
  Uint16Array,
  Uint32Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Int32Array,
  Int8Array,
  Float32Array,
  Float64Array,
  globalThis.BigInt64Array,
  globalThis.BigUint64Array
].filter((each2) => each2);
var copyableClasses2 = /* @__PURE__ */ new Set([RegExp, Date, URL, ...typedArrayClasses2, globalThis.ArrayBuffer, globalThis.DataView]);
var IteratorPrototype2 = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
var ArrayIterator2 = Object.getPrototypeOf([][Symbol.iterator]);
var MapIterator2 = Object.getPrototypeOf((/* @__PURE__ */ new Map())[Symbol.iterator]);
var SetIterator2 = Object.getPrototypeOf((/* @__PURE__ */ new Set())[Symbol.iterator]);
var AsyncFunction2 = class {
};
var GeneratorFunction2 = class {
};
var AsyncGeneratorFunction2 = class {
};
var SyncGenerator2 = class {
};
var AsyncGenerator2 = class {
};
try {
  AsyncFunction2 = eval("(async function(){}).constructor");
  GeneratorFunction2 = eval("(function*(){}).constructor");
  AsyncGeneratorFunction2 = eval("(async function*(){}).constructor");
  SyncGenerator2 = eval("((function*(){})()).constructor");
  AsyncGenerator2 = eval("((async function*(){})()).constructor");
} catch (error) {
}
var isPrimitive2 = (value) => !(value instanceof Object);
var isPureObject2 = (value) => value instanceof Object && Object.getPrototypeOf(value).constructor == Object;
var isPracticallyPrimitive2 = (value) => isPrimitive2(value) || value instanceof Date || value instanceof RegExp || value instanceof URL;
var isBuiltInIterator2 = (value) => IteratorPrototype2.isPrototypeOf(value);
var isGeneratorType2 = (value) => {
  if (value instanceof Object) {
    if (isBuiltInIterator2(value)) {
      return true;
    }
    const constructor = value.constructor;
    return constructor == SyncGenerator2 || constructor == AsyncGenerator2;
  }
  return false;
};
var isAsyncIterable2 = function(value) {
  return value && typeof value[Symbol.asyncIterator] === "function";
};
var isSyncIterable2 = function(value) {
  return value && typeof value[Symbol.iterator] === "function";
};
var isIterableObjectOrContainer2 = function(value) {
  return value instanceof Object && (typeof value[Symbol.iterator] == "function" || typeof value[Symbol.asyncIterator] === "function");
};
var isTechnicallyIterable2 = function(value) {
  return value instanceof Object || typeof value == "string";
};
var isSyncIterableObjectOrContainer2 = function(value) {
  return value instanceof Object && typeof value[Symbol.iterator] == "function";
};
var deepCopySymbol2 = Symbol.for("deepCopy");
var clonedFromSymbol2 = Symbol();
var getThis2 = Symbol();
Object.getPrototypeOf(function() {
})[getThis2] = function() {
  return this;
};
function deepCopyInner2(value, valueChain = [], originalToCopyMap = /* @__PURE__ */ new Map()) {
  valueChain.push(value);
  if (value == null) {
    return value;
  }
  if (!(value instanceof Object)) {
    return value;
  }
  if (originalToCopyMap.has(value)) {
    return originalToCopyMap.get(value);
  }
  if (value[deepCopySymbol2] instanceof Function) {
    const clonedValue = value[deepCopySymbol2](originalToCopyMap);
    originalToCopyMap.set(value, clonedValue);
    return clonedValue;
  }
  if (isGeneratorType2(value)) {
    throw Error(`Sadly built-in generators cannot be deep copied.
And I found a generator along this path:
${valueChain.reverse().map((each2) => `${each2},
`)}`);
  }
  let object, theThis, thisCopy;
  if (value instanceof Date) {
    object = new Date(value.getTime());
  } else if (value instanceof RegExp) {
    object = new RegExp(value);
  } else if (value instanceof URL) {
    object = new URL(value);
  } else if (value instanceof Function) {
    theThis = value[getThis2]();
    object = value.bind(theThis);
  } else if (copyableClasses2.has(value.constructor)) {
    object = new value.constructor(value);
  } else if (value instanceof Array) {
    object = [];
  } else if (value instanceof Set) {
    object = /* @__PURE__ */ new Set();
  } else if (value instanceof Map) {
    object = /* @__PURE__ */ new Map();
  }
  originalToCopyMap.set(value, object);
  if (object instanceof Function) {
    thisCopy = deepCopyInner2(theThis, valueChain, originalToCopyMap);
    object = object.bind(thisCopy);
  }
  const output2 = object;
  try {
    output2.constructor = value.constructor;
  } catch (error) {
  }
  Object.setPrototypeOf(output2, Object.getPrototypeOf(value));
  const propertyDefinitions = {};
  for (const [key, description] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    const { value: value2, get, set, ...options } = description;
    const getIsFunc = get instanceof Function;
    const setIsFunc = set instanceof Function;
    if (getIsFunc || setIsFunc) {
      propertyDefinitions[key] = {
        ...options,
        get: get ? function(...args2) {
          return get.apply(output2, args2);
        } : void 0,
        set: set ? function(...args2) {
          return set.apply(output2, args2);
        } : void 0
      };
    } else {
      if (key == "length" && output2 instanceof Array) {
        continue;
      }
      propertyDefinitions[key] = {
        ...options,
        value: deepCopyInner2(value2, valueChain, originalToCopyMap)
      };
    }
  }
  Object.defineProperties(output2, propertyDefinitions);
  return output2;
}
var deepCopy2 = (value) => deepCopyInner2(value);
var shallowSortObject2 = (obj) => {
  return Object.keys(obj).sort().reduce(
    (newObj, key) => {
      newObj[key] = obj[key];
      return newObj;
    },
    {}
  );
};
var deepSortObject2 = (obj, seen = /* @__PURE__ */ new Map()) => {
  if (!(obj instanceof Object)) {
    return obj;
  } else if (seen.has(obj)) {
    return seen.get(obj);
  } else {
    if (obj instanceof Array) {
      const sortedChildren = [];
      seen.set(obj, sortedChildren);
      for (const each2 of obj) {
        sortedChildren.push(deepSortObject2(each2, seen));
      }
      return sortedChildren;
    } else {
      const sorted = {};
      seen.set(obj, sorted);
      for (const eachKey of Object.keys(obj).sort()) {
        sorted[eachKey] = deepSortObject2(obj[eachKey], seen);
      }
      return sorted;
    }
  }
};
var stableStringify2 = (value, ...args2) => {
  return JSON.stringify(deepSortObject2(value), ...args2);
};
var allKeys2 = function(obj) {
  let keys = [];
  if (obj == null) {
    return [];
  }
  if (!(obj instanceof Object)) {
    obj = Object.getPrototypeOf(obj);
  }
  while (obj) {
    keys = keys.concat(Reflect.ownKeys(obj));
    obj = Object.getPrototypeOf(obj);
  }
  return keys;
};
var ownKeyDescriptions2 = Object.getOwnPropertyDescriptors;
var allKeyDescriptions2 = function(value, options = { includingBuiltin: false }) {
  var { includingBuiltin } = { ...options };
  let descriptions = [];
  if (value == null) {
    return {};
  }
  if (!(value instanceof Object)) {
    value = Object.getPrototypeOf(value);
  }
  const rootPrototype = Object.getPrototypeOf({});
  let prevObj;
  while (value && value != prevObj) {
    if (!includingBuiltin && value == rootPrototype) {
      break;
    }
    descriptions = descriptions.concat(Object.entries(Object.getOwnPropertyDescriptors(value)));
    prevObj = value;
    value = Object.getPrototypeOf(value);
  }
  descriptions.reverse();
  return Object.fromEntries(descriptions);
};

// https://deno.land/x/quickr@0.6.67/main/flat/_path_standardize.js
var pathStandardize = (path7) => {
  path7 = path7.path || path7;
  if (typeof path7 == "string" && path7.startsWith("file:///")) {
    path7 = fromFileUrl3(path7);
  }
  return path7;
};

// https://deno.land/x/deno_deno@1.42.1.7/main.js
var fakeEnv = {
  HOME: "/fake/home",
  SHELL: "sh",
  PWD: "./"
};
var NotFound = class extends Error {
};
var PermissionDenied = class extends Error {
};
var ConnectionRefused = class extends Error {
};
var ConnectionReset = class extends Error {
};
var ConnectionAborted = class extends Error {
};
var NotConnected = class extends Error {
};
var AddrInUse = class extends Error {
};
var AddrNotAvailable = class extends Error {
};
var BrokenPipe = class extends Error {
};
var AlreadyExists = class extends Error {
};
var InvalidData = class extends Error {
};
var TimedOut = class extends Error {
};
var Interrupted = class extends Error {
};
var WriteZero = class extends Error {
};
var WouldBlock = class extends Error {
};
var UnexpectedEof = class extends Error {
};
var BadResource = class extends Error {
};
var Http = class extends Error {
};
var Busy = class extends Error {
};
var NotSupported = class extends Error {
};
var FilesystemLoop = class extends Error {
};
var IsADirectory = class extends Error {
};
var NetworkUnreachable = class extends Error {
};
var NotADirectory = class extends Error {
};
var PermissionStatus = class {
  constructor(state) {
  }
};
var Permissions = class {
  async query() {
    return Promise.resolve(new PermissionStatus("granted"));
  }
  async revoke() {
    return Promise.resolve(new PermissionStatus("granted"));
  }
  async request() {
    return Promise.resolve(new PermissionStatus("granted"));
  }
};
var Stdin = class {
  static rid = 0;
  constructor() {
    this._inputs = [];
    this.isClosed = false;
  }
  isTerminal() {
    return false;
  }
  read(v) {
    return Promise.resolve(new Uint8Array());
  }
  readSync(v) {
  }
  setRaw(v) {
    this._inputs.push(v);
  }
  close() {
    this.isClosed = true;
  }
  readable() {
    if (globalThis.ReadableStream && !this.isClosed) {
      return new ReadableStream();
    }
  }
};
var Stdout = class {
  static rid = 1;
  constructor() {
    this._inputs = [];
  }
  write(v) {
    this._inputs.push(v);
    return Promise.resolve(v.length);
  }
  writeSync(v) {
    this._inputs.push(v);
    return v.length;
  }
  close() {
    this.isClosed = true;
  }
  writable() {
    if (globalThis.WritableStream && !this.isClosed) {
      return new WritableStream();
    }
  }
};
var Stderr = class {
  static rid = 2;
  constructor() {
    this._inputs = [];
  }
  write(v) {
    this._inputs.push(v);
    return Promise.resolve(v.length);
  }
  writeSync(v) {
    this._inputs.push(v);
    return v.length;
  }
  close() {
    this.isClosed = true;
  }
  writable() {
    if (globalThis.WritableStream && !this.isClosed) {
      return new WritableStream();
    }
  }
};
var Deno2 = globalThis.Deno ? globalThis.Deno : {
  mainModule: "file:///fake/$deno$repl.ts",
  internal: Symbol("Deno.internal"),
  version: { deno: "1.42.1", v8: "12.3.219.9", typescript: "5.4.3" },
  noColor: true,
  args: [],
  build: {
    target: "aarch64-apple-darwin",
    arch: "aarch64",
    os: "darwin",
    vendor: "apple",
    env: void 0
    // <- thats actually natively true
  },
  pid: 3,
  ppid: 2,
  env: {
    get(_) {
      return fakeEnv[_];
    },
    set(_, __) {
      fakeEnv[_] = __;
    }
  },
  errors: {
    NotFound,
    PermissionDenied,
    ConnectionRefused,
    ConnectionReset,
    ConnectionAborted,
    NotConnected,
    AddrInUse,
    AddrNotAvailable,
    BrokenPipe,
    AlreadyExists,
    InvalidData,
    TimedOut,
    Interrupted,
    WriteZero,
    WouldBlock,
    UnexpectedEof,
    BadResource,
    Http,
    Busy,
    NotSupported,
    FilesystemLoop,
    IsADirectory,
    NetworkUnreachable,
    NotADirectory
  },
  SeekMode: {
    0: "Start",
    1: "Current",
    2: "End",
    Start: 0,
    Current: 1,
    End: 2
  },
  stdin: new Stdin(),
  stdout: new Stdout(),
  stderr: new Stderr(),
  permissions: new Permissions(),
  resources() {
  },
  close() {
  },
  metrics() {
  },
  Process() {
  },
  run() {
  },
  isatty() {
  },
  writeFileSync() {
  },
  writeFile() {
  },
  writeTextFileSync() {
  },
  writeTextFile() {
  },
  readTextFile() {
  },
  readTextFileSync() {
  },
  readFile() {
  },
  readFileSync() {
  },
  watchFs() {
  },
  chmodSync() {
  },
  chmod() {
  },
  chown() {
  },
  chownSync() {
  },
  copyFileSync() {
  },
  cwd() {
    return fakeEnv["PWD"];
  },
  makeTempDirSync() {
  },
  makeTempDir() {
  },
  makeTempFileSync() {
  },
  makeTempFile() {
  },
  memoryUsage() {
  },
  mkdirSync() {
  },
  mkdir() {
  },
  chdir() {
  },
  copyFile() {
  },
  readDirSync() {
  },
  readDir() {
  },
  readLinkSync() {
  },
  readLink() {
  },
  realPathSync() {
  },
  realPath() {
  },
  removeSync() {
  },
  remove() {
  },
  renameSync() {
  },
  rename() {
  },
  statSync() {
  },
  lstatSync() {
  },
  stat() {
  },
  lstat() {
  },
  truncateSync() {
  },
  truncate() {
  },
  ftruncateSync() {
  },
  ftruncate() {
  },
  futime() {
  },
  futimeSync() {
  },
  inspect() {
  },
  exit() {
    throw Error(`Deno.exit() is not supported, so I'll just throw an error`);
  },
  execPath() {
  },
  Buffer() {
  },
  readAll() {
  },
  readAllSync() {
  },
  writeAll() {
  },
  writeAllSync() {
  },
  copy() {
  },
  iter() {
  },
  iterSync() {
  },
  read() {
  },
  readSync() {
  },
  write() {
  },
  writeSync() {
  },
  File() {
  },
  FsFile() {
  },
  open() {
  },
  openSync() {
  },
  create() {
  },
  createSync() {
  },
  seek() {
  },
  seekSync() {
  },
  connect() {
  },
  listen() {
  },
  loadavg() {
  },
  connectTls() {
  },
  listenTls() {
  },
  startTls() {
  },
  shutdown() {
  },
  fstatSync() {
  },
  fstat() {
  },
  fsyncSync() {
  },
  fsync() {
  },
  fdatasyncSync() {
  },
  fdatasync() {
  },
  symlink() {
  },
  symlinkSync() {
  },
  link() {
  },
  linkSync() {
  },
  Permissions() {
  },
  PermissionStatus() {
  },
  serveHttp() {
  },
  serve() {
  },
  resolveDns() {
  },
  upgradeWebSocket() {
  },
  utime() {
  },
  utimeSync() {
  },
  kill() {
  },
  addSignalListener() {
  },
  removeSignalListener() {
  },
  refTimer() {
  },
  unrefTimer() {
  },
  osRelease() {
    return "fake";
  },
  osUptime() {
  },
  hostname() {
    return "fake";
  },
  systemMemoryInfo() {
    return {
      total: 17179869184,
      free: 77104,
      available: 3279456,
      buffers: 0,
      cached: 0,
      swapTotal: 18253611008,
      swapFree: 878313472
    };
  },
  networkInterfaces() {
    return [];
  },
  consoleSize() {
    return { columns: 120, rows: 20 };
  },
  gid() {
    return 20;
  },
  uid() {
    return 501;
  },
  Command() {
  },
  ChildProcess() {
  },
  test() {
  },
  bench() {
  }
};
var internal = Deno2.internal;
var resources = Deno2.resources;
var close = Deno2.close;
var metrics = Deno2.metrics;
var Process = Deno2.Process;
var run = Deno2.run;
var isatty = Deno2.isatty;
var writeFileSync = Deno2.writeFileSync;
var writeFile = Deno2.writeFile;
var writeTextFileSync = Deno2.writeTextFileSync;
var writeTextFile = Deno2.writeTextFile;
var readTextFile = Deno2.readTextFile;
var readTextFileSync = Deno2.readTextFileSync;
var readFile = Deno2.readFile;
var readFileSync = Deno2.readFileSync;
var watchFs = Deno2.watchFs;
var chmodSync = Deno2.chmodSync;
var chmod = Deno2.chmod;
var chown = Deno2.chown;
var chownSync = Deno2.chownSync;
var copyFileSync2 = Deno2.copyFileSync;
var cwd = Deno2.cwd;
var makeTempDirSync = Deno2.makeTempDirSync;
var makeTempDir = Deno2.makeTempDir;
var makeTempFileSync = Deno2.makeTempFileSync;
var makeTempFile = Deno2.makeTempFile;
var memoryUsage = Deno2.memoryUsage;
var mkdirSync = Deno2.mkdirSync;
var mkdir = Deno2.mkdir;
var chdir = Deno2.chdir;
var copyFile2 = Deno2.copyFile;
var readDirSync = Deno2.readDirSync;
var readDir = Deno2.readDir;
var readLinkSync = Deno2.readLinkSync;
var readLink = Deno2.readLink;
var realPathSync = Deno2.realPathSync;
var realPath = Deno2.realPath;
var removeSync = Deno2.removeSync;
var remove = Deno2.remove;
var renameSync = Deno2.renameSync;
var rename = Deno2.rename;
var version = Deno2.version;
var build = Deno2.build;
var statSync = Deno2.statSync;
var lstatSync = Deno2.lstatSync;
var stat = Deno2.stat;
var lstat = Deno2.lstat;
var truncateSync = Deno2.truncateSync;
var truncate = Deno2.truncate;
var ftruncateSync = Deno2.ftruncateSync;
var ftruncate = Deno2.ftruncate;
var futime = Deno2.futime;
var futimeSync = Deno2.futimeSync;
var errors = Deno2.errors;
var inspect = Deno2.inspect;
var env = Deno2.env;
var exit = Deno2.exit;
var execPath = Deno2.execPath;
var Buffer2 = Deno2.Buffer;
var readAll = Deno2.readAll;
var readAllSync = Deno2.readAllSync;
var writeAll = Deno2.writeAll;
var writeAllSync = Deno2.writeAllSync;
var copy3 = Deno2.copy;
var iter2 = Deno2.iter;
var iterSync = Deno2.iterSync;
var SeekMode = Deno2.SeekMode;
var read = Deno2.read;
var readSync = Deno2.readSync;
var write = Deno2.write;
var writeSync = Deno2.writeSync;
var File = Deno2.File;
var FsFile = Deno2.FsFile;
var open = Deno2.open;
var openSync = Deno2.openSync;
var create = Deno2.create;
var createSync = Deno2.createSync;
var stdin = Deno2.stdin;
var stdout = Deno2.stdout;
var stderr = Deno2.stderr;
var seek = Deno2.seek;
var seekSync = Deno2.seekSync;
var connect = Deno2.connect;
var listen = Deno2.listen;
var loadavg = Deno2.loadavg;
var connectTls = Deno2.connectTls;
var listenTls = Deno2.listenTls;
var startTls = Deno2.startTls;
var shutdown = Deno2.shutdown;
var fstatSync = Deno2.fstatSync;
var fstat = Deno2.fstat;
var fsyncSync = Deno2.fsyncSync;
var fsync = Deno2.fsync;
var fdatasyncSync = Deno2.fdatasyncSync;
var fdatasync = Deno2.fdatasync;
var symlink = Deno2.symlink;
var symlinkSync = Deno2.symlinkSync;
var link = Deno2.link;
var linkSync = Deno2.linkSync;
var permissions = Deno2.permissions;
var serveHttp = Deno2.serveHttp;
var serve = Deno2.serve;
var resolveDns = Deno2.resolveDns;
var upgradeWebSocket = Deno2.upgradeWebSocket;
var utime2 = Deno2.utime;
var utimeSync2 = Deno2.utimeSync;
var kill = Deno2.kill;
var addSignalListener = Deno2.addSignalListener;
var removeSignalListener = Deno2.removeSignalListener;
var refTimer = Deno2.refTimer;
var unrefTimer = Deno2.unrefTimer;
var osRelease = Deno2.osRelease;
var osUptime = Deno2.osUptime;
var hostname = Deno2.hostname;
var systemMemoryInfo = Deno2.systemMemoryInfo;
var networkInterfaces = Deno2.networkInterfaces;
var consoleSize = Deno2.consoleSize;
var gid = Deno2.gid;
var uid = Deno2.uid;
var Command = Deno2.Command;
var ChildProcess = Deno2.ChildProcess;
var test = Deno2.test;
var bench = Deno2.bench;
var pid = Deno2.pid;
var ppid = Deno2.ppid;
var noColor = Deno2.noColor;
var args = Deno2.args;
var mainModule = Deno2.mainModule;
try {
  globalThis.Deno = Deno2;
} catch (error) {
}
var DenoPermissions = Deno2.Permissions;
var DenoPermissionStatus = Deno2.PermissionStatus;

// https://deno.land/x/quickr@0.6.67/main/flat/make_absolute_path.js
var makeAbsolutePath = (path7) => {
  if (!isAbsolute3(path7)) {
    return normalize4(join4(cwd(), path7));
  } else {
    return normalize4(path7);
  }
};

// https://deno.land/x/quickr@0.6.67/main/flat/normalize_path.js
var normalizePath = (path7) => normalize4(pathStandardize(path7)).replace(/\/$/, "");

// https://deno.land/x/quickr@0.6.67/main/flat/path.js
var Deno3 = { lstatSync, statSync, readLinkSync };
var PathTools = { parse: parse3, basename: basename3, dirname: dirname3, relative: relative3, isAbsolute: isAbsolute3 };
var Path = class {
  constructor({ path: path7, _lstatData, _statData }) {
    this.path = path7;
    this._lstat = _lstatData;
    this._data = _statData;
  }
  // 
  // core data sources
  // 
  refresh() {
    this._lstat = null;
    this._data = null;
  }
  get lstat() {
    if (!this._lstat) {
      try {
        this._lstat = Deno3.lstatSync(this.path);
      } catch (error) {
        this._lstat = { doesntExist: true };
      }
    }
    return this._lstat;
  }
  get stat() {
    if (!this._stat) {
      const lstat2 = this.lstat;
      if (!lstat2.isSymlink) {
        this._stat = {
          isBrokenLink: false,
          isLoopOfLinks: false
        };
      } else {
        try {
          this._stat = Deno3.statSync(this.path);
        } catch (error) {
          this._stat = {};
          if (error.message.match(/^Too many levels of symbolic links/)) {
            this._stat.isBrokenLink = true;
            this._stat.isLoopOfLinks = true;
          } else if (error.message.match(/^No such file or directory/)) {
            this._stat.isBrokenLink = true;
          } else {
            throw error;
          }
        }
      }
    }
    return this._stat;
  }
  // 
  // main attributes
  // 
  get exists() {
    const lstat2 = this.lstat;
    return !lstat2.doesntExist;
  }
  get name() {
    return PathTools.parse(this.path).name;
  }
  get extension() {
    return PathTools.parse(this.path).ext;
  }
  get basename() {
    return this.path && PathTools.basename(this.path);
  }
  get parentPath() {
    return this.path && PathTools.dirname(this.path);
  }
  relativePathFrom(parentPath) {
    return PathTools.relative(parentPath, this.path);
  }
  get link() {
    const lstat2 = this.lstat;
    if (lstat2.isSymlink) {
      return Deno3.readLinkSync(this.path);
    } else {
      return null;
    }
  }
  get isSymlink() {
    const lstat2 = this.lstat;
    return !!lstat2.isSymlink;
  }
  get isRelativeSymlink() {
    const lstat2 = this.lstat;
    const isNotSymlink = !lstat2.isSymlink;
    if (isNotSymlink) {
      return false;
    }
    const relativeOrAbsolutePath = Deno3.readLinkSync(this.path);
    return !PathTools.isAbsolute(relativeOrAbsolutePath);
  }
  get isAbsoluteSymlink() {
    const lstat2 = this.lstat;
    const isNotSymlink = !lstat2.isSymlink;
    if (isNotSymlink) {
      return false;
    }
    const relativeOrAbsolutePath = Deno3.readLinkSync(this.path);
    return PathTools.isAbsolute(relativeOrAbsolutePath);
  }
  get isBrokenLink() {
    const stat2 = this.stat;
    return !!stat2.isBrokenLink;
  }
  get isLoopOfLinks() {
    const stat2 = this.stat;
    return !!stat2.isLoopOfLinks;
  }
  get isFile() {
    const lstat2 = this.lstat;
    if (lstat2.doesntExist) {
      return false;
    }
    if (!lstat2.isSymlink) {
      return lstat2.isFile;
    } else {
      return !!this.stat.isFile;
    }
  }
  get isFolder() {
    const lstat2 = this.lstat;
    if (lstat2.doesntExist) {
      return false;
    }
    if (!lstat2.isSymlink) {
      return lstat2.isDirectory;
    } else {
      return !!this.stat.isDirectory;
    }
  }
  get sizeInBytes() {
    const lstat2 = this.lstat;
    return lstat2.size;
  }
  get permissions() {
    const { mode } = this.lstat;
    return {
      owner: {
        //          rwxrwxrwx
        canRead: !!(256 & mode),
        canWrite: !!(128 & mode),
        canExecute: !!(64 & mode)
      },
      group: {
        canRead: !!(32 & mode),
        canWrite: !!(16 & mode),
        canExecute: !!(8 & mode)
      },
      others: {
        canRead: !!(4 & mode),
        canWrite: !!(2 & mode),
        canExecute: !!(1 & mode)
      }
    };
  }
  // aliases
  get isDirectory() {
    return this.isFolder;
  }
  get dirname() {
    return this.parentPath;
  }
  toJSON() {
    return {
      exists: this.exists,
      name: this.name,
      extension: this.extension,
      basename: this.basename,
      parentPath: this.parentPath,
      isSymlink: this.isSymlink,
      isBrokenLink: this.isBrokenLink,
      isLoopOfLinks: this.isLoopOfLinks,
      isFile: this.isFile,
      isFolder: this.isFolder,
      sizeInBytes: this.sizeInBytes,
      permissions: this.permissions,
      isDirectory: this.isDirectory,
      dirname: this.dirname
    };
  }
};

// https://deno.land/x/quickr@0.6.67/main/file_system.js
var cache = {};
function setTrueBit(n, bit) {
  return n | 1 << bit;
}
function setFalseBit(n, bit) {
  return ~(~n | 1 << bit);
}
var defaultOptionsHelper = (options) => ({
  renameExtension: options.renameExtension || FileSystem.defaultRenameExtension,
  overwrite: options.overwrite
});
var fileLockSymbol = Symbol.for("fileLock");
var locker = globalThis[fileLockSymbol] || {};
var grabPathLock = async (path7) => {
  while (locker[path7]) {
    await new Promise((resolve9) => setTimeout(resolve9, 70));
  }
  locker[path7] = true;
};
var FileSystem = {
  defaultRenameExtension: ".old",
  denoExecutablePath: Deno.execPath(),
  parentPath: dirname3,
  dirname: dirname3,
  basename: basename3,
  extname: extname3,
  join: join4,
  normalize: normalizePath,
  normalizePath,
  isAbsolutePath: isAbsolute3,
  isRelativePath: (...args2) => !isAbsolute3(...args2),
  makeRelativePath: ({ from, to }) => relative3(from.path || from, to.path || to),
  makeAbsolutePath,
  pathDepth(path7) {
    path7 = FileSystem.normalizePath(path7);
    let count = 0;
    for (const eachChar of path7.path || path7) {
      if (eachChar == "/") {
        count++;
      }
    }
    if (path7[0] == "/") {
      count--;
    }
    return count + 1;
  },
  pathPieces(path7) {
    path7 = path7.path || path7;
    const result = parse3(path7);
    const folderList = [];
    let dirname9 = result.dir;
    while (true) {
      folderList.push(basename3(dirname9));
      if (dirname9 == dirname3(dirname9)) {
        break;
      }
      dirname9 = dirname3(dirname9);
    }
    folderList.reverse();
    return [folderList, result.name, result.ext];
  },
  /**
   * add to name, preserve file extension
   *
   * @example
   * ```js
   * let newName = FileSystem.extendName({ path: "a/blah.thing.js", string: ".old" })
   * newName == "a/blah.old.thing.js"
   * ```
   *
   * @param arg1.path - item path
   * @param arg1.string - the string to append to the name
   * @return {string} - the new path
   */
  extendName({ path: path7, string }) {
    path7 = pathStandardize(path7);
    const [name, ...extensions] = basename3(path7).split(".");
    return `${dirname3(path7)}/${name}${string}${extensions.length == 0 ? "" : `.${extensions.join(".")}`}`;
  },
  /**
   * All Parent Paths
   *
   * @param {String} path - path doesnt need to exist
   * @return {[String]} longest to shortest parent path
   */
  allParentPaths(path7) {
    const pathStartsWithDotSlash = path7.startsWith("./");
    path7 = FileSystem.normalizePath(path7);
    if (path7 === ".") {
      return [];
    }
    const dotGotRemoved = pathStartsWithDotSlash && !path7.startsWith("./");
    let previousPath = null;
    let allPaths = [];
    while (1) {
      previousPath = path7;
      path7 = FileSystem.parentPath(path7);
      if (previousPath === path7) {
        break;
      }
      allPaths.push(path7);
    }
    allPaths.reverse();
    allPaths = allPaths.filter((each2) => each2 != ".");
    if (dotGotRemoved) {
      allPaths.push(".");
    }
    return allPaths;
  },
  pathOfCaller(callerNumber = void 0) {
    const err = new Error();
    let filePaths = findAll(/^.+file:\/\/(\/[\w\W]*?):/gm, err.stack).map((each2) => each2[1]);
    if (callerNumber) {
      filePaths = filePaths.slice(callerNumber);
    }
    try {
      const secondPath = filePaths[1];
      if (secondPath) {
        try {
          if (Deno.statSync(secondPath).isFile) {
            return secondPath;
          }
        } catch (error) {
        }
      }
    } catch (error) {
    }
    return Deno.cwd();
  },
  get home() {
    if (!cache.home) {
      if (Deno.build.os != "windows") {
        cache.home = Deno.env.get("HOME");
      } else {
        cache.home = Deno.env.get("HOMEPATH");
      }
    }
    return cache.home;
  },
  get workingDirectory() {
    return Deno.cwd();
  },
  set workingDirectory(value) {
    Deno.chdir(value);
  },
  get cwd() {
    return FileSystem.workingDirectory;
  },
  set cwd(value) {
    return FileSystem.workingDirectory = value;
  },
  get pwd() {
    return FileSystem.cwd;
  },
  set pwd(value) {
    return FileSystem.cwd = value;
  },
  cd(path7) {
    Deno.chdir(path7);
  },
  changeDirectory(path7) {
    Deno.chdir(path7);
  },
  get thisFile() {
    const err = new Error();
    const filePaths = findAll(/^.+file:\/\/(\/[\w\W]*?):/gm, err.stack).map((each2) => each2[1]);
    const firstPath = filePaths[0];
    if (firstPath) {
      try {
        if (Deno.statSync(firstPath).isFile) {
          return firstPath;
        }
      } catch (error) {
      }
    }
    return ":<interpreter>:";
  },
  get thisFolder() {
    const err = new Error();
    const filePaths = findAll(/^.+file:\/\/(\/[\w\W]*?):/gm, err.stack).map((each2) => each2[1]);
    const firstPath = filePaths[0];
    if (firstPath) {
      try {
        if (Deno.statSync(firstPath).isFile) {
          return dirname3(firstPath);
        }
      } catch (error) {
      }
    }
    return Deno.cwd();
  },
  async read(path7) {
    path7 = pathStandardize(path7);
    await grabPathLock(path7);
    let output2;
    try {
      output2 = await Deno.readTextFile(path7);
    } catch (error) {
    }
    delete locker[path7];
    return output2;
  },
  async readBytes(path7) {
    path7 = pathStandardize(path7);
    await grabPathLock(path7);
    let output2;
    try {
      output2 = await Deno.readFile(path7);
    } catch (error) {
    }
    delete locker[path7];
    return output2;
  },
  async *readLinesIteratively(path7) {
    path7 = pathStandardize(path7);
    await grabPathLock(path7);
    try {
      const file = await Deno.open(path7);
      try {
        yield* readLines(file);
      } finally {
        Deno.close(file.rid);
      }
    } finally {
      delete locker[path7];
    }
  },
  async info(fileOrFolderPath, _cachedLstat = null) {
    fileOrFolderPath = pathStandardize(fileOrFolderPath);
    await grabPathLock(fileOrFolderPath);
    try {
      const lstat2 = _cachedLstat || await Deno.lstat(fileOrFolderPath).catch(() => ({ doesntExist: true }));
      let stat2 = {};
      if (!lstat2.isSymlink) {
        stat2 = {
          isBrokenLink: false,
          isLoopOfLinks: false
        };
      } else {
        try {
          stat2 = await Deno.stat(fileOrFolderPath);
        } catch (error) {
          if (error.message.match(/^Too many levels of symbolic links/)) {
            stat2.isBrokenLink = true;
            stat2.isLoopOfLinks = true;
          } else if (error.message.match(/^No such file or directory/)) {
            stat2.isBrokenLink = true;
          } else {
            if (!error.message.match(/^PermissionDenied:/)) {
              return { doesntExist: true, permissionDenied: true };
            }
            throw error;
          }
        }
      }
      return new Path({ path: fileOrFolderPath, _lstatData: lstat2, _statData: stat2 });
    } finally {
      delete locker[fileOrFolderPath];
    }
  },
  async move({ path: path7, item, newParentFolder, newName, force = true, overwrite = false, renameExtension = null }) {
    item = item || path7;
    const oldPath = item.path || item;
    const oldName = FileSystem.basename(oldPath);
    const pathInfo = item instanceof Object || FileSystem.sync.info(oldPath);
    const newPath = `${newParentFolder || FileSystem.parentPath(oldPath)}/${newName || oldName}`;
    if (pathInfo.isSymlink && !item.isBrokenLink) {
      const link2 = Deno.readLinkSync(pathInfo.path);
      if (!isAbsolute3(link2)) {
        const linkTargetBeforeMove = `${FileSystem.parentPath(pathInfo.path)}/${link2}`;
        await FileSystem.relativeLink({
          existingItem: linkTargetBeforeMove,
          newItem: newPath,
          force,
          overwrite,
          renameExtension
        });
        await FileSystem.remove(pathInfo);
      }
    }
    if (force) {
      FileSystem.sync.clearAPathFor(newPath, { overwrite, renameExtension });
    }
    await move(oldPath, newPath);
  },
  async rename({ from, to, force = true, overwrite = false, renameExtension = null }) {
    return FileSystem.move({ path: from, newParentFolder: FileSystem.parentPath(to), newName: FileSystem.basename(to), force, overwrite, renameExtension });
  },
  async remove(fileOrFolder) {
    fileOrFolder = pathStandardize(fileOrFolder);
    if (fileOrFolder instanceof Array) {
      return Promise.all(fileOrFolder.map(FileSystem.remove));
    }
    fileOrFolder = fileOrFolder.path || fileOrFolder;
    const pathInfo = await FileSystem.info(fileOrFolder);
    if (pathInfo.isFile || pathInfo.isSymlink) {
      return Deno.remove(pathInfo.path.replace(/\/+$/, ""));
    } else if (pathInfo.exists) {
      return Deno.remove(pathInfo.path.replace(/\/+$/, ""), { recursive: true });
    }
  },
  async finalTargetOf(path7, options = {}) {
    const { _parentsHaveBeenChecked, cache: cache2 } = { _parentsHaveBeenChecked: false, cache: {}, ...options };
    const originalWasItem = path7 instanceof Path;
    path7 = path7.path || path7;
    let result = await Deno.lstat(path7).catch(() => ({ doesntExist: true }));
    if (result.doesntExist) {
      return null;
    }
    path7 = await FileSystem.makeHardPathTo(path7, { cache: cache2 });
    const pathChain = [];
    while (result.isSymlink) {
      const relativeOrAbsolutePath = await Deno.readLink(path7);
      if (isAbsolute3(relativeOrAbsolutePath)) {
        path7 = relativeOrAbsolutePath;
      } else {
        path7 = `${FileSystem.parentPath(path7)}/${relativeOrAbsolutePath}`;
      }
      result = await Deno.lstat(path7).catch(() => ({ doesntExist: true }));
      if (result.doesntExist) {
        return null;
      }
      path7 = await FileSystem.makeHardPathTo(path7, { cache: cache2 });
      if (pathChain.includes(path7)) {
        return null;
      }
      pathChain.push(path7);
    }
    path7 = FileSystem.normalizePath(path7);
    if (originalWasItem) {
      return new Path({ path: path7 });
    } else {
      return path7;
    }
  },
  async nextTargetOf(path7, options = {}) {
    const originalWasItem = path7 instanceof Path;
    const item = originalWasItem ? path7 : new Path({ path: path7 });
    const lstat2 = item.lstat;
    if (lstat2.isSymlink) {
      const relativeOrAbsolutePath = Deno.readLinkSync(item.path);
      if (isAbsolute3(relativeOrAbsolutePath)) {
        if (originalWasItem) {
          return new Path({ path: relativeOrAbsolutePath });
        } else {
          return relativeOrAbsolutePath;
        }
      } else {
        const path8 = `${await FileSystem.makeHardPathTo(dirname3(item.path))}/${relativeOrAbsolutePath}`;
        if (originalWasItem) {
          return new Path({ path: path8 });
        } else {
          return path8;
        }
      }
    } else {
      if (originalWasItem) {
        return item;
      } else {
        return item.path;
      }
    }
  },
  async ensureIsFile(path7, options = { overwrite: false, renameExtension: null }) {
    const { overwrite, renameExtension } = defaultOptionsHelper(options);
    await FileSystem.ensureIsFolder(FileSystem.parentPath(path7), { overwrite, renameExtension });
    path7 = path7.path || path7;
    const pathInfo = await FileSystem.info(path7);
    if (pathInfo.isFile && !pathInfo.isDirectory) {
      return path7;
    } else {
      await FileSystem.write({ path: path7, data: "" });
      return path7;
    }
  },
  async ensureIsFolder(path7, options = { overwrite: false, renameExtension: null }) {
    const { overwrite, renameExtension } = defaultOptionsHelper(options);
    path7 = path7.path || path7;
    path7 = FileSystem.makeAbsolutePath(path7);
    const parentPath = dirname3(path7);
    if (parentPath == path7) {
      return;
    }
    const parent = await FileSystem.info(parentPath);
    if (!parent.isDirectory) {
      FileSystem.sync.ensureIsFolder(parentPath, { overwrite, renameExtension });
    }
    let pathInfo = FileSystem.sync.info(path7);
    if (pathInfo.exists && !pathInfo.isDirectory) {
      if (overwrite) {
        await FileSystem.remove(path7);
      } else {
        await FileSystem.moveOutOfTheWay(eachPath, { extension: renameExtension });
      }
    }
    await Deno.mkdir(path7, { recursive: true });
    return path7;
  },
  /**
   * Move/Remove everything and Ensure parent folders
   *
   * @param path
   * @param options.overwrite - if false, then things in the way will be moved instead of deleted
   * @param options.renameExtension - the string to append when renaming files to get them out of the way
   * 
   * @note
   *     very agressive: will change whatever is necessary to make sure a parent exists
   * 
   * @example
   * ```js
   * await FileSystem.clearAPathFor("./something")
   * ```
   */
  async clearAPathFor(path7, options = { overwrite: false, renameExtension: null }) {
    const { overwrite, renameExtension } = defaultOptionsHelper(options);
    const originalPath = path7;
    const paths = [];
    while (dirname3(path7) !== path7) {
      paths.push(path7);
      path7 = dirname3(path7);
    }
    for (const eachPath2 of paths.reverse()) {
      const info = await FileSystem.info(eachPath2);
      if (!info.exists) {
        break;
      } else if (info.isFile) {
        if (overwrite) {
          await FileSystem.remove(eachPath2);
        } else {
          await FileSystem.moveOutOfTheWay(eachPath2, { extension: renameExtension });
        }
      }
    }
    await Deno.mkdir(dirname3(originalPath), { recursive: true });
    return originalPath;
  },
  async moveOutOfTheWay(path7, options = { extension: null }) {
    const extension = options?.extension || FileSystem.defaultRenameExtension;
    const info = await FileSystem.info(path7);
    if (info.exists) {
      const newPath = path7 + extension;
      await FileSystem.moveOutOfTheWay(newPath, { extension });
      await move(path7, newPath);
    }
  },
  /**
   * find a root folder based on a child path
   *
   * @example
   * ```js
   *     import { FileSystem } from "https://deno.land/x/quickr/main/file_system.js"
   * 
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil(".git")
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil({
   *         subPath:".git",
   *         startPath: FileSystem.pwd,
   *     })
   *
   *     // below will result in that^ same folder (assuming all your .git folders have config files)
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil(".git/config")
   * 
   *     // below will result in the same folder, but only if theres a local master branch
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil(".git/refs/heads/master")
   *```
   */
  async walkUpUntil(subPath, startPath = null) {
    subPath = subPath instanceof Path ? subPath.path : subPath;
    if (subPath instanceof Object) {
      var { subPath, startPath } = subPath;
    }
    let here;
    if (!startPath) {
      here = Deno.cwd();
    } else if (isAbsolute3(startPath)) {
      here = startPath;
    } else {
      here = join4(here, startPath);
    }
    while (1) {
      let checkPath = join4(here, subPath);
      const pathInfo = await Deno.lstat(checkPath).catch(() => ({ doesntExist: true }));
      if (!pathInfo.doesntExist) {
        return here;
      }
      if (here == dirname3(here)) {
        return null;
      } else {
        here = dirname3(here);
      }
    }
  },
  async copy({ from, to, preserveTimestamps = true, force = true, overwrite = false, renameExtension = null }) {
    const existingItemDoesntExist = (await Deno.stat(from).catch(() => ({ doesntExist: true }))).doesntExist;
    if (existingItemDoesntExist) {
      throw Error(`
Tried to copy from:${from}, to:${to}
but "from" didn't seem to exist

`);
    }
    if (force) {
      FileSystem.sync.clearAPathFor(to, { overwrite, renameExtension });
    }
    return copy(from, to, { force, preserveTimestamps: true });
  },
  async relativeLink({ existingItem, newItem, force = true, overwrite = false, allowNonExistingTarget = false, renameExtension = null }) {
    const existingItemPath = (existingItem.path || existingItem).replace(/\/+$/, "");
    const newItemPath = FileSystem.normalizePath((newItem.path || newItem).replace(/\/+$/, ""));
    const existingItemDoesntExist = (await Deno.lstat(existingItemPath).catch(() => ({ doesntExist: true }))).doesntExist;
    if (!allowNonExistingTarget && existingItemDoesntExist) {
      throw Error(`
Tried to create a relativeLink between existingItem:${existingItemPath}, newItem:${newItemPath}
but existingItem didn't actually exist`);
    } else {
      const parentOfNewItem = FileSystem.parentPath(newItemPath);
      await FileSystem.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
      const hardPathToNewItem = `${await FileSystem.makeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
      const hardPathToExistingItem = await FileSystem.makeHardPathTo(existingItemPath);
      const pathFromNewToExisting = relative3(hardPathToNewItem, hardPathToExistingItem).replace(/^\.\.\//, "");
      if (force) {
        FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
      }
      return Deno.symlink(
        pathFromNewToExisting,
        hardPathToNewItem
      );
    }
  },
  async absoluteLink({ existingItem, newItem, force = true, allowNonExistingTarget = false, overwrite = false, renameExtension = null }) {
    existingItem = (existingItem.path || existingItem).replace(/\/+$/, "");
    const newItemPath = FileSystem.normalizePath(newItem.path || newItem).replace(/\/+$/, "");
    const existingItemDoesntExist = (await Deno.lstat(existingItem).catch(() => ({ doesntExist: true }))).doesntExist;
    if (!allowNonExistingTarget && existingItemDoesntExist) {
      throw Error(`
Tried to create a relativeLink between existingItem:${existingItem}, newItemPath:${newItemPath}
but existingItem didn't actually exist`);
    } else {
      const parentOfNewItem = FileSystem.parentPath(newItemPath);
      await FileSystem.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
      const hardPathToNewItem = `${await FileSystem.makeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
      if (force) {
        FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
      }
      return Deno.symlink(
        FileSystem.makeAbsolutePath(existingItem),
        newItemPath
      );
    }
  },
  async hardLink({ existingItem, newItem, force = true, overwrite = false, renameExtension = null, hardLink = false }) {
    existingItem = (existingItem.path || existingItem).replace(/\/+$/, "");
    const newItemPath = FileSystem.normalizePath(newItem.path || newItem).replace(/\/+$/, "");
    const existingItemDoesntExist = (await Deno.lstat(existingItem).catch(() => ({ doesntExist: true }))).doesntExist;
    if (existingItemDoesntExist) {
      throw Error(`
Tried to create a relativeLink between existingItem:${existingItem}, newItemPath:${newItemPath}
but existingItem didn't actually exist`);
    } else {
      const parentOfNewItem = FileSystem.parentPath(newItemPath);
      await FileSystem.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
      if (force) {
        FileSystem.sync.clearAPathFor(newItem, { overwrite, renameExtension });
      }
      return Deno.link(
        FileSystem.makeAbsolutePath(existingItem),
        newItemPath
      );
    }
  },
  async *iterateBasenamesIn(pathOrFileInfo) {
    const info = pathOrFileInfo instanceof Path ? pathOrFileInfo : await FileSystem.info(pathOrFileInfo);
    if (info.isFolder) {
      for await (const dirEntry of Deno.readDir(info.path)) {
        yield dirEntry.name;
      }
    }
  },
  listBasenamesIn(pathOrFileInfo) {
    return asyncIteratorToList(FileSystem.iterateBasenamesIn(pathOrFileInfo));
  },
  async *iteratePathsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity, dontFollowSymlinks: false, dontReturnSymlinks: false, maxDepthFromRoot: null }) {
    let info;
    try {
      info = pathOrFileInfo instanceof Path ? pathOrFileInfo : await FileSystem.info(pathOrFileInfo);
    } catch (error) {
      if (!error.message.match(/^PermissionDenied:/)) {
        throw error;
      }
    }
    const path7 = info.path;
    const startingDepth = FileSystem.makeAbsolutePath(path7).split("/").length - 1;
    options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
    if (options.maxDepthFromRoot == null) {
      options.maxDepthFromRoot = Infinity;
    }
    if (options.maxDepth != Infinity && options.maxDepth != null) {
      options.maxDepthFromRoot = startingDepth + options.maxDepth;
    }
    options.maxDepth = null;
    if (startingDepth < options.maxDepthFromRoot) {
      if (!options.recursively) {
        if (info.isFolder) {
          if (!options.shouldntInclude) {
            for await (const each2 of Deno.readDir(path7)) {
              if (options.dontReturnSymlinks && each2.isSymlink) {
                continue;
              }
              yield join4(path7, each2.name);
            }
          } else {
            const shouldntInclude = options.shouldntInclude;
            for await (const each2 of Deno.readDir(path7)) {
              const eachPath2 = join4(path7, each2.name);
              if (options.dontReturnSymlinks && each2.isSymlink) {
                continue;
              }
              const shouldntIncludeThis = shouldntInclude && await shouldntInclude(eachPath2);
              if (!shouldntIncludeThis) {
                yield eachPath2;
              }
            }
          }
        }
      } else {
        options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
        options.searchOrder = options.searchOrder || "breadthFirstSearch";
        const { shouldntExplore, shouldntInclude } = options;
        if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
          throw Error(`when calling FileSystem.iterateItemsIn('${path7}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
        }
        const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
        const shouldntExploreThis = shouldntExplore && await shouldntExplore(info.path, info);
        if (!shouldntExploreThis && info.isFolder) {
          options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
          if (!options.exclude.has(path7)) {
            const followSymlinks = !options.dontFollowSymlinks;
            const absolutePathVersion = FileSystem.makeAbsolutePath(path7);
            options.exclude.add(absolutePathVersion);
            const searchAfterwords = [];
            for await (const entry of Deno.readDir(path7)) {
              const eachPath2 = join4(path7, entry.name);
              if (options.dontReturnSymlinks && each.isSymlink) {
                continue;
              }
              const shouldntIncludeThis = shouldntInclude && await shouldntInclude(eachPath2);
              if (!shouldntIncludeThis) {
                yield eachPath2;
              }
              if (entry.isFile) {
                continue;
              }
              if (followSymlinks && !entry.isDirectory) {
                let isSymlinkToDirectory = false;
                try {
                  isSymlinkToDirectory = (await Deno.stat(eachPath2)).isDirectory;
                } catch (error) {
                }
                if (!isSymlinkToDirectory) {
                  continue;
                }
              }
              if (useBreadthFirstSearch) {
                searchAfterwords.push(eachPath2);
              } else {
                for await (const eachSubPath of FileSystem.iteratePathsIn(eachPath2, options)) {
                  yield eachSubPath;
                }
              }
            }
            options.recursively = false;
            while (searchAfterwords.length > 0) {
              const next = searchAfterwords.shift();
              for await (const eachSubPath of FileSystem.iteratePathsIn(next, options)) {
                yield eachSubPath;
                searchAfterwords.push(eachSubPath);
              }
            }
          }
        }
      }
    }
  },
  listPathsIn(pathOrFileInfo, options) {
    return asyncIteratorToList(FileSystem.iteratePathsIn(pathOrFileInfo, options));
  },
  async *iterateItemsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity }) {
    options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
    options.searchOrder = options.searchOrder || "breadthFirstSearch";
    options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
    const { shouldntExplore, shouldntInclude } = options;
    const info = pathOrFileInfo instanceof Path ? pathOrFileInfo : await FileSystem.info(pathOrFileInfo);
    const path7 = info.path;
    if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
      throw Error(`when calling FileSystem.iterateItemsIn('${path7}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
    }
    const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
    const shouldntExploreThis = shouldntExplore && await shouldntExplore(info);
    if (!shouldntExploreThis && options.maxDepth > 0 && info.isFolder) {
      options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
      if (!options.exclude.has(path7)) {
        const absolutePathVersion = FileSystem.makeAbsolutePath(path7);
        options.exclude.add(absolutePathVersion);
        options.maxDepth -= 1;
        const searchAfterwords = [];
        for await (const entry of Deno.readDir(path7)) {
          const eachItem = await FileSystem.info(join4(path7, entry.name));
          const shouldntIncludeThis = shouldntInclude && await shouldntInclude(eachItem);
          if (!shouldntIncludeThis) {
            yield eachItem;
          }
          if (options.recursively) {
            if (eachItem.isFolder) {
              if (useBreadthFirstSearch) {
                searchAfterwords.push(eachItem);
              } else {
                for await (const eachSubPath of FileSystem.iterateItemsIn(eachItem, options)) {
                  yield eachSubPath;
                }
              }
            }
          }
        }
        options.recursively = false;
        while (searchAfterwords.length > 0) {
          const next = searchAfterwords.shift();
          for await (const eachSubItem of FileSystem.iterateItemsIn(next, options)) {
            yield eachSubItem;
            if (eachSubItem.isFolder) {
              searchAfterwords.push(eachSubItem);
            }
          }
        }
      }
    }
  },
  async listItemsIn(pathOrFileInfo, options) {
    const outputPromises = [];
    for await (const eachPath2 of FileSystem.iteratePathsIn(pathOrFileInfo, options)) {
      outputPromises.push(FileSystem.info(eachPath2));
    }
    return Promise.all(outputPromises);
  },
  // includes symlinks if they link to files and pipes
  async listFileItemsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
    const { treatAllSymlinksAsFiles } = { treatAllSymlinksAsFiles: false, ...options };
    const items = await FileSystem.listItemsIn(pathOrFileInfo, options);
    if (treatAllSymlinksAsFiles) {
      return items.filter((eachItem) => eachItem.isFile || treatAllSymlinksAsFiles && eachItem.isSymlink);
    } else {
      return items.filter((eachItem) => eachItem.isFile);
    }
  },
  async listFilePathsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
    return (await FileSystem.listFileItemsIn(pathOrFileInfo, options)).map((each2) => each2.path);
  },
  async listFileBasenamesIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
    return (await FileSystem.listFileItemsIn(pathOrFileInfo, options)).map((each2) => each2.basename);
  },
  async listFolderItemsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
    const { ignoreSymlinks } = { ignoreSymlinks: false, ...options };
    const items = await FileSystem.listItemsIn(pathOrFileInfo, options);
    if (ignoreSymlinks) {
      return items.filter((eachItem) => eachItem.isFolder && !eachItem.isSymlink);
    } else {
      return items.filter((eachItem) => eachItem.isFolder);
    }
  },
  async listFolderPathsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
    return (await FileSystem.listFolderItemsIn(pathOrFileInfo, options)).map((each2) => each2.path);
  },
  async listFolderBasenamesIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
    return (await FileSystem.listFolderItemsIn(pathOrFileInfo, options)).map((each2) => each2.basename);
  },
  recursivelyIterateItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    options.recursively = true;
    if (options.onlyHardlinks) {
      if (options.shouldntInclude) {
        const originalshouldntInclude = options.shouldntInclude;
        options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
      } else {
        options.shouldntInclude = (each2) => each2.isSymlink;
      }
    }
    if (options.dontFollowSymlinks) {
      if (options.shouldntExplore) {
        const originalShouldntExplore = options.shouldntInclude;
        options.shouldntExplore = (each2) => each2.isSymlink || originalShouldntExplore(each2);
      } else {
        options.shouldntExplore = (each2) => each2.isSymlink;
      }
    }
    return FileSystem.iterateItemsIn(pathOrFileInfo, options);
  },
  recursivelyIteratePathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    options.recursively = true;
    if (options.onlyHardlinks) {
      if (options.shouldntInclude) {
        const originalshouldntInclude = options.shouldntInclude;
        options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
      } else {
        options.shouldntInclude = (each2) => each2.isSymlink;
      }
    }
    return FileSystem.iteratePathsIn(pathOrFileInfo, options);
  },
  recursivelyListPathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    return asyncIteratorToList(FileSystem.recursivelyIteratePathsIn(pathOrFileInfo, options));
  },
  recursivelyListItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    return asyncIteratorToList(FileSystem.recursivelyIterateItemsIn(pathOrFileInfo, options));
  },
  async *globIterator(pattern, options = { startPath: null }) {
    pattern = FileSystem.normalizePath(pattern);
    var { startPath, ...iteratePathsOptions } = options;
    startPath = startPath || "./";
    const originalStartPath = startPath;
    startPath = FileSystem.makeAbsolutePath(startPath);
    const firstGlob = pattern.indexOf("*");
    if (firstGlob != -1) {
      const startingString = pattern.slice(0, firstGlob);
      const furthestConstantSlash = startingString.lastIndexOf("/");
      if (furthestConstantSlash != -1) {
        if (pattern[0] == "/") {
          startPath = pattern.slice(0, furthestConstantSlash);
        } else {
          startPath = `${startPath}/${pattern.slice(0, furthestConstantSlash)}`;
        }
      }
      pattern = pattern.slice(furthestConstantSlash + 1);
    }
    let maxDepthFromRoot;
    if (pattern.match(/\*\*/)) {
      maxDepthFromRoot = Infinity;
    } else {
      maxDepthFromRoot = `${FileSystem.makeAbsolutePath(startPath)}/${pattern}`.split("/").length - 1;
    }
    const fullPattern = `${startPath}/${pattern}`;
    const regex2 = globToRegExp2(fullPattern);
    const partials = fullPattern.split("/");
    let partialPattern = partials.shift();
    let partialRegexString = `^\\.$|${globToRegExp2(partialPattern).source}`;
    for (const each2 of partials) {
      partialPattern += "/" + each2;
      partialRegexString += "|" + globToRegExp2(partialPattern).source;
    }
    const partialRegex = new RegExp(partialRegexString);
    for await (const eachPath2 of FileSystem.iteratePathsIn(startPath, { recursively: true, maxDepthFromRoot, ...iteratePathsOptions, shouldntExplore: (eachPath3) => !eachPath3.match(partialRegex) })) {
      if (eachPath2.match(regex2) || FileSystem.makeAbsolutePath(eachPath2).match(regex2)) {
        yield FileSystem.makeRelativePath({
          from: originalStartPath,
          to: eachPath2
        });
      }
    }
  },
  glob(pattern, options = { startPath: null }) {
    return asyncIteratorToList(FileSystem.globIterator(pattern, options));
  },
  async getPermissions(path7) {
    const { mode } = await Deno.lstat(path7?.path || path7);
    return {
      owner: {
        //          rwxrwxrwx
        canRead: !!(256 & mode),
        canWrite: !!(128 & mode),
        canExecute: !!(64 & mode)
      },
      group: {
        canRead: !!(32 & mode),
        canWrite: !!(16 & mode),
        canExecute: !!(8 & mode)
      },
      others: {
        canRead: !!(4 & mode),
        canWrite: !!(2 & mode),
        canExecute: !!(1 & mode)
      }
    };
  },
  /**
  * Add/set file permissions
  *
  * @param {String} args.path - 
  * @param {Object|Boolean} args.recursively - 
  * @param {Object} args.permissions - 
  * @param {Object} args.permissions.owner - 
  * @param {Boolean} args.permissions.owner.canRead - 
  * @param {Boolean} args.permissions.owner.canWrite - 
  * @param {Boolean} args.permissions.owner.canExecute - 
  * @param {Object} args.permissions.group - 
  * @param {Boolean} args.permissions.group.canRead - 
  * @param {Boolean} args.permissions.group.canWrite - 
  * @param {Boolean} args.permissions.group.canExecute - 
  * @param {Object} args.permissions.others - 
  * @param {Boolean} args.permissions.others.canRead - 
  * @param {Boolean} args.permissions.others.canWrite - 
  * @param {Boolean} args.permissions.others.canExecute - 
  * @return {null} 
  *
  * @example
  * ```js
  *  await FileSystem.addPermissions({
  *      path: fileOrFolderPath,
  *      permissions: {
  *          owner: {
  *              canExecute: true,
  *          },
  *      }
  *  })
  * ```
  */
  async addPermissions({ path: path7, permissions: permissions2 = { owner: {}, group: {}, others: {} }, recursively = false }) {
    permissions2 = { owner: {}, group: {}, others: {}, ...permissions2 };
    let permissionNumber = 0;
    let fileInfo;
    if ([permissions2.owner, permissions2.group, permissions2.others].some((each2) => !each2 || Object.keys(each2).length != 3)) {
      fileInfo = await FileSystem.info(path7);
      permissionNumber = fileInfo.lstat.mode & 511;
    }
    if (permissions2.owner.canRead != null) {
      permissionNumber = permissions2.owner.canRead ? setTrueBit(permissionNumber, 8) : setFalseBit(permissionNumber, 8);
    }
    if (permissions2.owner.canWrite != null) {
      permissionNumber = permissions2.owner.canWrite ? setTrueBit(permissionNumber, 7) : setFalseBit(permissionNumber, 7);
    }
    if (permissions2.owner.canExecute != null) {
      permissionNumber = permissions2.owner.canExecute ? setTrueBit(permissionNumber, 6) : setFalseBit(permissionNumber, 6);
    }
    if (permissions2.group.canRead != null) {
      permissionNumber = permissions2.group.canRead ? setTrueBit(permissionNumber, 5) : setFalseBit(permissionNumber, 5);
    }
    if (permissions2.group.canWrite != null) {
      permissionNumber = permissions2.group.canWrite ? setTrueBit(permissionNumber, 4) : setFalseBit(permissionNumber, 4);
    }
    if (permissions2.group.canExecute != null) {
      permissionNumber = permissions2.group.canExecute ? setTrueBit(permissionNumber, 3) : setFalseBit(permissionNumber, 3);
    }
    if (permissions2.others.canRead != null) {
      permissionNumber = permissions2.others.canRead ? setTrueBit(permissionNumber, 2) : setFalseBit(permissionNumber, 2);
    }
    if (permissions2.others.canWrite != null) {
      permissionNumber = permissions2.others.canWrite ? setTrueBit(permissionNumber, 1) : setFalseBit(permissionNumber, 1);
    }
    if (permissions2.others.canExecute != null) {
      permissionNumber = permissions2.others.canExecute ? setTrueBit(permissionNumber, 0) : setFalseBit(permissionNumber, 0);
    }
    if (recursively == false || fileInfo instanceof Object && fileInfo.isFile || !(fileInfo instanceof Object) && (await FileSystem.info(path7)).isFile) {
      return Deno.chmod(path7?.path || path7, permissionNumber);
    } else {
      const promises = [];
      const paths = await FileSystem.recursivelyListPathsIn(path7, { onlyHardlinks: false, dontFollowSymlinks: false, ...recursively });
      for (const eachPath2 of paths) {
        promises.push(
          Deno.chmod(eachPath2, permissionNumber).catch(console.error)
        );
      }
      return Promise.all(promises);
    }
  },
  // alias
  setPermissions(...args2) {
    return FileSystem.addPermissions(...args2);
  },
  async write({ path: path7, data, force = true, overwrite = false, renameExtension = null }) {
    path7 = pathStandardize(path7);
    await grabPathLock(path7);
    if (force) {
      FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path7), { overwrite, renameExtension });
      const info = FileSystem.sync.info(path7);
      if (info.isDirectory) {
        FileSystem.sync.remove(path7);
      }
    }
    let output2;
    if (typeof data == "string") {
      output2 = await Deno.writeTextFile(path7, data);
    } else if (typedArrayClasses2.some((dataClass) => data instanceof dataClass)) {
      output2 = await Deno.writeFile(path7, data);
    } else if (isGeneratorType(data) || data[Symbol.iterator] || data[Symbol.asyncIterator]) {
      const file = await Deno.open(path7, { read: true, write: true, create: true, truncate: true });
      const encoder = new TextEncoder();
      const encode = encoder.encode.bind(encoder);
      try {
        let index = 0;
        for await (let packet of data) {
          if (typeof packet == "string") {
            packet = encode(packet);
          }
          await Deno.write(file.rid, packet);
        }
      } finally {
        Deno.close(file.rid);
      }
    }
    delete locker[path7];
    return output2;
  },
  async append({ path: path7, data, force = true, overwrite = false, renameExtension = null }) {
    path7 = pathStandardize(path7);
    await grabPathLock(path7);
    if (force) {
      FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path7), { overwrite, renameExtension });
      const info = FileSystem.sync.info(path7);
      if (info.isDirectory) {
        FileSystem.sync.remove(path7);
      }
    }
    const file = await Deno.open(path7, { read: true, write: true, create: true });
    await file.seek(0, Deno.SeekMode.End);
    if (typeof data == "string") {
      await file.write(new TextEncoder().encode(data));
    } else {
      await file.write(data);
    }
    await file.close();
    delete locker[path7];
  },
  async makeHardPathTo(path7, options = {}) {
    var { cache: cache2 } = { cache: {}, ...options };
    if (cache2[path7]) {
      return cache2[path7];
    }
    const [folders, name, extension] = FileSystem.pathPieces(FileSystem.makeAbsolutePath(path7));
    let topDownPath = ``;
    for (const eachFolderName of folders) {
      topDownPath += `/${eachFolderName}`;
      if (cache2[topDownPath]) {
        topDownPath = cache2[topDownPath];
        continue;
      }
      const unchangedPath = topDownPath;
      const info = await FileSystem.info(topDownPath);
      if (info.isSymlink) {
        const absolutePathToIntermediate = await FileSystem.finalTargetOf(info.path, { _parentsHaveBeenChecked: true, cache: cache2 });
        if (absolutePathToIntermediate == null) {
          return null;
        }
        topDownPath = topDownPath.slice(0, -(eachFolderName.length + 1));
        const relativePath = FileSystem.makeRelativePath({
          from: topDownPath,
          to: absolutePathToIntermediate
        });
        topDownPath += `/${relativePath}`;
        topDownPath = normalize4(topDownPath);
      }
      cache2[unchangedPath] = topDownPath;
    }
    const hardPath = normalize4(`${topDownPath}/${name}${extension}`);
    cache2[path7] = hardPath;
    return hardPath;
  },
  async walkUpImport(path7, start) {
    const startPath = start || FileSystem.pathOfCaller(1);
    const nearestPath = await FileSystem.walkUpUntil(path7, startPath);
    if (nearestPath) {
      const absolutePath = FileSystem.makeAbsolutePath(`${nearestPath}/${path7}`);
      return import(toFileUrl3(absolutePath).href);
    } else {
      throw Error(`Tried to walkUpImport ${path7}, starting at ${startPath}, but was unable to find any files`);
    }
  },
  async withPwd(tempPwd, func) {
    const originalPwd = FileSystem.pwd;
    const originalPwdEnvVar = Deno.env.get("PWD");
    tempPwd = FileSystem.makeAbsolutePath(tempPwd);
    try {
      FileSystem.pwd = tempPwd;
      Deno.env.set("PWD", tempPwd);
      await func(originalPwd);
    } finally {
      FileSystem.pwd = originalPwd;
      Deno.env.set("PWD", originalPwdEnvVar);
    }
  },
  sync: {
    // things that are already sync
    get parentPath() {
      return FileSystem.parentPath;
    },
    get dirname() {
      return FileSystem.dirname;
    },
    get basename() {
      return FileSystem.basename;
    },
    get extname() {
      return FileSystem.extname;
    },
    get join() {
      return FileSystem.join;
    },
    get thisFile() {
      return FileSystem.thisFile;
    },
    get thisFolder() {
      return FileSystem.thisFolder;
    },
    get normalize() {
      return FileSystem.normalizePath;
    },
    get isAbsolutePath() {
      return FileSystem.isAbsolutePath;
    },
    get isRelativePath() {
      return FileSystem.isRelativePath;
    },
    get makeRelativePath() {
      return FileSystem.makeRelativePath;
    },
    get makeAbsolutePath() {
      return FileSystem.makeAbsolutePath;
    },
    get pathDepth() {
      return FileSystem.pathDepth;
    },
    get pathPieces() {
      return FileSystem.pathPieces;
    },
    get extendName() {
      return FileSystem.extendName;
    },
    get allParentPaths() {
      return FileSystem.allParentPaths;
    },
    get pathOfCaller() {
      return FileSystem.pathOfCaller;
    },
    get home() {
      return FileSystem.home;
    },
    get workingDirectory() {
      return FileSystem.workingDirectory;
    },
    get cwd() {
      return FileSystem.cwd;
    },
    get pwd() {
      return FileSystem.pwd;
    },
    get cd() {
      return FileSystem.cd;
    },
    get changeDirectory() {
      return FileSystem.changeDirectory;
    },
    set workingDirectory(value) {
      return FileSystem.workingDirectory = value;
    },
    set cwd(value) {
      return FileSystem.workingDirectory = value;
    },
    set pwd(value) {
      return FileSystem.workingDirectory = value;
    },
    info(fileOrFolderPath, _cachedLstat = null) {
      let lstat2 = _cachedLstat;
      try {
        lstat2 = Deno.lstatSync(fileOrFolderPath);
      } catch (error) {
        lstat2 = { doesntExist: true };
      }
      let stat2 = {};
      if (!lstat2.isSymlink) {
        stat2 = {
          isBrokenLink: false,
          isLoopOfLinks: false
        };
      } else {
        try {
          stat2 = Deno.statSync(fileOrFolderPath);
        } catch (error) {
          if (error.message.match(/^Too many levels of symbolic links/)) {
            stat2.isBrokenLink = true;
            stat2.isLoopOfLinks = true;
          } else if (error.message.match(/^No such file or directory/)) {
            stat2.isBrokenLink = true;
          } else {
            throw error;
          }
        }
      }
      return new Path({ path: fileOrFolderPath, _lstatData: lstat2, _statData: stat2 });
    },
    read(path7) {
      path7 = pathStandardize(path7);
      let output2;
      try {
        output2 = Deno.readTextFileSync(path7);
      } catch (error) {
      }
      return output2;
    },
    readBytes(path7) {
      path7 = pathStandardize(path7);
      let output2;
      try {
        output2 = Deno.readFileSync(path7);
      } catch (error) {
      }
      return output2;
    },
    *readLinesIteratively(path7) {
      path7 = pathStandardize(path7);
      const file = Deno.openSync(path7);
      try {
        yield* readLines(file);
      } finally {
        Deno.close(file.rid);
      }
    },
    /**
     * find a root folder based on a child path
     *
     * @example
     * ```js
     *     import { FileSystem } from "https://deno.land/x/quickr/main/file_system.js"
     * 
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil(".git")
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil({
     *         subPath:".git",
     *         startPath: FileSystem.pwd,
     *     })
     *
     *     // below will result in that^ same folder (assuming all your .git folders have config files)
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil(".git/config")
     * 
     *     // below will result in the same folder, but only if theres a local master branch
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil(".git/refs/heads/master")
     *```
     */
    walkUpUntil(subPath, startPath = null) {
      subPath = subPath instanceof Path ? subPath.path : subPath;
      if (subPath instanceof Object) {
        var { subPath, startPath } = subPath;
      }
      let here;
      if (!startPath) {
        here = Deno.cwd();
      } else if (isAbsolute3(startPath)) {
        here = startPath;
      } else {
        here = join4(here, startPath);
      }
      while (1) {
        let checkPath = join4(here, subPath);
        const pathInfo = Deno.lstatSync(checkPath).catch(() => ({ doesntExist: true }));
        if (!pathInfo.doesntExist) {
          return here;
        }
        if (here == dirname3(here)) {
          return null;
        } else {
          here = dirname3(here);
        }
      }
    },
    nextTargetOf(path7, options = {}) {
      const originalWasItem = path7 instanceof Path;
      const item = originalWasItem ? path7 : new Path({ path: path7 });
      const lstat2 = item.lstat;
      if (lstat2.isSymlink) {
        const relativeOrAbsolutePath = Deno.readLinkSync(item.path);
        if (isAbsolute3(relativeOrAbsolutePath)) {
          if (originalWasItem) {
            return new Path({ path: relativeOrAbsolutePath });
          } else {
            return relativeOrAbsolutePath;
          }
        } else {
          const path8 = `${FileSystem.sync.makeHardPathTo(dirname3(item.path))}/${relativeOrAbsolutePath}`;
          if (originalWasItem) {
            return new Path({ path: path8 });
          } else {
            return path8;
          }
        }
      } else {
        if (originalWasItem) {
          return item;
        } else {
          return item.path;
        }
      }
    },
    finalTargetOf(path7, options = {}) {
      const { _parentsHaveBeenChecked, cache: cache2 } = { _parentsHaveBeenChecked: false, cache: {}, ...options };
      const originalWasItem = path7 instanceof Path;
      path7 = path7.path || path7;
      let result = Deno.lstatSync(path7).catch(() => ({ doesntExist: true }));
      if (result.doesntExist) {
        return null;
      }
      path7 = FileSystem.sync.makeHardPathTo(path7, { cache: cache2 });
      const pathChain = [];
      while (result.isSymlink) {
        const relativeOrAbsolutePath = Deno.readLinkSync(path7);
        if (isAbsolute3(relativeOrAbsolutePath)) {
          path7 = relativeOrAbsolutePath;
        } else {
          path7 = `${FileSystem.parentPath(path7)}/${relativeOrAbsolutePath}`;
        }
        result = Deno.lstatSync(path7).catch(() => ({ doesntExist: true }));
        if (result.doesntExist) {
          return null;
        }
        path7 = FileSystem.sync.makeHardPathTo(path7, { cache: cache2 });
        if (pathChain.includes(path7)) {
          return null;
        }
        pathChain.push(path7);
      }
      path7 = FileSystem.normalizePath(path7);
      if (originalWasItem) {
        return new Path({ path: path7 });
      } else {
        return path7;
      }
    },
    makeHardPathTo(path7, options = {}) {
      var { cache: cache2 } = { cache: {}, ...options };
      if (cache2[path7]) {
        return cache2[path7];
      }
      const [folders, name, extension] = FileSystem.pathPieces(FileSystem.makeAbsolutePath(path7));
      let topDownPath = ``;
      for (const eachFolderName of folders) {
        topDownPath += `/${eachFolderName}`;
        if (cache2[topDownPath]) {
          topDownPath = cache2[topDownPath];
          continue;
        }
        const unchangedPath = topDownPath;
        const info = FileSystem.sync.info(topDownPath);
        if (info.isSymlink) {
          const absolutePathToIntermediate = FileSystem.sync.finalTargetOf(info.path, { _parentsHaveBeenChecked: true, cache: cache2 });
          if (absolutePathToIntermediate == null) {
            return null;
          }
          topDownPath = topDownPath.slice(0, -(eachFolderName.length + 1));
          const relativePath = FileSystem.makeRelativePath({
            from: topDownPath,
            to: absolutePathToIntermediate
          });
          topDownPath += `/${relativePath}`;
          topDownPath = normalize4(topDownPath);
        }
        cache2[unchangedPath] = topDownPath;
      }
      const hardPath = normalize4(`${topDownPath}/${name}${extension}`);
      cache2[path7] = hardPath;
      return hardPath;
    },
    remove(fileOrFolder) {
      if (fileOrFolder instanceof Array) {
        return fileOrFolder.map(FileSystem.sync.remove);
      }
      fileOrFolder = fileOrFolder.path || fileOrFolder;
      let exists2 = false;
      let item;
      try {
        item = Deno.lstatSync(fileOrFolder);
        exists2 = true;
      } catch (error) {
      }
      if (exists2) {
        if (item.isFile || item.isSymlink) {
          return Deno.removeSync(fileOrFolder.replace(/\/+$/, ""));
        } else {
          return Deno.removeSync(fileOrFolder.replace(/\/+$/, ""), { recursive: true });
        }
      }
    },
    moveOutOfTheWay(path7, options = { extension: null }) {
      path7 = pathStandardize(path7);
      const extension = options?.extension || FileSystem.defaultRenameExtension;
      const info = FileSystem.sync.info(path7);
      if (info.exists) {
        const newPath = path7 + extension;
        FileSystem.sync.moveOutOfTheWay(newPath, { extension });
        moveSync(path7, newPath);
      }
    },
    ensureIsFolder(path7, options = { overwrite: false, renameExtension: null }) {
      path7 = pathStandardize(path7);
      const { overwrite, renameExtension } = defaultOptionsHelper(options);
      path7 = path7.path || path7;
      path7 = FileSystem.makeAbsolutePath(path7);
      const parentPath = dirname3(path7);
      if (parentPath == path7) {
        return;
      }
      const parent = FileSystem.sync.info(parentPath);
      if (!parent.isDirectory) {
        FileSystem.sync.ensureIsFolder(parentPath, { overwrite, renameExtension });
      }
      let pathInfo = FileSystem.sync.info(path7);
      if (pathInfo.exists && !pathInfo.isDirectory) {
        if (overwrite) {
          FileSystem.sync.remove(path7);
        } else {
          FileSystem.sync.moveOutOfTheWay(path7, { extension: renameExtension });
        }
      }
      Deno.mkdirSync(path7, { recursive: true });
      return path7;
    },
    ensureIsFile(path7, options = { overwrite: false, renameExtension: null }) {
      const { overwrite, renameExtension } = defaultOptionsHelper(options);
      FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path7), { overwrite, renameExtension });
      path7 = path7.path || path7;
      const pathInfo = FileSystem.sync.info(path7);
      if (pathInfo.isFile && !pathInfo.isDirectory) {
        return path7;
      } else {
        FileSystem.sync.write({ path: path7, data: "" });
        return path7;
      }
    },
    /**
     * Move/Remove everything and Ensure parent folders
     *
     * @param path
     * @param options.overwrite - if false, then things in the way will be moved instead of deleted
     * @param options.extension - the string to append when renaming files to get them out of the way
     * 
     * @example
     * ```js
     *     FileSystem.sync.clearAPathFor("./something")
     * ```
     */
    clearAPathFor(path7, options = { overwrite: false, renameExtension: null }) {
      const { overwrite, renameExtension } = defaultOptionsHelper(options);
      const originalPath = path7;
      const paths = [];
      while (dirname3(path7) !== path7) {
        paths.push(path7);
        path7 = dirname3(path7);
      }
      for (const eachPath2 of paths.reverse()) {
        const info = FileSystem.sync.info(eachPath2);
        if (!info.exists) {
          break;
        } else if (info.isFile) {
          if (overwrite) {
            FileSystem.sync.remove(eachPath2);
          } else {
            FileSystem.sync.moveOutOfTheWay(eachPath2, { extension: renameExtension });
          }
        }
      }
      Deno.mkdirSync(dirname3(originalPath), { recursive: true });
      return originalPath;
    },
    append({ path: path7, data, force = true, overwrite = false, renameExtension = null }) {
      path7 = pathStandardize(path7);
      if (force) {
        FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path7), { overwrite, renameExtension });
        const info = FileSystem.sync.info(path7);
        if (info.isDirectory) {
          FileSystem.sync.remove(path7);
        }
      }
      const file = Deno.openSync(path7, { read: true, write: true, create: true });
      file.seekSync(0, Deno.SeekMode.End);
      if (typeof data == "string") {
        file.writeSync(new TextEncoder().encode(data));
      } else {
        file.writeSync(data);
      }
      file.close();
    },
    write({ path: path7, data, force = true, overwrite = false, renameExtension = null }) {
      path7 = pathStandardize(path7);
      if (force) {
        FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path7), { overwrite, renameExtension });
        const info = FileSystem.sync.info(path7);
        if (info.isDirectory) {
          FileSystem.sync.remove(path7);
        }
      }
      let output2;
      if (typeof data == "string") {
        output2 = Deno.writeTextFileSync(path7, data);
      } else if (typedArrayClasses2.some((dataClass) => data instanceof dataClass)) {
        output2 = Deno.writeFileSync(path7, data);
      } else if (isGeneratorType(data) || data[Symbol.iterator] || data[Symbol.asyncIterator]) {
        const file = Deno.openSync(path7, { read: true, write: true, create: true, truncate: true });
        const encoder = new TextEncoder();
        const encode = encoder.encode.bind(encoder);
        try {
          let index = 0;
          for (let packet of data) {
            if (typeof packet == "string") {
              packet = encode(packet);
            }
            Deno.writeSync(file.rid, packet);
          }
        } finally {
          Deno.close(file.rid);
        }
      }
      return output2;
    },
    absoluteLink({ existingItem, newItem, force = true, allowNonExistingTarget = false, overwrite = false, renameExtension = null }) {
      existingItem = (existingItem.path || existingItem).replace(/\/+$/, "");
      const newItemPath = FileSystem.normalizePath(newItem.path || newItem).replace(/\/+$/, "");
      const existingItemDoesntExist = Deno.lstatSync(existingItem).catch(() => ({ doesntExist: true })).doesntExist;
      if (!allowNonExistingTarget && existingItemDoesntExist) {
        throw Error(`
Tried to create a relativeLink between existingItem:${existingItem}, newItemPath:${newItemPath}
but existingItem didn't actually exist`);
      } else {
        const parentOfNewItem = FileSystem.parentPath(newItemPath);
        FileSystem.sync.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
        const hardPathToNewItem = `${FileSystem.syncmakeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
        if (force) {
          FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
        }
        return Deno.symlinkSync(
          FileSystem.makeAbsolutePath(existingItem),
          newItemPath
        );
      }
    },
    relativeLink({ existingItem, newItem, force = true, overwrite = false, allowNonExistingTarget = false, renameExtension = null }) {
      const existingItemPath = (existingItem.path || existingItem).replace(/\/+$/, "");
      const newItemPath = FileSystem.normalizePath((newItem.path || newItem).replace(/\/+$/, ""));
      const existingItemDoesntExist = Deno.lstatSync(existingItemPath).catch(() => ({ doesntExist: true })).doesntExist;
      if (!allowNonExistingTarget && existingItemDoesntExist) {
        throw Error(`
Tried to create a relativeLink between existingItem:${existingItemPath}, newItem:${newItemPath}
but existingItem didn't actually exist`);
      } else {
        const parentOfNewItem = FileSystem.parentPath(newItemPath);
        FileSystem.sync.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
        const hardPathToNewItem = `${FileSystem.sync.makeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
        const hardPathToExistingItem = FileSystem.sync.makeHardPathTo(existingItemPath);
        const pathFromNewToExisting = relative3(hardPathToNewItem, hardPathToExistingItem).replace(/^\.\.\//, "");
        if (force) {
          FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
        }
        return Deno.symlinkSync(
          pathFromNewToExisting,
          hardPathToNewItem
        );
      }
    },
    move({ path: path7, item, newParentFolder, newName, force = true, overwrite = false, renameExtension = null }) {
      item = item || path7;
      const oldPath = item.path || item;
      const oldName = FileSystem.basename(oldPath);
      const pathInfo = item instanceof Object || FileSystem.sync.info(oldPath);
      const newPath = `${newParentFolder || FileSystem.parentPath(oldPath)}/${newName || oldName}`;
      if (pathInfo.isSymlink && !item.isBrokenLink) {
        const link2 = Deno.readLinkSync(pathInfo.path);
        if (!isAbsolute3(link2)) {
          const linkTargetBeforeMove = `${FileSystem.parentPath(pathInfo.path)}/${link2}`;
          FileSystem.sync.relativeLink({
            existingItem: linkTargetBeforeMove,
            newItem: newPath,
            force,
            overwrite,
            renameExtension
          });
          FileSystem.sync.remove(pathInfo);
        }
      }
      if (force) {
        FileSystem.sync.clearAPathFor(newPath, { overwrite, renameExtension });
      }
      return moveSync(oldPath, newPath);
    },
    rename({ from, to, force = true, overwrite = false, renameExtension = null }) {
      return FileSystem.sync.move({ path: from, newParentFolder: FileSystem.parentPath(to), newName: FileSystem.basename(to), force, overwrite, renameExtension });
    },
    copy({ from, to, preserveTimestamps = true, force = true, overwrite = false, renameExtension = null }) {
      const existingItemDoesntExist = Deno.statSync(from).catch(() => ({ doesntExist: true })).doesntExist;
      if (existingItemDoesntExist) {
        throw Error(`
Tried to copy from:${from}, to:${to}
but "from" didn't seem to exist

`);
      }
      if (force) {
        FileSystem.sync.clearAPathFor(to, { overwrite, renameExtension });
      }
      return copySync(from, to, { force, preserveTimestamps: true });
    }
    // sync TODO:
    // iterateBasenamesIn
    // iteratePathsIn
    // iterateItemsIn
    // listItemsIn
    // listFileItemsIn
    // listFilePathsIn
    // listFileBasenamesIn
    // listFolderItemsIn
    // listFolderPathsIn
    // listFolderBasenamesIn
    // globIterator
    // getPermissions
    // addPermissions
    // Note:
    // cannot be sync:
    // walkUpImport 
  }
};
var glob = FileSystem.glob;

// https://deno.land/x/good@1.7.1.0/flattened/word_list.js
var wordList = (str) => {
  const addedSeperator = str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9 _.-]/, "_").toLowerCase();
  const words = addedSeperator.split(/[ _.-]+/g).filter((each2) => each2);
  return words;
};

// https://deno.land/x/good@1.7.1.0/flattened/to_camel_case.js
var toCamelCase = (str) => {
  const words = wordList(str);
  const capatalizedWords = words.map((each2) => each2.replace(/^\w/, (group0) => group0.toUpperCase()));
  capatalizedWords[0] = capatalizedWords[0].toLowerCase();
  return capatalizedWords.join("");
};

// https://deno.land/x/good@1.7.1.0/flattened/parse_args.js
var flag = Symbol("flagArg");
var required = Symbol("requiredArg");
var unset = Symbol("unset");
var Default = class {
  constructor(val) {
    this.val = val;
  }
};
var initialValue = (value) => new Default(value);
var coerseValue = (value, transformer) => {
  if (value instanceof Array) {
    try {
      return transformer(value);
    } catch (error) {
      const newValues = [];
      for (const each2 of value) {
        try {
          newValues.push(transformer(each2));
        } catch (error2) {
          newValues.push(each2);
        }
      }
      return newValues;
    }
  } else if (value !== void 0 && value !== unset) {
    try {
      return transformer(value);
    } catch (error) {
    }
  }
  return value;
};
function parseArgs({
  rawArgs,
  fields,
  namedArgsStopper = "--",
  allowNameRepeats = true,
  nameTransformer = toCamelCase,
  valueTransformer = JSON.parse,
  isolateArgsAfterStopper = false,
  argsByNameSatisfiesNumberedArg = true,
  implicitNamePattern = /^(--|-)[a-zA-Z0-9\-_]+$/,
  implictFlagPattern = null
}) {
  const explicitNamesList = [];
  const explicitFlagList = [];
  const keyToField = /* @__PURE__ */ new Map();
  for (const [keys, ...kind] of fields) {
    const isFlag = kind.includes(flag);
    const isRequired = kind.includes(required);
    const hasDefaultValue = kind.some((each2) => each2 instanceof Default);
    const hasTransformer = kind.some((each2) => each2 instanceof Function);
    const entry = {
      isRequired,
      isFlag,
      isExplicit: true,
      hasTransformer,
      wasNamed: false,
      keys,
      kind,
      realIndices: [],
      value: unset,
      hasDefaultValue,
      default: hasDefaultValue ? kind.filter((each2) => each2 instanceof Default)[0].val : void 0
    };
    for (const each2 of keys) {
      if (keyToField.has(each2)) {
        throw Error(`When calling parseArgs(), there's at least two arguments that are both trying to use this name ${JSON.stringify(each2)}. A name can only belong to one argument.`);
      }
      keyToField.set(each2, entry);
      if (typeof each2 == "string") {
        explicitNamesList.push(each2);
      }
    }
    if (isFlag) {
      for (const each2 of keys) {
        if (typeof each2 == "string") {
          explicitFlagList.push(each2);
        }
      }
    }
  }
  const argsAfterStopper = [];
  const numberWasImplicit = [];
  const nameWasImplicit = [];
  let directArgList = [];
  const argsByNumber = {};
  let stopParsingArgsByName = false;
  let argName = null;
  let runningArgNumberIndex = -1;
  let index = -1;
  let nameStopIndex = null;
  const numberedArgBuffer = [];
  const handleNumberedArg = (index2, each2) => {
    directArgList.push(each2);
    parse_next_numbered_arg:
      while (1) {
        runningArgNumberIndex += 1;
        if (!keyToField.has(runningArgNumberIndex)) {
          numberWasImplicit.push(runningArgNumberIndex);
          keyToField.set(runningArgNumberIndex, {
            kind: [],
            keys: [runningArgNumberIndex],
            realIndices: [index2],
            value: each2
          });
        } else {
          const entry = keyToField.get(runningArgNumberIndex);
          if (entry.value != unset) {
            if (argsByNameSatisfiesNumberedArg) {
              continue parse_next_numbered_arg;
            } else if (allowNameRepeats) {
              entry.value = [entry.value, each2];
            } else {
              throw Error(`When calling parseArgs(), two values were given for the same entry (ex: "count $thisVal 5 --min $thisVal" instead of "count --min $thisVal --max 5" or "count $thisVal 5"). The second occurance was ${argName}, and the field was ${JSON.stringify(entry.names)}`);
            }
          } else {
            argsByNumber[runningArgNumberIndex] = each2;
            entry.value = each2;
          }
          entry.realIndices.push(index2);
        }
        break;
      }
  };
  for (const eachArg of rawArgs) {
    index += 1;
    if (argName != null) {
      const name = argName;
      argName = null;
      if (!keyToField.has(name)) {
        nameWasImplicit.push(name);
        keyToField.set(name, {
          wasNamed: true,
          kind: [],
          keys: [name],
          realIndices: [index],
          value: eachArg
        });
      } else {
        const entry = keyToField.get(name);
        entry.wasNamed = true;
        if (entry.value !== unset) {
          if (allowNameRepeats) {
            entry.value = [entry.value, eachArg];
          } else {
            throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${name}, and the field was ${JSON.stringify(entry.keys)} `);
          }
        } else {
          entry.value = eachArg;
        }
        entry.realIndices.push(index - 1);
        entry.realIndices.push(index);
      }
      continue;
    }
    if (eachArg == namedArgsStopper) {
      stopParsingArgsByName = true;
      nameStopIndex = index;
      continue;
    }
    if (stopParsingArgsByName) {
      argsAfterStopper.push(eachArg);
      if (!isolateArgsAfterStopper) {
        numberedArgBuffer.push([index, eachArg]);
      }
      continue;
    }
    let match;
    if (explicitFlagList.includes(eachArg)) {
      const entry = keyToField.get(eachArg);
      if (entry.value != unset) {
        if (!allowNameRepeats) {
          throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${eachArg}, and the field was ${JSON.stringify(entry.keys)} `);
        }
      } else {
        entry.value = true;
      }
      entry.realIndices.push(index);
    } else if (explicitNamesList.includes(eachArg)) {
      argName = eachArg;
    } else if (implicitNamePattern && (match = eachArg.match(implicitNamePattern))) {
      argName = eachArg;
    } else if (implictFlagPattern && (match = eachArg.match(implictFlagPattern))) {
      if (!keyToField.has(eachArg)) {
        keyToField.set(runningArgNumberIndex, {
          isFlag: true,
          kind: [],
          keys: [eachArg],
          realIndices: [index],
          value: true
        });
      } else {
        keyToField.get(eachArg).realIndices.push(index);
      }
    } else {
      numberedArgBuffer.push([index, eachArg]);
    }
  }
  for (const [index2, each2] of numberedArgBuffer) {
    handleNumberedArg(index2, each2);
  }
  const simplifiedNames = {};
  const argsByName = {};
  const fieldSet = new Set(keyToField.values());
  for (const eachEntry of fieldSet) {
    const names = eachEntry.keys.filter((each2) => typeof each2 == "string");
    if (names.length > 0) {
      if (!nameTransformer) {
        simplifiedNames[names[0]] = null;
      } else {
        const transformedNames = names.map(nameTransformer).flat(1);
        simplifiedNames[transformedNames[0]] = null;
        const newNames = transformedNames.filter((each2) => !names.includes(each2));
        eachEntry.keys = eachEntry.keys.concat(newNames);
        for (const newName of newNames) {
          keyToField.set(newName, eachEntry);
        }
      }
    }
  }
  for (const eachEntry of fieldSet) {
    if (eachEntry.isRequired && eachEntry.value == unset) {
      throw Error(`

The ${eachEntry.keys.map((each2) => typeof each2 == "number" ? `[Arg #${each2}]` : each2).join(" ")} field is required but it was not provided
`);
    }
    const usingDefaultValue = eachEntry.hasDefaultValue && eachEntry.value == unset;
    if (usingDefaultValue) {
      eachEntry.value = eachEntry.default;
    } else {
      if (eachEntry.hasTransformer) {
        for (const eachTransformer of eachEntry.kind) {
          if (eachTransformer instanceof Function) {
            eachEntry.value = eachTransformer(eachEntry.value);
          }
        }
      } else if (valueTransformer && !eachEntry.isFlag) {
        eachEntry.value = coerseValue(eachEntry.value, valueTransformer);
      }
    }
    if (eachEntry.isFlag) {
      if (eachEntry.value == unset) {
        eachEntry.value = false;
      } else {
        eachEntry.value = !!eachEntry.value;
      }
    }
    for (const eachName of eachEntry.keys) {
      if (typeof eachName == "number") {
        argsByNumber[eachName] = eachEntry.value;
      } else if (typeof eachName == "string") {
        argsByName[eachName] = eachEntry.value;
      }
    }
  }
  const implicitArgsByName = {};
  const implicitArgsByNumber = [];
  for (const { isExplicit, value, keys } of fieldSet) {
    if (!isExplicit) {
      if (typeof keys[0] == "number") {
        implicitArgsByNumber.push(value);
      } else {
        implicitArgsByName[keys[0]] = value;
        implicitArgsByName[nameTransformer(keys[0])] = value;
      }
    }
  }
  const explicitArgsByName = {};
  const explicitArgsByNumber = [];
  for (const { isExplicit, kind, value, keys } of fieldSet) {
    if (isExplicit) {
      for (const eachKey of keys) {
        if (typeof eachKey == "number") {
          explicitArgsByNumber[eachKey] = value;
        } else {
          explicitArgsByName[eachKey] = value;
        }
      }
    }
  }
  for (const each2 of Object.keys(simplifiedNames)) {
    simplifiedNames[each2] = argsByName[each2];
  }
  if (valueTransformer) {
    directArgList = directArgList.map((each2) => coerseValue(each2, valueTransformer));
  }
  return {
    simplifiedNames,
    argList: explicitArgsByNumber.concat(implicitArgsByNumber),
    explicitArgsByNumber,
    implicitArgsByNumber,
    directArgList,
    argsAfterStopper,
    arg: (nameOrIndex) => {
      if (typeof nameOrIndex == "number") {
        return argsByNumber[nameOrIndex];
      } else {
        return argsByName[nameOrIndex];
      }
    },
    fields: [...fieldSet],
    field: keyToField.get,
    explicitArgsByName,
    implicitArgsByName,
    nameStopIndex
  };
}

// https://deno.land/x/good@1.7.1.0/flattened/levenshtein_distance_between.js
function levenshteinDistanceBetween(str1, str2) {
  if (str1.length > str2.length) {
    ;
    [str1, str2] = [str2, str1];
  }
  let distances = Array.from({ length: str1.length + 1 }, (_, i) => +i);
  for (let str2Index = 0; str2Index < str2.length; str2Index++) {
    const tempDistances = [str2Index + 1];
    for (let str1Index = 0; str1Index < str1.length; str1Index++) {
      let char1 = str1[str1Index];
      let char2 = str2[str2Index];
      if (char1 === char2) {
        tempDistances.push(distances[str1Index]);
      } else {
        tempDistances.push(1 + Math.min(distances[str1Index], distances[str1Index + 1], tempDistances[tempDistances.length - 1]));
      }
    }
    distances = tempDistances;
  }
  return distances[distances.length - 1];
}

// https://deno.land/x/good@1.7.1.0/flattened/did_you_mean.js
function didYouMean(arg) {
  var { givenWord, givenWords, possibleWords, caseSensitive, autoThrow, suggestionLimit } = { suggestionLimit: Infinity, ...arg };
  if (givenWords instanceof Array) {
    let output2 = {};
    for (const givenWord2 of givenWords) {
      output2[givenWord2] = didYouMean({ ...arg, givenWord: givenWord2, givenWords: void 0 });
    }
    return output2;
  }
  if (!caseSensitive) {
    possibleWords = possibleWords.map((each2) => each2.toLowerCase());
    givenWord = givenWord.toLowerCase();
  }
  if (!possibleWords.includes(givenWord) && autoThrow) {
    let suggestions = didYouMean({
      givenWord,
      possibleWords,
      caseSensitive,
      suggestionLimit
    });
    if (suggestionLimit == 1 && suggestions.length > 0) {
      throw new Error(`For ${JSON.stringify(givenWord)}, did you mean ${JSON.stringify(suggestions[0])}?`);
    } else {
      throw new Error(`For ${JSON.stringify(givenWord)}, did you mean one of ${JSON.stringify(suggestions)}?`);
    }
  }
  return [...possibleWords].sort((a, b) => levenshteinDistanceBetween(givenWord, a) - levenshteinDistanceBetween(givenWord, b)).slice(0, suggestionLimit);
}

// https://deno.land/x/good@1.7.1.1/flattened/path_pieces.js
function pathPieces(path7) {
  path7 = path7.path || path7;
  const result = parse3(path7);
  const folderList = [];
  let dirname9 = result.dir;
  while (true) {
    folderList.push(basename3(dirname9));
    if (dirname9 == dirname3(dirname9)) {
      break;
    }
    dirname9 = dirname3(dirname9);
  }
  folderList.reverse();
  return [folderList, result.name, result.ext];
}

// main/deno-guillotine-api.js
var specialCharPattern = /\s|\\|\"|'|`|#|\$|%|&|;|\*|\(|\)|\[|\]|\{|\}|,|<|>|\?|@|\^|\||~/;
var shellEscape = (arg) => `'${arg.replace(/'/g, `'"'"'`)}'`;
function enhanceScript({ filePath, jsFileContent, denoVersion: denoVersion2, additionalArgs: additionalArgs2, additionalArgsForUnix: additionalArgsForUnix2, additionalArgsForWindows: additionalArgsForWindows2, baseArgs = ["-q", "-A", "--no-lock"] }) {
  const nonStringArgs = Object.entries({ filePath, jsFileContent, denoVersion: denoVersion2 }).filter(
    ([name, arg]) => typeof arg != "string"
  ).map(
    ([name, arg]) => name
  );
  if (nonStringArgs.length > 0) {
    throw new Error(`

For Deno Guillotine, I got arguments ${JSON.stringify(nonStringArgs)} that needed to be strings but were not`);
  }
  for (const each2 of [...additionalArgs2, ...baseArgs]) {
    let match = each2.match(specialCharPattern);
    if (match) {
      throw new Error(`

For Deno Guillotine, I got a CLI argument for the script that contains a special character: ${match[0]}
This is a problem because the character behaves differently on windows/non-windows.

However, you can still add the argument. You'll simply need to specify both the --additionalArgsForUnix and --additionalArgsForWindows individually.

NOTE! On unix/not-windows, args will be be passed as strings. But on windows, the arguments are passed as-is to powershell (AKA they are evaled as code). %THING for windows would expand the THING variable, while on unix it would simply be the string "%THING". 
This is because its impossible to reliably/generically escape arguments on windows.`);
    }
  }
  let filePathNameNoExt = basename3(filePath);
  if (filePathNameNoExt.includes(".")) {
    filePathNameNoExt = filePathNameNoExt.split(".").slice(0, -1).join(".");
  }
  const [folders, itemName, itemExtensionWithDot] = pathPieces(filePath);
  const normalPath2 = `${folders.join("/")}/${itemName}`;
  const ps1Path2 = `${folders.join("/")}/${itemName}.ps1`;
  const denoVersionList = denoVersion2.split(".").map((each2) => each2 - 0);
  const [major, minor, patch, ...rest] = denoVersionList;
  const supportsNoLock = major > 0 && (minor > 27 || minor == 27 && patch > 1);
  if (!supportsNoLock) {
    baseArgs = baseArgs.filter((each2) => each2 != "--no-lock");
  }
  const argsForUnix = [...baseArgs, ...additionalArgs2.map(shellEscape), ...additionalArgsForUnix2.map(shellEscape)].join(" ");
  const argsForWindows = [...baseArgs, ...additionalArgs2, ...additionalArgsForWindows2].join(" ");
  const newHeader = `#!/usr/bin/env sh
"\\"",\`$(echo --% ' |out-null)" >$null;function :{};function dv{<#\${/*'>/dev/null )\` 2>/dev/null;dv() { #>
echo "${denoVersion2}"; : --% ' |out-null <#'; }; version="$(dv)"; deno="$HOME/.deno/$version/bin/deno"; if [ -x "$deno" ]; then  exec "$deno" run ${argsForUnix} "$0" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run ${argsForUnix} "$0" "$@";  fi; bin_dir="$HOME/.deno/$version/bin"; exe="$bin_dir/deno"; has () { command -v "$1" >/dev/null; } ;  if ! has unzip; then if ! has apt-get; then  has brew && brew install unzip; else  if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  sudo apt-get install unzip -y; fi; elif has doas; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  doas apt-get install unzip -y; fi; fi;  fi;  fi;  if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  repo="denoland/deno"; if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else :;  case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") repo="LukeChannings/deno-arm64" target="linux-arm64" ;; "Linux armhf") echo "deno sadly doesn't support 32-bit ARM. Please check your hardware and possibly install a 64-bit operating system." exit 1 ;; *) target="x86_64-unknown-linux-gnu" ;; esac; fi; deno_uri="https://github.com/$repo/releases/download/v$version/deno-$target.zip"; exe="$bin_dir/deno"; if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if ! curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; then if ! wget --output-document="$exe.zip" "$deno_uri"; then echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them. Please install one of them, otherwise I have no way to install the missing deno version needed to run this code"; exit 1; fi; fi; unzip -d "$bin_dir" -o "$exe.zip"; chmod +x "$exe"; rm "$exe.zip"; exec "$deno" run ${argsForUnix} "$0" "$@"; #>}; $DenoInstall = "\${HOME}/.deno/$(dv)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;  $User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run ${argsForWindows} "$PSCommandPath" @args; Exit $LastExitCode; <# 
# */0}\`;
`;
  let newContents2 = jsFileContent;
  newContents2 = newContents2.replace(/\n\/\/ \(this comment is part of deno-guillotine, dont remove\) #>/g, "");
  newContents2 = newContents2.replace(/^#!\/usr\/bin\/env -S deno.+\n/, "");
  newContents2 = newContents2.replace(/#!\/usr\/bin\/env sh(\w|\W)+?\n# *\*\/0\}`;\n/, "");
  newContents2 = newContents2.replace(/#>/g, "#\\>");
  newContents2 = newHeader + newContents2 + "\n// (this comment is part of deno-guillotine, dont remove) #>";
  return {
    symlinkPath: `./${filePathNameNoExt}.ps1`,
    normalPath: normalPath2,
    ps1Path: ps1Path2,
    newContents: newContents2
  };
}

// main/version.js
var version2 = "1.0.0.1";

// main/deno-guillotine.js
var { help: showHelp, version: showVersion } = parseArgs({
  rawArgs: Deno.args,
  fields: [
    [["--help"], flag],
    [["--version"], flag]
  ]
}).simplifiedNames;
if (showVersion) {
  console.log(version2);
  Deno.exit(0);
}
if (showHelp) {
  console.log(`
    Deno Guillotine
        examples:
            deno-guillotine ./your_file.js
            deno-guillotine ./your_file.js ${Deno.version.deno}
            deno-guillotine --version
            deno-guillotine --file ./your_file.js
            deno-guillotine --file ./your_file.js --deno-version ${Deno.version.deno}
            deno-guillotine --file ./your_file.js                 --add-arg '--no-npm'                 --add-arg '--unstable'
            
            deno-guillotine --file ./your_file.js                 --add-unix-arg '--unstable-ffi'                 --add-windows-arg '--unstable-cron'
            
            deno-guillotine --file ./your_file.js                 --no-default-args                 --add-arg '--quiet'                 --add-arg '--allow-read'
        `);
  Deno.exit(0);
}
var output = parseArgs({
  rawArgs: Deno.args,
  fields: [
    [[0, "--file"], required],
    [[1, "--deno-version"], initialValue(`${Deno.version.deno}`)],
    [["--no-default-args"], flag],
    [["--add-arg"], initialValue([])],
    [["--add-unix-arg"], initialValue([])],
    [["--add-windows-arg"], initialValue([])]
  ],
  nameTransformer: toCamelCase,
  namedArgsStopper: "--",
  allowNameRepeats: true,
  valueTransformer: JSON.parse,
  isolateArgsAfterStopper: false,
  argsByNameSatisfiesNumberedArg: true,
  implicitNamePattern: /^(--|-)[a-zA-Z0-9\-_]+$/,
  implictFlagPattern: null
});
didYouMean({
  givenWords: Object.keys(output.implicitArgsByName).filter((each2) => each2.startsWith(`-`)),
  possibleWords: Object.keys(output.explicitArgsByName).filter((each2) => each2.startsWith(`-`)),
  autoThrow: true
});
var {
  file: path6,
  denoVersion,
  addArg: additionalArgs,
  addUnixArg: additionalArgsForUnix,
  addWindowsArg: additionalArgsForWindows,
  noDefaultArgs
} = output.simplifiedNames;
var fileDoenstExist = await Deno.lstat(path6).catch(() => ({ doesntExist: true })).doesntExist;
if (fileDoenstExist) {
  console.log(`Hey! the file you gave me doesn't seem to exist: ${path6}`);
  Deno.exit(1);
}
var contents = Deno.readTextFileSync(path6);
var { newContents, symlinkPath, normalPath, ps1Path } = enhanceScript({
  filePath: path6,
  jsFileContent: contents,
  denoVersion,
  additionalArgs: typeof additionalArgs === "string" ? [additionalArgs] : additionalArgs,
  additionalArgsForUnix: typeof additionalArgsForUnix === "string" ? [additionalArgsForUnix] : additionalArgsForUnix,
  additionalArgsForWindows: typeof additionalArgsForWindows === "string" ? [additionalArgsForWindows] : additionalArgsForWindows,
  baseArgs: noDefaultArgs ? [] : ["-q", "-A", "--no-lock"]
  // NOTE: no lock is given because differnt versions of deno can have different lock file formats
  //       meaning the script will fail to run with the spcified version of deno
  //       if another version of deno is installed
});
console.log(`Creating ${ps1Path}`);
await FileSystem.write({
  data: newContents,
  path: ps1Path,
  overwrite: true
});
console.log(`Setting ${ps1Path} permissions`);
try {
  await FileSystem.addPermissions({
    path: ps1Path,
    permissions: {
      owner: {
        canExecute: true
      },
      group: {
        canExecute: true
      },
      others: {
        canExecute: true
      }
    }
  });
} catch (error) {
  if (Deno.build.os != "windows") {
    console.warn(`I was unable to make this file an executable, just fyi: ${ps1Path}`);
  }
}
console.log(`Creating ${normalPath}`);
FileSystem.sync.remove(normalPath);
Deno.symlinkSync(
  symlinkPath,
  normalPath,
  {
    type: "file"
  }
);
console.log(`Setting ${normalPath} permissions`);
try {
  await FileSystem.addPermissions({
    path: normalPath,
    permissions: {
      owner: {
        canExecute: true
      },
      group: {
        canExecute: true
      },
      others: {
        canExecute: true
      }
    }
  });
} catch (error) {
  if (Deno.build.os != "windows") {
    console.warn(`I was unable to make this file an executable, just fyi: ${normalPath}`);
  }
}
console.log(`Done! \u2705`);
console.log(`try doing:`);
console.log(`    cd ${FileSystem.pwd}`);
console.log(`    ./${normalPath}`.replace(/^    \.\/\.\//, "    ./"));
