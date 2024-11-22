#!/usr/bin/env -S deno run --allow-all
import { FileSystem } from "https://deno.land/x/quickr@0.6.56/main/file_system.js"
let content = await FileSystem.read("./main/readable.ps1")
// remove last two lines
const firstLine = content.split(/\n/g)[0]
const lastRealLine = content.split(/\n/g).slice(-3)[0]
content = content.split(/\n/g).slice(1,-2).join("\n")
// remove comments
content = content.replace(/^( |\t)*#(\n| ).*\n?/gm,"")
// remove newlines
content = content.replace(/\n( |\t)*/g," ")

if (content.match(/\\\n/)) {
    console.warn(`Looks like there's an escaped newline, which will break this script.\nEx:\n    echo hi && \\\n        echo other`)
}

await FileSystem.write({
    data: firstLine+"\n"+content+"\n"+lastRealLine,
    path: "./main/inlined.ps1",
})
console.log("done: ./main/inlined.ps1")

const stringToBacktickRepresentation = (string) => {
    let newString = "`"
    let nextIndex = 0
    for (const each of string) {
        nextIndex++
        if (each == "\\") {
            newString += "\\\\"
        } else if (each == "`") {
            newString += "\\`"
        } else if (each == "$") {
            if (string[nextIndex] == "{") {
                newString += "\\$"
            } else {
                newString += "$"
            }
        } else if (each == "\r") { // special because it screws up CRLF vs LF and makes the file look like a binary file
            newString += "\\r"
        // sequences that dont need to be escaped
        } else if (each == "\b"||each == "\t"||each == "\n"||each == "\v"||each=="\f") { // note: \r is the only one missing, which is intentional because it causes problems: https://262.ecma-international.org/13.0/#sec-ecmascript-data-types-and-values
            newString += each
        } else if (each.codePointAt(0) < 0x7F) {
            newString += each
        } else {
            const stringified = JSON.stringify(each)
            if (stringified.length > 4) { // unicode escape needed, "\\n".length == 4
                newString += stringified.slice(1,-1) // slices off the double quote, and the first of two backslashes
            } else {
                newString += each
            }
        }
    }
    return newString +"`"
}

let string = stringToBacktickRepresentation(firstLine+"\n"+content+"\n"+lastRealLine+"\n")
string = string.replace(/DENO_VERSION_HERE/g,"${denoVersion}")
string = string.replace(/UNIX_DENO_ARGS_HERE/g, "${argsForUnix}")
string = string.replace(/DENO_WINDOWS_ARGS_HERE/g, "${argsForWindows}")
string = string.replace('#> echo "${denoVersion}"', '#>\necho "${denoVersion}"')
await FileSystem.write({
    data: "export default ({denoVersion, argsForUnix, argsForWindows}) => "+string,
    path: "./main/inlined.js",
})
console.log("done: ./main/inlined.js")