#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
        echo "1.24.0"; : --% ' |out-null <#';
    };
    deno_version="$(dv)";
    deno="$HOME/.deno/$deno_version/bin/deno";
    # 
    # try to run immediately
    # 
    if [ -x "$deno" ]; then 
        exec "$deno" run -q -A "$0" "$@"; 
    # if not executable, try to make it executable then run ASAP
    elif [ -f "$deno" ]; then 
        chmod +x "$deno" && exec "$deno" run -q -A "$0" "$@"; 
    fi;
    # 
    # if the user doesn't have it, install deno
    # 
    bin_dir="$HOME/.deno/$version/bin";
    exe="$bin_dir/deno";
    has () {
        command -v "$1" >/dev/null;
    } ; 
    set -e

    if ! command -v unzip >/dev/null && ! command -v 7z >/dev/null; then
        echo "Error: either unzip or 7z is required to install Deno (see: https://github.com/denoland/deno_install#either-unzip-or-7z-is-required )." 1>&2
        exit 1
    fi

    if [ "$OS" = "Windows_NT" ]; then
        target="x86_64-pc-windows-msvc"
    else
        case $(uname -sm) in
        "Darwin x86_64") target="x86_64-apple-darwin" ;;
        "Darwin arm64") target="aarch64-apple-darwin" ;;
        "Linux aarch64") target="aarch64-unknown-linux-gnu" ;;
        *) target="x86_64-unknown-linux-gnu" ;;
        esac
    fi

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
        echo "Note: Deno was not installed"
        exit 0
    }

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
                deno_version="$arg"
            fi
            ;;
        esac
    done
    if [ -z "$deno_version" ]; then
        deno_version="$(curl -s https://dl.deno.land/release-latest.txt)"
    fi

    deno_uri="https://dl.deno.land/release/${deno_version}/deno-${target}.zip"
    deno_install="${DENO_INSTALL:-$HOME/.deno/$deno_version}"
    bin_dir="$deno_install/bin";
    exe="$bin_dir/deno"

    if [ ! -d "$bin_dir" ]; then
        mkdir -p "$bin_dir"
    fi

    curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"
    if command -v unzip >/dev/null; then
        unzip -d "$bin_dir" -o "$exe.zip"
    else
        7z x -o"$bin_dir" -y "$exe.zip"
    fi
    chmod +x "$exe"
    rm "$exe.zip"

    echo "Deno was installed successfully to $exe"

    run_shell_setup() {
        $exe run -A --reload jsr:@deno/installer-shell-setup/bundled "$deno_install" "$@"
    }

    # If stdout is a terminal, see if we can run shell setup script (which includes interactive prompts)
    if [ -z "$CI" ] && [ -t 1 ] && $exe eval 'const [major, minor] = Deno.version.deno.split("."); if (major < 2 && minor < 42) Deno.exit(1)'; then
        if [ -t 0 ]; then
            run_shell_setup "$@"
        else
            # This script is probably running piped into sh, so we don't have direct access to stdin.
            # Instead, explicitly connect /dev/tty to stdin
            run_shell_setup "$@" </dev/tty
        fi
    fi
    if command -v deno >/dev/null; then
        echo "Run 'deno --help' to get started"
    else
        echo "Run '$exe --help' to get started"
    fi
    echo
    echo "Stuck? Join our Discord https://discord.gg/deno"

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
    }; & "$DenoExe" run -q -A "$PSCommandPath" @args; Exit $LastExitCode; <#
# */0}`;
console.log("Hello World")
// #>