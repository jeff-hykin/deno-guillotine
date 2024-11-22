#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
echo "1.41.2"; : --% ' |out-null <#'; }; deno_version="$(dv)"; deno="$HOME/.deno/$deno_version/bin/deno"; if [ -x "$deno" ];then  exec "$deno" run -q -A --no-lock --no-config "$0" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run -q -A --no-lock --no-config "$0" "$@";  fi; has () { command -v "$1" >/dev/null; };  set -e;  if ! has unzip && ! has 7z; then echo "Can I try to install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" =~ ^[Yy] ]; then  if ! has brew; then  brew install unzip; elif has apt-get; then if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "I'm going to try sudo apt install unzip";read ANSWER;echo;  sudo apt-get install unzip -y;  elif has doas; then  echo "I'm going to try doas apt install unzip";read ANSWER;echo;  doas apt-get install unzip -y;  else apt-get install unzip -y;  fi;  fi;  fi;   if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  fi;   if ! has unzip && ! has 7z; then echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2; exit 1; fi;  if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") target="aarch64-unknown-linux-gnu" ;; *) target="x86_64-unknown-linux-gnu" ;; esac fi;  print_help_and_exit() { echo "Setup script for installing deno  Options: -y, --yes Skip interactive prompts and accept defaults --no-modify-path Don't add deno to the PATH environment variable -h, --help Print help " echo "Note: Deno was not installed"; exit 0; };  for arg in "$@"; do case "$arg" in "-h") print_help_and_exit ;; "--help") print_help_and_exit ;; "-"*) ;; *) if [ -z "$deno_version" ]; then deno_version="$arg"; fi ;; esac done; if [ -z "$deno_version" ]; then deno_version="$(curl -s https://dl.deno.land/release-latest.txt)"; fi;  deno_uri="https://dl.deno.land/release/${deno_version}/deno-${target}.zip"; deno_install="${DENO_INSTALL:-$HOME/.deno/$deno_version}"; bin_dir="$deno_install/bin"; exe="$bin_dir/deno";  if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if has curl; then echo "deno_uri:$deno_uri"; curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; elif has wget; then wget --output-document="$exe.zip" "$deno_uri"; else echo "Error: curl or wget is required to download Deno (see: https://github.com/denoland/deno_install )." 1>&2; fi;  if has unzip; then unzip -d "$bin_dir" -o "$exe.zip"; else 7z x -o"$bin_dir" -y "$exe.zip"; fi; chmod +x "$exe"; rm "$exe.zip";  echo "Deno was installed successfully to $exe";  run_shell_setup() { $exe run -A --reload jsr:@deno/installer-shell-setup/bundled "$deno_install" "$@"; };  if [ -z "$CI" ] && [ -t 1 ] && $exe eval 'const [major, minor] = Deno.version.deno.split("."); if (major < 2 && minor < 42) Deno.exit(1)'; then if [ -t 0 ]; then run_shell_setup "$@"; else run_shell_setup "$@" </dev/tty; fi fi; if command -v deno >/dev/null; then echo "Run 'deno --help' to get started"; else echo "Run '$exe --help' to get started"; fi; echo; echo "Stuck? Join our Discord https://discord.gg/deno";  #>}; $DenoInstall = "${HOME}/.deno/$(dv)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;  $User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run -q -A --no-lock --no-config "$PSCommandPath" @args; Exit $LastExitCode; <# 
# */0}`;
import { FileSystem } from "https://deno.land/x/quickr@0.6.67/main/file_system.js"
import { parseArgs, flag, required, initialValue } from "https://deno.land/x/good@1.7.1.0/flattened/parse_args.js"
import { toCamelCase } from "https://deno.land/x/good@1.7.1.0/flattened/to_camel_case.js"
import { didYouMean } from "https://deno.land/x/good@1.7.1.0/flattened/did_you_mean.js"

import { enhanceScript } from "./deno-guillotine-api.js"
import { version } from "./version.js"

