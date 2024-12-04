# What is this for?

Making cross platform scripts that have 0 install steps / instructions
- The user does not need to install Curl/Node/Deno, nor anything else
- The script does not need to "target" an OS; it is a single script, the same file for all OS's
- The script is not a binary and is not compiled/mangled; it is readable/editable JavaScript
- The script will not touch anything installed by the user (no pollution/side-effects)
- The script will auto-download a specific version of Deno to an isolated folder, and then run itself using that exact version of Deno to ensure consistent/reproducable behavior.
- Any Deno.land module can be imported/used, no need to reinvent the wheel or bundle code.

This is possible because of some rare builtin tools that allow for a single file to be valid bash, and valid powershell, AND valid JavaScript (based on this StackOverflow answer [Is it possible to write one script that runs in bash/shell and PowerShell?](https://stackoverflow.com/questions/39421131/is-it-possible-to-write-one-script-that-runs-in-bash-shell-and-powershell))

# How do I make an installer script?

1. Write a Deno script, lets call it `install.js`<br>
```js
console.log("Hello World")
```

2. Install this tool (guillotine) so it can modify your scripts to make them portable<br>
```shell
deno install -Afg https://deno.land/x/deno_guillotine/main/deno-guillotine.js
```

3. Use it:<br>
```shell
deno-guillotine ./your_script.js
# if you have a particular version of deno you want to use, include it as the second argument
deno-guillotine ./your_script.js 1.44.4
# if you want to add an deno-run argument like --no-npm do it like this:
deno-guillotine ./your_script.js --add-arg '--no-npm' --add-arg '--unstable'
```

4. Profit<br>
- `./install` (if thats the name of your script) will now run your script, even on Windows!
- There are some things to discuss though:
  - On Linux/Mac and other half-decent operating systems supported by Deno (incuding Arm Linux) there is no catch.
  - On Windows there is one catch; **a fresh Windows install will block execution of all powershell scripts by default**.<br>`Set-ExecutionPolicy unrestricted` will need to be run in an admin terminal before powershell scripts can be executed. After that, it follows the same process as the other operating systems (downloads the specific version of Deno if needed, and executes itself using that version).

- Two files are generated, but one is just a symlink, the other is the "real" file. We can get away with a single file (with some compromises):
  - Technically `install.ps1` is the only file needed. Typing `./install.ps1` on any OS will execute correctly.<br>However, I find the `.ps1` ugly. And the `.ps1` is only needed for Windows. The other file (the symlink) is what makes it possible to do `./install` on all systems:
    - On Windows, if the file is called `./install.ps1` then typing `./install` will run it
    - On Linux/Mac `./install`  runs the symlink, which effectively just runs `install.ps1`.
  - If you don't care about Windows supoort, delete the non-ps1 file (the symlink), and then remove the `.ps1` from the remaining file.
  
# How can something be valid Powershell, Bash, and Deno all at the same time? (Polyglot program)

I wrote out an explaination [here](https://stackoverflow.com/questions/39421131/is-it-possible-to-write-one-script-that-runs-in-bash-shell-and-powershell/67292076#67292076) that covers the basics, and it was fairly straightforward to add support for JavaScript on top of Bash/Powershell. In particular, I just took the offical Deno install script and compressed it to fit inline at the top of a file.


# How do I verify this isn't malicious?

Glad you asked!
1. Verify the installer script
    - Start by looking at `./main/1_deno_installer.sh`
        - verify it by comparing it to the official Deno install script [https://deno.land/install.sh](https://deno.land/install.sh)
    - Then compare that to `./main/2_readable.ps1`
        - Read the commits to see explainations of changes (it has to be changed manually)
        - ex:
            - the PATH modification that deno usually performs was commented out (we don't want to affect the user's system)
            - the deno-version is automatically supplied (instead of grabbing latest)
            - a bunch of semicolons need to be added so that the newlines can be removed (so the script can be compressed at the top of a file)
            - the install location is changed from `$HOME/.deno/` to `$HOME/.deno/${version}/` (we don't want to affect the user's system)
            - if curl doesn't exist, we fall back on wget (some systems don't have curl)
            - if unzip doesn't exist, we try to install it for the user (some systems don't start with unzip)
            - etc
    - Once `./main/2_readable.ps1` is verified, look at `./run/readable_to_inline.js`. It
        - this file-reads the readable version
        - deletes comments
        - deletes newlines
        - generates `./main/3_inlined.ps1` which is the shell + powershell aspect
        - JavaScript-escapes those contents
        - makes a javascript function that accepts the deno version and the args (like `--allow-all` or `--unstable`)
        - puts that javascript function inside of `./main/4_inlined.js` 
    - Once those have been looked open up `deno-guillotine-api.js` (which imports `./main/4_inlined.js`)
    - Finally `deno-guillotine.js` imports `enhanceScript` from `deno-guillotine-api.js`
2. Verify the main JavaScript
    - Look at `deno-guillotine-api.js` (no permissions needed)
    - Look at `deno-guillotine.js` (needs file permissions because its the CLI script)
3. Bundle `deno-guillotine.js`, and inspect the dependencies
    - GoodJs is a permissionless/frontend utility library I maintain
    - FileSystem is a quality of life wrapper around Deno's file system and path. I'd like to remove it from guillotine to make guillotine easier to verify, but thats future work for me.

- Footnote: 
    - Deno didn't always have official arm64 support
    - Older versions of guillotine got arm64 support using LukeChannings [script](https://github.com/LukeChannings/deno-arm64) 
    - Now guillotine (as of v1.0.0.5) uses the official deno arm64 installer 

# Can I generate these files client-side?

Not sure why you would, but actually yes you can. There is a pure-function API to enable this functionality from within any JavaScript runtime.

```js
import { enhanceScript } from "https://deno.land/x/deno_guillotine/main/deno-guillotine-api.js"

const { newContents, symlinkPath, normalPath, ps1Path } = enhanceScript({
    filePath: "./my_cli_scipt.js",
    jsFileContent: `console.log("Hello World")`,
    denoVersion: "1.44.4",
    additionalArgs: [ "--no-npm", "--unstable" ],
    additionalArgsForUnix: [ ],
    additionalArgsForWindows: [ ],
    baseArgs: [ "--quiet", "-A", "--no-lock", ],
})

Deno.writeTextFileSync(ps1Path, newContents)
Deno.symlinkSync(symlinkPath, normalPath)
```
