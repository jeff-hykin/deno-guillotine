# What is this for?

Making cross platform scripts that have 0 install steps / instructions
- The user does not need to install Curl/Node/Deno, nor anything else
- The script does not need to "target" an OS; it is a single script, the same file for all OS's
- The generated script is not a binary and is not mangled; it is readable/editable JavaScript
- The script will not touch anything installed by the user (no pollution/side-effects)
- The script auto-downloads a specific version of Deno to an isolated folder, and then runs itself using that exact version of Deno to ensure consistent/reproducable behavior.
- Any Deno.land module can be imported/used, no need to reinvent the wheel or bundle code.

This is possible because of some rare builtin tools that allow for a single file to be valid bash, and valid powershell, AND valid JavaScript (based on this StackOverflow answer [Is it possible to write one script that runs in bash/shell and PowerShell?](https://stackoverflow.com/questions/39421131/is-it-possible-to-write-one-script-that-runs-in-bash-shell-and-powershell))

# How do I make an installer script?

1. Write a Deno script, lets call it `your_script.js`<br>
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
# if you want to add a deno-run argument like --no-npm do it like this:
deno-guillotine ./your_script.js --add-arg '--no-npm' --add-arg '--unstable'
```

4. Profit<br>
- typing `./your_script` (if thats the name of your script) will now run your script, even if you uninstalled Deno! even if you move it from Linux to Mac, or Mac to Windows!
- There are some things to discuss though:
  - On Linux/Mac and other half-decent operating systems supported by Deno (incuding Arm Linux) there is no catch.
  - On Windows there is one catch; **a fresh Windows install will block execution of all powershell scripts by default**.<br>`Set-ExecutionPolicy unrestricted` will need to be run in an admin terminal before powershell scripts can be executed. After that, it follows the same process as the other operating systems (downloads the specific version of Deno if needed, and executes itself using that version).

- Two files are generated, but one is just a symlink, the other is the "real" file. We can get away with a single file with some compromises:
  - Technically `your_script.ps1` is the only file needed. Typing `./your_script.ps1` on any OS will execute correctly.<br>However, I find the `.ps1` ugly. And the `.ps1` is only needed for Windows. The other file (the symlink) is what makes it possible to do `./your_script` on all systems:
    - On Windows, if the file is called `./your_script.ps1` then typing `./your_script` will run it
    - On Linux/Mac `./your_script`  runs the symlink, which effectively just runs `your_script.ps1`.
  - If you don't care about Windows supoort, delete the non-ps1 file (the symlink), and then remove the `.ps1` from the remaining file.
  
# How can something be valid Powershell, Bash, and Deno all at the same time? (Polyglot program)

I wrote out an explanation [here](https://stackoverflow.com/questions/39421131/is-it-possible-to-write-one-script-that-runs-in-bash-shell-and-powershell/67292076#67292076) that covers the basics, and it was fairly straightforward to add support for JavaScript on top of Bash/Powershell. In particular, I just took the offical Deno install script and compressed it to fit inline at the top of a file.

# What does guillotine do to the file? (TLDR)

If you've run the example (`./your_script.js`), you can manually do what guillotine does to another file.
1. Copy the first three lines at the top of `./your_script.ps1`, and put it at the top of `./your_other_script.js`
2. Copy the last line (a JS comment) from `./your_script.ps1` and add it as the last line to `./your_other_script.js`
3. Duplicate `./your_other_script.js` give it a `.ps1` extension, give it executable permission, and volia.

Thats it! Or at least for 99.9% of programs `./your_other_script.ps1` will now run everywhere. The real heavy lifting is those first three lines (the compressed deno installer). You can modify the deno version that's in those first three lines, and modify the deno run arguments. If you change the deno run arguments (ex: --no-lock) then make sure to change the arguments everywhere, as there is some (necessary) duplication.

I got really tired of doing that by hand so I made guillotine to automate the process.

What about the other 0.1% of programs? Well if your code contains `#>` (even inside a JS comment) then guillotine will escape it. If you're doing things manually, then you'll have to escape it yourself to make the script work on Windows.

# How do I verify this isn't malicious?

Glad you asked! The largest step is verifying that those first three lines (the deno installer). Here's a guide:
1. Installer verification
    - There's four stages. Stage 1 is "literally the installer straight from deno official" and it gradually becomes stage 4 "a js function that generates a compressed modified installer"
    - stage one is under `./main/1_deno_installer.sh`
        - verify it by comparing it to the official Deno install script [https://deno.land/install.sh](https://deno.land/install.sh)
    - Then compare that to `./main/2_readable.ps1`
        - Read the commits to see explanations of changes (it has to be changed manually)
        - ex:
            - the PATH modification that deno usually performs was commented out (we don't want to affect the user's system)
            - the deno-version is supplied (instead of grabbing latest)
            - a bunch of semicolons need to be added so that the newlines can be removed in the next stage
            - the install location is changed from `$HOME/.deno/` to `$HOME/.deno/${version}/` (we don't want to affect the user's system)
            - if curl doesn't exist, we fall back on wget (some systems don't have curl)
            - if unzip doesn't exist, we try to install it for the user (some systems don't start with unzip)
    - Once `./main/2_readable.ps1` is verified, look at `./run/readable_to_inline.js`. It
        - reads stage 2
        - deletes comments
        - deletes newlines
        - generates `./main/3_inlined.ps1` which is the shell + powershell aspect
        - puts all that into a JavaScript string
        - makes a JavaScript function that accepts the deno version and the args (like `--allow-all` or `--unstable`)
        - puts that JavaScript code inside of `./main/4_inlined.js` 
    - Once those have been verified, open up `deno-guillotine-api.js` (which imports `./main/4_inlined.js`)
    - Finally `deno-guillotine.js` imports `enhanceScript` from `deno-guillotine-api.js`
3. Verify the main JavaScript
    - Look at `deno-guillotine-api.js` (no permissions needed by that code)
    - Look at `deno-guillotine.js` (needs file permissions because its the CLI script)
4. Bundle `deno-guillotine.js`, and inspect the dependencies
    - GoodJs is a permissionless/frontend utility library I maintain
    - FileSystem is a quality of life wrapper around Deno's file system and path. I'd like to remove it from guillotine to make guillotine easier to verify, but that's future work for me.

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
