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
    const newHeader = `#!/usr/bin/env sh
"\\"",\`$(echo --% ' |out-null)" >$null;function :{};function dv{<#\${/*'>/dev/null )\` 2>/dev/null;dv() { #>
echo "${denoVersion}"; : --% ' |out-null <#'; }; deno_version="$(dv)"; deno="$HOME/.deno/$deno_version/bin/deno"; if [ -x "$deno" ];then  exec "$deno" run ${argsForUnix} "$0" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run ${argsForUnix} "$0" "$@";  fi; has () { command -v "$1" >/dev/null; };  set -e;  if ! has unzip && ! has 7z; then echo "Can I try to install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" =~ ^[Yy] ]; then  if ! has brew; then  brew install unzip; elif has apt-get; then if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "I'm going to try sudo apt install unzip";read ANSWER;echo;  sudo apt-get install unzip -y;  elif has doas; then  echo "I'm going to try doas apt install unzip";read ANSWER;echo;  doas apt-get install unzip -y;  else apt-get install unzip -y;  fi;  fi;  fi;   if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  fi;   if ! has unzip && ! has 7z; then echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2; exit 1; fi;  if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") target="aarch64-unknown-linux-gnu" ;; *) target="x86_64-unknown-linux-gnu" ;; esac fi;  print_help_and_exit() { echo "Setup script for installing deno  Options: -y, --yes Skip interactive prompts and accept defaults --no-modify-path Don't add deno to the PATH environment variable -h, --help Print help " echo "Note: Deno was not installed"; exit 0; };  for arg in "$@"; do case "$arg" in "-h") print_help_and_exit ;; "--help") print_help_and_exit ;; "-"*) ;; *) if [ -z "$deno_version" ]; then deno_version="$arg"; fi ;; esac done; if [ -z "$deno_version" ]; then deno_version="$(curl -s https://dl.deno.land/release-latest.txt)"; fi;  deno_uri="https://dl.deno.land/release/v\${deno_version}/deno-\${target}.zip"; deno_install="\${DENO_INSTALL:-$HOME/.deno/$deno_version}"; bin_dir="$deno_install/bin"; exe="$bin_dir/deno";  if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if has curl; then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; elif has wget; then wget --output-document="$exe.zip" "$deno_uri"; else echo "Error: curl or wget is required to download Deno (see: https://github.com/denoland/deno_install )." 1>&2; fi;  if has unzip; then unzip -d "$bin_dir" -o "$exe.zip"; else 7z x -o"$bin_dir" -y "$exe.zip"; fi; chmod +x "$exe"; rm "$exe.zip";  echo "Deno was installed successfully to $exe";  run_shell_setup() { $exe run -A --reload jsr:@deno/installer-shell-setup/bundled "$deno_install" "$@"; };  if [ -z "$CI" ] && [ -t 1 ] && $exe eval 'const [major, minor] = Deno.version.deno.split("."); if (major < 2 && minor < 42) Deno.exit(1)'; then if [ -t 0 ]; then run_shell_setup "$@"; else run_shell_setup "$@" </dev/tty; fi fi; if command -v deno >/dev/null; then echo "Run 'deno --help' to get started"; else echo "Run '$exe --help' to get started"; fi; echo; echo "Stuck? Join our Discord https://discord.gg/deno";  #>}; $DenoInstall = "\${HOME}/.deno/$(dv)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;  $User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run ${argsForWindows} "$PSCommandPath" @args; Exit $LastExitCode; <# 
# */0}\`;
`
    
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