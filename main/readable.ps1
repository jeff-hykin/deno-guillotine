#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
        echo "1.24.0"; : --% ' |out-null <#';
    };
    version="$(dv)";
    deno="$HOME/.deno/$version/bin/deno";
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
    # try to install unzip for the user if its missing
    if ! has unzip; then
        if ! has apt-get; then 
            has brew && brew install unzip;
        else 
            if [ "$(whoami)" = "root" ]; then 
                apt-get install unzip -y;
            elif has sudo; then 
                echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo; 
                if [ "$ANSWER" =~ ^[Yy] ]; then 
                    sudo apt-get install unzip -y;
                fi;
            elif has doas; then 
                echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo; 
                if [ "$ANSWER" =~ ^[Yy] ]; then 
                    doas apt-get install unzip -y;
                fi;
            fi; 
        fi; 
    fi; 
    # if still doesn't have unzip
    if ! has unzip; then 
        echo "";
        echo "So I couldn't find an 'unzip' command";
        echo "And I tried to auto install it, but it seems that failed";
        echo "(This script needs unzip and either curl or wget)";
        echo "Please install the unzip command manually then re-run this script";
        exit 1; 
    fi; 
    if [ "$OS" = "Windows_NT" ]; then
        target="x86_64-pc-windows-msvc";
    else 
        :; # do-nothing command (otherwise one-lining this code breaks)
        case $(uname -sm) in
            "Darwin x86_64") target="x86_64-apple-darwin" ;; 
            "Darwin arm64") target="aarch64-apple-darwin" ;;
            *) target="x86_64-unknown-linux-gnu" ;;
        esac;
    fi; 
    deno_uri="https://github.com/denoland/deno/releases/download/v$version/deno-$target.zip";
    if [ ! -d "$bin_dir" ]; then
        mkdir -p "$bin_dir"; 
    fi; 
    if has curl; then 
        curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";
    elif has wget; then 
        wget --output-document="$exe.zip" "$deno_uri";
    else
        echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them.";
        echo "Please install one of them";
        echo "Otherwise I have no way to install the missing deno version needed to run this code"; 
    fi;
    unzip -d "$bin_dir" -o "$exe.zip";
    chmod +x "$exe";
    rm "$exe.zip"; 
    exec "$deno" run -q -A "$0" "$@";
    # 
#>};# powershell portion
    # 
    $DenoInstall = "${HOME}\.deno\$(dv)";
    $BinDir = "$DenoInstall\bin";
    $DenoExe = "$BinDir\deno.exe";
    if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) {
        $DenoZip = "$BinDir\deno.zip";
        $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";

        # GitHub requires TLS 1.2
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;

        if (!(Test-Path $BinDir)) {
            New-Item $BinDir -ItemType Directory | Out-Null;
        }

        curl.exe -Lo $DenoZip $DenoUri;
        tar.exe xf $DenoZip -C $BinDir;
        Remove-Item $DenoZip;

        $User = [EnvironmentVariableTarget]::User;
        $Path = [Environment]::GetEnvironmentVariable('Path', $User);
        if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) {
            [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User);
            $Env:Path += ";$BinDir";
        }
    }; & "$DenoExe" run -q -A "$PSCommandPath" @args; Exit $LastExitCode
# */0}`;
console.log("Hello World")