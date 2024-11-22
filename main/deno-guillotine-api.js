import * as Path from "https://deno.land/std@0.128.0/path/mod.ts"
import { pathPieces } from "https://deno.land/x/good@1.7.1.1/flattened/path_pieces.js"
import generateHeader from "./inlined.js"

const specialCharPattern = /\s|\\|\"|'|`|#|\$|%|&|;|\*|\(|\)|\[|\]|\{|\}|,|<|>|\?|@|\^|\||~/
const shellEscape = (arg)=>`'${arg.replace(/'/g,`'"'"'`)}'`

export function enhanceScript({filePath, jsFileContent, denoVersion, additionalArgs, additionalArgsForUnix, additionalArgsForWindows, baseArgs=["-q", "-A", "--no-lock", "--no-config"], }) {
    // 
    // validate parameters
    // 
    const nonStringArgs = Object.entries({filePath,jsFileContent,denoVersion}).filter(
        ([name, arg])=>typeof arg != "string"
    ).map(
        ([name, arg])=>name
    )
    if (nonStringArgs.length > 0) {
        throw new Error(`\n\nFor Deno Guillotine, I got arguments ${JSON.stringify(nonStringArgs)} that needed to be strings but were not`)
    }
    
    // 
    // validate special characters in CLI arguments
    // 
    for (const each of [...additionalArgs, ...baseArgs]) {
        let match = each.match(specialCharPattern)
        if (match) {
            throw new Error(`\n\nFor Deno Guillotine, I got a CLI argument for the script that contains a special character: ${match[0]}\nThis is a problem because the character behaves differently on windows/non-windows.\n\nHowever, you can still add the argument. You'll simply need to specify both the --additionalArgsForUnix and --additionalArgsForWindows individually.\n\nNOTE! On unix/not-windows, args will be be passed as strings. But on windows, the arguments are passed as-is to powershell (AKA they are evaled as code). %THING for windows would expand the THING variable, while on unix it would simply be the string "%THING". \nThis is because its impossible to reliably/generically escape arguments on windows.`)
        }
    }
    
    // 
    // get filePathNameNoExt
    // 
    let filePathNameNoExt = Path.basename(filePath)
    if (filePathNameNoExt.includes(".")) { 
        filePathNameNoExt = filePathNameNoExt.split(".").slice(0,-1).join(".")
    }
    const [ folders, itemName, itemExtensionWithDot ] = pathPieces(filePath)
    const normalPath = `${folders.join('/')}/${itemName}`
    const ps1Path = `${folders.join('/')}/${itemName}.ps1`
    
    // 
    // setup CLI args
    // 
    const denoVersionList = denoVersion.split(".").map(each=>each-0)
    const [ major, minor, patch, ...rest ] = denoVersionList
    const supportsNoLock = major > 1 || (major == 1 && (minor > 27 || minor == 27 && patch > 1))
    const supportsNoConfig = major > 1 || (major == 1 || (minor > 21))
    if (!supportsNoLock) {
        baseArgs = baseArgs.filter(each=>each != "--no-lock")
    }
    if (!supportsNoConfig) {
        baseArgs = baseArgs.filter(each=>each != "--no-config")
    }
    const argsForUnix = [ ...baseArgs, ...additionalArgs.map(shellEscape), ...additionalArgsForUnix.map(shellEscape) ].join(" ")
    const argsForWindows = [ ...baseArgs, ...additionalArgs, ...additionalArgsForWindows ].join(" ")
    // 
    // header
    // 
    const newHeader = generateHeader({denoVersion, argsForUnix, argsForWindows})
    
    // 
    // modify contents
    // 
    let newContents = jsFileContent
    // remove the tail if any
    newContents = newContents.replace(/\n\/\/ \(this comment is part of deno-guillotine, dont remove\) #>/g,"")
    // remove normal shebang if needed 
    newContents = newContents.replace(/^#!\/usr\/bin\/env -S deno.+\n/,"")
    // remove the old head if any
    newContents = newContents.replace(/#!\/usr\/bin\/env sh(\w|\W)+?\n# *\*\/0\}`;\n/,"")
    // escape the body
    newContents = newContents.replace(/#>/g,"#\\>") // escape any uses of "#>"
    // add back head and tail
    newContents = newHeader + newContents + "\n// (this comment is part of deno-guillotine, dont remove) #>"    

    return {
        symlinkPath: `./${filePathNameNoExt}.ps1`,
        normalPath,
        ps1Path,
        newContents,
    }
}