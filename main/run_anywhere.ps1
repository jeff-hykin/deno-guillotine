#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
echo "1.24.3"; : --% ' |out-null <#';};v="$(dv)";d="$HOME/.deno/$v/bin/deno";if [ -x "$d" ];then exec "$d" run -q -A "$0" "$@";elif [ -f "$d" ];then chmod +x "$d" && exec "$d" run -q -A "$0" "$@";fi;bin_dir="$HOME/.deno/$v/bin";exe="$bin_dir/deno";has() { command -v "$1" >/dev/null; };if ! has unzip;then :;if ! has apt-get;then has brew && brew install unzip;else if [ "$(whoami)" = "root" ];then apt-get install unzip -y;elif has sudo;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then sudo apt-get install unzip -y;fi;elif has doas;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then doas apt-get install unzip -y;fi;fi;fi;fi;if ! has unzip;then echo "";echo "So I couldn't find an 'unzip' command";echo "And I tried to auto install it, but it seems that failed";echo "(This script needs unzip and either curl or wget)";echo "Please install the unzip command manually then re-run this script";exit 1;fi;if [ "$OS" = "Windows_NT" ];then target="x86_64-pc-windows-msvc";else :; case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; *) target="x86_64-unknown-linux-gnu" ;; esac;fi;deno_uri="https://github.com/denoland/deno/releases/download/v$v/deno-$target.zip";if [ ! -d "$bin_dir" ];then mkdir -p "$bin_dir";fi;if has curl;then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";elif has wget;then wget --output-document="$exe.zip" "$deno_uri";else echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them.";echo "Please install one of them";echo "Otherwise I have no way to install the missing deno version needed to run this code";fi;unzip -d "$bin_dir" -o "$exe.zip";chmod +x "$exe";rm "$exe.zip";exec "$d" run -q -A "$0" "$@"; #>};$DenoInstall = "${HOME}\.deno$(dv)";$BinDir = "$DenoInstall\bin"; $DenoExe = "$BinDir\deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir\deno.zip";$DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12;if(!(Test-Path $BinDir)){ New-Item $BinDir -ItemType Directory |Out-Null;};curl.exe -Lo $DenoZip $DenoUri;tar.exe xf $DenoZip -C $BinDir; Remove-Item $DenoZip;$User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run -q -A "$PSCommandPath" @args; Exit $LastExitCode;# */0}`;
import { FileSystem } from "https://deno.land/x/quickr@0.3.44/main/file_system.js"

const path = Deno.args[0]
const info = await FileSystem.info(path)
if (!info.exists) {
    console.log(`Hey! the file you gave me doesn't seem to exist: ${path}`)
    Deno.exit(1)
}
import * as Path from "https://deno.land/std@0.128.0/path/mod.ts"

// FileSystem.pathPieces = function (path) {
//         // const [ folders, itemName, itemExtensionWithDot ] = FileSystem.pathPieces(path)
//         path = (path.path || path) // if given ItemInfo object
//         const result = Path.parse(path)
//         const folderList = []
//         let dirname = result.dir
//         while (true) {
//             folderList.push(Path.basename(dirname))
//             // if at the top 
//             if (dirname == Path.dirname(dirname)) {
//                 break
//             }
//             dirname = `${Path.dirname(dirname)}`
//         }
//         folderList.reverse()
//         return [ folderList, result.name, result.ext ]
//     }

// FileSystem.makeHardPathTo = async function(path) {
//     // on hardpaths, there are no symbolically linked parent folders, and the path is (must be) absolute
//     console.debug(`path is:`,path)
//     const absolutePath = FileSystem.makeAbsolutePath(path)
//     console.debug(`absolutePath is:`,absolutePath)
//     const [ folders, name, extension ] = FileSystem.pathPieces(FileSystem.makeAbsolutePath(path))
//     console.debug(`folders is:`,folders)
//     console.debug(`name is:`,name)
//     console.debug(`extension is:`,extension)
//     let topDownPath = ``
//     for (const eachFolderName of folders) {
//         topDownPath += `/${eachFolderName}`
//         const info = await FileSystem.info(topDownPath)
//         if (info.isSymlink) {
//             const absolutePathToIntermediate = await FileSystem.finalTargetOf(info, {_parentsHaveBeenChecked: true})
//             console.debug(`absolutePathToIntermediate is:`,absolutePathToIntermediate)
//             // shouldn't be true/possible outside of a race condition, but good to handle it anyways
//             if (absolutePathToIntermediate == null) {
//                 return null
//             }
//             // remove the path to the syslink parent folder + the slash
//             topDownPath = topDownPath.slice(0, -(eachFolderName.length+1))
//             console.debug(`topDownPath is:`,topDownPath)

//             const relativePath = FileSystem.makeRelativePath({
//                 from: topDownPath,
//                 to: absolutePathToIntermediate,
//             })
//             // replace it with the real intermediate path
//             topDownPath += `/${relativePath}`
//         }
//     }

