import * as Path from "https://deno.land/std@0.128.0/path/mod.ts"
import { pathPieces } from "https://deno.land/x/good@1.7.1.1/flattened/path_pieces.js"

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
    const supportsNoLock = (major > 0 && (minor > 27 || minor == 27 && patch > 1))
    const supportsNoConfig = (major > 0 || (minor > 21))
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
    const newHeader = `#!/usr/bin/env sh
"\\"",\`$(echo --% ' |out-null)" >$null;function :{};function dv{<#\${/*'>/dev/null )\` 2>/dev/null;dv() { #>
echo "${denoVersion}"; : --% ' |out-null <#'; }; version="$(dv)"; deno="$HOME/.deno/$version/bin/deno"; if [ -x "$deno" ]; then  exec "$deno" run ${argsForUnix} "$0" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run ${argsForUnix} "$0" "$@";  fi; bin_dir="$HOME/.deno/$version/bin"; exe="$bin_dir/deno"; has () { command -v "$1" >/dev/null; } ;  if ! has unzip; then if ! has apt-get; then  has brew && brew install unzip; else  if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  sudo apt-get install unzip -y; fi; elif has doas; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  doas apt-get install unzip -y; fi; fi;  fi;  fi;  if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  repo="denoland/deno"; if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else :;  case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") repo="LukeChannings/deno-arm64" target="linux-arm64" ;; "Linux armhf") echo "deno sadly doesn't support 32-bit ARM. Please check your hardware and possibly install a 64-bit operating system." exit 1 ;; *) target="x86_64-unknown-linux-gnu" ;; esac; fi; deno_uri="https://github.com/$repo/releases/download/v$version/deno-$target.zip"; exe="$bin_dir/deno"; if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if ! curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; then if ! wget --output-document="$exe.zip" "$deno_uri"; then echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them. Please install one of them, otherwise I have no way to install the missing deno version needed to run this code"; exit 1; fi; fi; unzip -d "$bin_dir" -o "$exe.zip"; chmod +x "$exe"; rm "$exe.zip"; exec "$deno" run ${argsForUnix} "$0" "$@"; #>}; $DenoInstall = "\${HOME}/.deno/$(dv)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;  $User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run ${argsForWindows} "$PSCommandPath" @args; Exit $LastExitCode; <# 
# */0}\`;\n`
    
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