// 
// check for help/version
// 
    const { help: showHelp, version: showVersion, } = parseArgs({
        rawArgs: Deno.args,
        fields: [
            [["--help", ], flag, ],
            [["--version"], flag, ],
        ],
    }).simplifiedNames
    if (showVersion) {
        console.log(version)
        Deno.exit(0)
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
            deno-guillotine --file ./your_file.js \\
                --add-arg '--no-npm' \\
                --add-arg '--unstable'
            
            deno-guillotine --file ./your_file.js \\
                --add-unix-arg '--unstable-ffi' \\
                --add-windows-arg '--unstable-cron'
            
            deno-guillotine --file ./your_file.js \\
                --no-default-args \\
                --add-arg '--quiet' \\
                --add-arg '--allow-read'
        `)
        Deno.exit(0)
    }

// 
// normal usage
// 
    const output = parseArgs({
        rawArgs: Deno.args,
        fields: [
            [[0, "--file",], required ],
            [[1, "--deno-version"], initialValue(`${Deno.version.deno}`), ],
            [["--no-default-args"], flag, ],
            [["--add-arg"], initialValue([]), ],
            [["--add-unix-arg"], initialValue([]), ],
            [["--add-windows-arg"], initialValue([]), ],
        ],
        nameTransformer: toCamelCase,
        namedArgsStopper: "--",
        allowNameRepeats: true,
        valueTransformer: JSON.parse,
        isolateArgsAfterStopper: false,
        argsByNameSatisfiesNumberedArg: true,
        implicitNamePattern: /^(--|-)[a-zA-Z0-9\-_]+$/,
        implictFlagPattern: null,
    })
    didYouMean({
        givenWords: Object.keys(output.implicitArgsByName).filter(each=>each.startsWith(`-`)),
        possibleWords: Object.keys(output.explicitArgsByName).filter(each=>each.startsWith(`-`)),
        autoThrow: true,
    })

    const {
        file: path,
        denoVersion,
        addArg : additionalArgs,
        addUnixArg: additionalArgsForUnix,
        addWindowsArg: additionalArgsForWindows, 
        noDefaultArgs,
    } = output.simplifiedNames

// 
// 
// main logic
//
// 
    // 
    // validate
    // 
    const fileDoenstExist = await Deno.lstat(path).catch(()=>({doesntExist: true})).doesntExist
    if (fileDoenstExist) {
        console.log(`Hey! the file you gave me doesn't seem to exist: ${path}`)
        Deno.exit(1)
    }

    // 
    // setup
    // 
    const contents = Deno.readTextFileSync(path)

    // 
    // enhance script
    // 
    const { newContents, symlinkPath, normalPath, ps1Path } = enhanceScript({
        filePath: path,
        jsFileContent: contents,
        denoVersion,
        additionalArgs:           typeof additionalArgs           === "string" ? [ additionalArgs ] : additionalArgs,
        additionalArgsForUnix:    typeof additionalArgsForUnix    === "string" ? [ additionalArgsForUnix ] : additionalArgsForUnix,
        additionalArgsForWindows: typeof additionalArgsForWindows === "string" ? [ additionalArgsForWindows ] : additionalArgsForWindows,
        baseArgs: noDefaultArgs ? [] : [ "-q", "-A", "--no-lock", "--no-config", ],
            // NOTE: no lock is given because differnt versions of deno can have different lock file formats
            //       meaning the script will fail to run with the spcified version of deno
            //       if another version of deno is installed
    })

    // 
    // make sure ps1 version exists
    // 
    console.log(`Creating ${ps1Path}`)
    await FileSystem.write({
        data: newContents,
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
    FileSystem.sync.remove(normalPath)
    Deno.symlinkSync(
        symlinkPath,
        normalPath,
        {
            type: "file",
        }
    )
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
    console.log(`    ./${normalPath}`.replace(/^    \.\/\.\//, "    ./"))

// (this comment is part of deno-guillotine, dont remove) #>