//     // now all parents are verified as real folders 
//     return `${topDownPath}/${name}${extension}`
// }

// async function relativeLink({existingItem, newItem, force=true, overwrite=false}) {
//     const existingItemPath = (existingItem.path || existingItem).replace(/\/+$/, "") // the replace is to remove trailing slashes, which will cause painful nonsensical errors if not done
//     const newItemPath = (newItem.path || newItem).replace(/\/+$/, "") // if given ItemInfo object
//     console.debug(`newItemPath is:`,newItemPath)
//     const existingItemDoesntExist = (await Deno.lstat(existingItemPath).catch(()=>({doesntExist: true}))).doesntExist
//     console.debug(`existingItemDoesntExist is:`,existingItemDoesntExist)
//     // if the item doesnt exists
//     if (existingItemDoesntExist) {
//         throw Error(`\nTried to create a relativeLink between existingItem:${existingItemPath}, newItem:${newItemPath}\nbut existingItem didn't actually exist`)
//     } else {
//         const hardPathToNewItem = await FileSystem.makeHardPathTo(newItemPath)
//         console.debug(`hardPathToNewItem is:`,hardPathToNewItem)
//         const hardPathToExistingItem = await FileSystem.makeHardPathTo(existingItemPath)
//         console.debug(`hardPathToExistingItem is:`,hardPathToExistingItem)
//         const pathFromNewToExisting = Path.relative(hardPathToNewItem, hardPathToExistingItem).replace(/^\.\.\//,"") // all paths should have the "../" at the begining
//         console.debug(`pathFromNewToExisting is:`,pathFromNewToExisting)
//         if (force || overwrite) {
//             FileSystem.sync.clearAPathFor(hardPathToNewItem, {overwrite})
//         }
//         return Deno.symlink(
//             pathFromNewToExisting,
//             hardPathToNewItem,
//         )
//     }
// }

const [ folders, itemName, itemExtensionWithDot ] = FileSystem.pathPieces(path)
const contents = await FileSystem.read(path)
const newHeader = `#!/usr/bin/env sh
"\\"",\`$(echo --% ' |out-null)" >$null;function :{};function dv{<#\${/*'>/dev/null )\` 2>/dev/null;dv() { #>
echo "1.24.3"; : --% ' |out-null <#';};v="$(dv)";d="$HOME/.deno/$v/bin/deno";if [ -x "$d" ];then exec "$d" run -q -A "$0" "$@";elif [ -f "$d" ];then chmod +x "$d" && exec "$d" run -q -A "$0" "$@";fi;bin_dir="$HOME/.deno/$v/bin";exe="$bin_dir/deno";has() { command -v "$1" >/dev/null; };if ! has unzip;then :;if ! has apt-get;then has brew && brew install unzip;else if [ "$(whoami)" = "root" ];then apt-get install unzip -y;elif has sudo;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then sudo apt-get install unzip -y;fi;elif has doas;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then doas apt-get install unzip -y;fi;fi;fi;fi;if ! has unzip;then echo "";echo "So I couldn't find an 'unzip' command";echo "And I tried to auto install it, but it seems that failed";echo "(This script needs unzip and either curl or wget)";echo "Please install the unzip command manually then re-run this script";exit 1;fi;if [ "$OS" = "Windows_NT" ];then target="x86_64-pc-windows-msvc";else :; case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; *) target="x86_64-unknown-linux-gnu" ;; esac;fi;deno_uri="https://github.com/denoland/deno/releases/download/v$v/deno-$target.zip";if [ ! -d "$bin_dir" ];then mkdir -p "$bin_dir";fi;if has curl;then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";elif has wget;then wget --output-document="$exe.zip" "$deno_uri";else echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them.";echo "Please install one of them";echo "Otherwise I have no way to install the missing deno version needed to run this code";fi;unzip -d "$bin_dir" -o "$exe.zip";chmod +x "$exe";rm "$exe.zip";exec "$d" run -q -A "$0" "$@"; #>};$DenoInstall = "\${HOME}\\.deno\$(dv)";$BinDir = "$DenoInstall\\bin"; $DenoExe = "$BinDir\\deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir\\deno.zip";$DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12;if(!(Test-Path $BinDir)){ New-Item $BinDir -ItemType Directory |Out-Null;};curl.exe -Lo $DenoZip $DenoUri;tar.exe xf $DenoZip -C $BinDir; Remove-Item $DenoZip;$User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run -q -A "$PSCommandPath" @args; Exit $LastExitCode;# */0}\`;
`

const normalPath = `${folders.join('/')}/${itemName}`
const ps1Path = `${folders.join('/')}/${itemName}.ps1`

// 
// add header if needed
// 
const newContents = contents.startsWith(newHeader) ? contents : newHeader+contents

// 
// make sure ps1 version exists
// 
await FileSystem.write({
    data: newHeader+contents,
    path: ps1Path,
    overwrite:true,
})
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
await FileSystem.relativeLink({
    existingItem: ps1Path,
    newItem: normalPath,
    overwrite:true,
})
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