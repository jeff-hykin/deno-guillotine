#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
echo "1.22.0"; : --% ' |out-null <#';};v="$(dv)";d="$HOME/.deno/$v/bin/deno";if [ -x "$d" ];then exec "$d" run -q -A "$0" "$@";elif [ -f "$d" ];then chmod +x "$d" && exec "$d" run -q -A "$0" "$@";fi;bin_dir="$HOME/.deno/$v/bin";exe="$bin_dir/deno";has() { command -v "$1" >/dev/null; };if ! has unzip;then :;if ! has apt-get;then has brew && brew install unzip;else if [ "$(whoami)" = "root" ];then apt-get install unzip -y;elif has sudo;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then sudo apt-get install unzip -y;fi;elif has doas;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then doas apt-get install unzip -y;fi;fi;fi;fi;if ! has unzip;then echo "";echo "So I couldn't find an 'unzip' command";echo "And I tried to auto install it, but it seems that failed";echo "(This script needs unzip and either curl or wget)";echo "Please install the unzip command manually then re-run this script";exit 1;fi;if [ "$OS" = "Windows_NT" ];then target="x86_64-pc-windows-msvc";else :; case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; *) target="x86_64-unknown-linux-gnu" ;; esac;fi;deno_uri="https://github.com/denoland/deno/releases/download/v$v/deno-$target.zip";if [ ! -d "$bin_dir" ];then mkdir -p "$bin_dir";fi;if has curl;then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";elif has wget;then wget --output-document="$exe.zip" "$deno_uri";else echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them.";echo "Please install one of them";echo "Otherwise I have no way to install the missing deno version needed to run this code";fi;unzip -d "$bin_dir" -o "$exe.zip";chmod +x "$exe";rm "$exe.zip";exec "$d" run -q -A "$0" "$@"; #>};$DenoInstall = "${HOME}\.deno$(dv)";$BinDir = "$DenoInstall\bin"; $DenoExe = "$BinDir\deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir\deno.zip";$DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12;if(!(Test-Path $BinDir)){ New-Item $BinDir -ItemType Directory |Out-Null;};curl.exe -Lo $DenoZip $DenoUri;tar.exe xf $DenoZip -C $BinDir; Remove-Item $DenoZip;$User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run -q -A "$PSCommandPath" @args; Exit $LastExitCode;# */0}`;
import { FileSystem } from "https://deno.land/x/quickr@0.3.44/main/file_system.js"

const currentLatestVersion = `${Deno.version.deno}`
const path = Deno.args[0]
const version = Deno.args[1] || currentLatestVersion
const info = await FileSystem.info(path)
if (!info.exists) {
    console.log(`Hey! the file you gave me doesn't seem to exist: ${path}`)
    Deno.exit(1)
}

const [ folders, itemName, itemExtensionWithDot ] = FileSystem.pathPieces(path)
const contents = await FileSystem.read(path)
const newHeader = `#!/usr/bin/env sh
"\\"",\`$(echo --% ' |out-null)" >$null;function :{};function dv{<#\${/*'>/dev/null )\` 2>/dev/null;dv() { #>
echo "${version}"; : --% ' |out-null <#';};v="$(dv)";d="$HOME/.deno/$v/bin/deno";if [ -x "$d" ];then exec "$d" run -q -A "$0" "$@";elif [ -f "$d" ];then chmod +x "$d" && exec "$d" run -q -A "$0" "$@";fi;bin_dir="$HOME/.deno/$v/bin";exe="$bin_dir/deno";has() { command -v "$1" >/dev/null; };if ! has unzip;then :;if ! has apt-get;then has brew && brew install unzip;else if [ "$(whoami)" = "root" ];then apt-get install unzip -y;elif has sudo;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then sudo apt-get install unzip -y;fi;elif has doas;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then doas apt-get install unzip -y;fi;fi;fi;fi;if ! has unzip;then echo "";echo "So I couldn't find an 'unzip' command";echo "And I tried to auto install it, but it seems that failed";echo "(This script needs unzip and either curl or wget)";echo "Please install the unzip command manually then re-run this script";exit 1;fi;if [ "$OS" = "Windows_NT" ];then target="x86_64-pc-windows-msvc";else :; case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; *) target="x86_64-unknown-linux-gnu" ;; esac;fi;deno_uri="https://github.com/denoland/deno/releases/download/v$v/deno-$target.zip";if [ ! -d "$bin_dir" ];then mkdir -p "$bin_dir";fi;if has curl;then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";elif has wget;then wget --output-document="$exe.zip" "$deno_uri";else echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them.";echo "Please install one of them";echo "Otherwise I have no way to install the missing deno version needed to run this code";fi;unzip -d "$bin_dir" -o "$exe.zip";chmod +x "$exe";rm "$exe.zip";exec "$d" run -q -A "$0" "$@"; #>};$DenoInstall = "\${HOME}\\.deno\$(dv)";$BinDir = "$DenoInstall\\bin"; $DenoExe = "$BinDir\\deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir\\deno.zip";$DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12;if(!(Test-Path $BinDir)){ New-Item $BinDir -ItemType Directory |Out-Null;};curl.exe -Lo $DenoZip $DenoUri;tar.exe xf $DenoZip -C $BinDir; Remove-Item $DenoZip;$User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run -q -A "$PSCommandPath" @args; Exit $LastExitCode;# */0}\`;
`

const normalPath = `${folders.join('/')}/${itemName}`
const ps1Path = `${folders.join('/')}/${itemName}.ps1`

// 
// add header if needed
// 
console.log("Adding header")
const newContents = contents.startsWith(newHeader) ? contents : newHeader+contents

// 
// make sure ps1 version exists
// 
console.log(`Creating ${ps1Path}`)
await FileSystem.write({
    data: newHeader+contents,
    path: ps1Path,
    overwrite:true,
})
console.log(`Setting ${ps1Path} permissions`)
try {
    await FileSystem.addPermissions({
        path: ps1Path,
        permissions: {
            owner:{
                canExecute: true,
            },
            group:{
                canExecute: true,
            },
            others:{
                canExecute: true,
            }
        }
    })
} catch (error) {
    if (Deno.build.os != 'windows') {
        console.warn(`I was unable to make this file an executable, just fyi: ${ps1Path}`)
    }
}


// 
// link the other version to it
// 
console.log(`Creating ${normalPath}`)
await FileSystem.relativeLink({
    existingItem: ps1Path,
    newItem: normalPath,
    overwrite:true,
})
console.log(`Setting ${normalPath} permissions`)
try {
    await FileSystem.addPermissions({
        path: normalPath,
        permissions: {
            owner:{
                canExecute: true,
            },
            group:{
                canExecute: true,
            },
            others:{
                canExecute: true,
            }
        }
    })
} catch (error) {
    if (Deno.build.os != 'windows') {
        console.warn(`I was unable to make this file an executable, just fyi: ${normalPath}`)
    }
}
console.log(`Done! ✅`)
console.log(`try doing:`)
console.log(`    cd ${FileSystem.pwd}`)
console.log(`    ./${normalPath}`)