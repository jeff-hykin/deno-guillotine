#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
        echo "DENO_VERSION_HERE"; : --% ' |out-null <#';
    };
    deno_version="$(dv)";
    deno="$HOME/.deno/$deno_version/bin/deno";
    # 
    # try to run immediately
    # 
    if [ -x "$deno" ];then 
        exec "$deno" run UNIX_DENO_ARGS_HERE "$0" "$@"; 
    # if not executable, try to make it executable then run ASAP
    elif [ -f "$deno" ]; then 
        chmod +x "$deno" && exec "$deno" run UNIX_DENO_ARGS_HERE "$0" "$@";
    fi;
    # 
    # if the user doesn't have it, install deno
    # 
    has () {
        command -v "$1" >/dev/null;
    }; 
    set -e;
    
    # try to install unzip for the user if its missing
    if ! has unzip && ! has 7z; then
        echo "Can I try to install unzip for you? (its required for this command to work) ";read ANSWER;echo; 
        if [ "$ANSWER" =~ ^[Yy] ]; then 
            if ! has brew; then 
                brew install unzip;
            elif has apt-get; then
                if [ "$(whoami)" = "root" ]; then 
                    apt-get install unzip -y;
                elif has sudo; then 
                    echo "I'm going to try sudo apt install unzip";read ANSWER;echo; 
                    sudo apt-get install unzip -y; 
                elif has doas; then 
                    echo "I'm going to try doas apt install unzip";read ANSWER;echo; 
                    doas apt-get install unzip -y; 
                else apt-get install unzip -y; 
                fi; 
            fi; 
        fi; 
        
        # if still doesn't have unzip somehow
        if ! has unzip; then 
            echo "";
            echo "So I couldn't find an 'unzip' command";
            echo "And I tried to auto install it, but it seems that failed";
            echo "(This script needs unzip and either curl or wget)";
            echo "Please install the unzip command manually then re-run this script";
            exit 1; 
        fi; 
    fi;
    
    
    if ! has unzip && ! has 7z; then
        echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2;
        exit 1;
    fi;

    if [ "$OS" = "Windows_NT" ]; then
        target="x86_64-pc-windows-msvc";
    else
        case $(uname -sm) in
        "Darwin x86_64") target="x86_64-apple-darwin" ;;
        "Darwin arm64") target="aarch64-apple-darwin" ;;
        "Linux aarch64") target="aarch64-unknown-linux-gnu" ;;
        *) target="x86_64-unknown-linux-gnu" ;;
        esac
    fi;

    print_help_and_exit() {
        echo "Setup script for installing deno

    Options:
    -y, --yes
        Skip interactive prompts and accept defaults
    --no-modify-path
        Don't add deno to the PATH environment variable
    -h, --help
        Print help
    "
        echo "Note: Deno was not installed";
        exit 0;
    };

    # Simple arg parsing - look for help flag, otherwise
    # ignore args starting with '-' and take the first
    # positional arg as the deno version to install
    for arg in "$@"; do
        case "$arg" in
        "-h")
            print_help_and_exit
            ;;
        "--help")
            print_help_and_exit
            ;;
        "-"*) ;;
        *)
            if [ -z "$deno_version" ]; then
                deno_version="$arg";
            fi
            ;;
        esac
    done;
    if [ -z "$deno_version" ]; then
        deno_version="$(curl -s https://dl.deno.land/release-latest.txt)";
    fi;

    deno_uri="https://dl.deno.land/release/v${deno_version}/deno-${target}.zip";
    deno_install="${DENO_INSTALL:-$HOME/.deno/$deno_version}";
    bin_dir="$deno_install/bin";
    exe="$bin_dir/deno";

    if [ ! -d "$bin_dir" ]; then
        mkdir -p "$bin_dir";
    fi;
    
    if has curl; then
        curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";
    elif has wget; then
        wget --output-document="$exe.zip" "$deno_uri";
    else
        echo "Error: curl or wget is required to download Deno (see: https://github.com/denoland/deno_install )." 1>&2;
    fi;
    
    if has unzip; then
        unzip -d "$bin_dir" -o "$exe.zip";
    else
        7z x -o"$bin_dir" -y "$exe.zip";
    fi;
    chmod +x "$exe";
    rm "$exe.zip";
    
    exec "$deno" run UNIX_DENO_ARGS_HERE "$0" "$@";

    # echo "Deno was installed successfully to $exe";

    # run_shell_setup() {
    #     "$exe" run -A --reload "https://esm.sh/jsr/@deno/installer-shell-setup@0.3.1/bundled.esm.js" --yes --no-modify-path "$deno_install" "$@";
    # };

    # # If stdout is a terminal, see if we can run shell setup script (which includes interactive prompts)
    # if [ -z "$CI" ] && [ -t 1 ] && $exe eval 'const [major, minor] = Deno.version.deno.split("."); if (major < 2 && minor < 42) Deno.exit(1)'; then
    #     if [ -t 0 ]; then
    #         run_shell_setup "$@";
    #     else
    #         # This script is probably running piped into sh, so we don't have direct access to stdin.
    #         # Instead, explicitly connect /dev/tty to stdin
    #         run_shell_setup "$@" </dev/tty;
    #     fi
    # fi;
    # if command -v deno >/dev/null; then
    #     echo "Run 'deno --help' to get started";
    # else
    #     echo "Run '$exe --help' to get started";
    # fi;
    # echo;
    # echo "Stuck? Join our Discord https://discord.gg/deno";

    # 
    # powershell portion
    # 
#>};
    $DenoInstall = "${HOME}/.deno/$(dv)";
    $BinDir = "$DenoInstall/bin";
    $DenoExe = "$BinDir/deno.exe";
    if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) {
        $DenoZip = "$BinDir/deno.zip";
        $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";

        # GitHub requires TLS 1.2
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;

        if (!(Test-Path $BinDir)) {
            New-Item $BinDir -ItemType Directory | Out-Null;
        };
        
        Function Test-CommandExists {
            Param ($command);
            $oldPreference = $ErrorActionPreference;
            $ErrorActionPreference = "stop";
            try {if(Get-Command "$command"){RETURN $true}}
            Catch {Write-Host "$command does not exist"; RETURN $false};
            Finally {$ErrorActionPreference=$oldPreference};
        };
        
        if (Test-CommandExists curl) {
            curl -Lo $DenoZip $DenoUri;
        } else {
            curl.exe -Lo $DenoZip $DenoUri;
        };
        
        if (Test-CommandExists curl) {
            tar xf $DenoZip -C $BinDir;
        } else {
            tar -Lo $DenoZip $DenoUri;
        };
        
        Remove-Item $DenoZip;

        $User = [EnvironmentVariableTarget]::User;
        $Path = [Environment]::GetEnvironmentVariable('Path', $User);
        if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) {
            [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User);
            $Env:Path += ";$BinDir";
        }
    }; & "$DenoExe" run DENO_WINDOWS_ARGS_HERE "$PSCommandPath" @args; Exit $LastExitCode; <#
# */0}`;
console.log("Hello World")
// #>