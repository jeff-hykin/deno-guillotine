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

2. Install the cli helper (guillotine) to make your script portable<br>
```shell
deno install -Afg https://deno.land/x/deno_guillotine/main/deno-guillotine.js
```

3. Use it to make your script portable<br>
```shell
deno-guillotine ./install.js
# if you have a particular version of deno you want to use, include it as the second argument
deno-guillotine ./install.js 1.44.4
# if you want to add an deno-run argument like --no-npm do it like this:
deno-guillotine ./install.js --add-arg '--no-npm' --add-arg '--unstable'
```

4. Profit<br>
- Two files will have been generated, which I'll explain in a moment. More importantly though, typing `./install` in the command line will now try an execute the script (even on Windows)
  - On Linux/Mac and other half-decent operating systems supported by Deno (incuding Arm Linux) there is no catch.
  - On Windows there is one catch; **a fresh Windows install will block execution of all powershell scripts by default**.<br>`Set-ExecutionPolicy unrestricted` will need to be run in an admin terminal before powershell scripts can be executed. After that, it follows the same process as the other operating systems (downloads the specific version of Deno if needed, and executes itself using that version).

- Two files are generated, but one is just a symlink to the other. And we can get away with a single file (with some compromises):
  - Technically `install.ps1` is the only file needed. Typing `./install.ps1` on any OS will execute correctly.<br>However, I find the `.ps1` ugly. And the `.ps1` is only needed for Windows. The other file (the symlink) is what makes it possible to do `./install` on all systems:
    - On Windows, if the file is called `./install.ps1` then typing `./install` in the command line naturally execute it (no change needed).
    - On Linux/Mac we can make a `./install` file that is just a relative symlink to `install.ps1`. Volia, typing `./install` now executes the `./install.ps1` file.
  - If you don't care about Windows supoort, delete the non-ps1 file (the symlink), and then just rename the `.ps1` file so that it doesn't have a `.ps1`.
  
# How can something be valid Powershell, Bash, and Deno all at the same time?

I wrote out an explaination [here](https://stackoverflow.com/questions/39421131/is-it-possible-to-write-one-script-that-runs-in-bash-shell-and-powershell/67292076#67292076) that covers the basics, and it was fairly straightforward to add support for JavaScript on top of Bash/Powershell. In particular, I just took the offical Deno install script and compressed it to fit inline at the top of a file.


# How do I verify this isn't malicious?

Glad you asked!
1. Verify the installer script
    - Start by looking at `./main/readable.ps1`
        - Its a modified version of the official Deno install script
        - ~~It has arm64 support using LukeChannings [script](https://github.com/LukeChannings/deno-arm64) (which was needed before deno had added arm64 support)~~
            - As of guillotine v1.0.0.5 it now uses the official deno arm64 installer
        - Now that deno has arm64 support directly, a future deno-guillotine update will remove the LukeChannings changes (e.g. TODO)
    - Once `./main/readable.ps1` is verified, look at `inlined.ps1`
    - Once that is looked at, verify the embeded inlined version inside of `deno-guillotine-api.js`
    - Note: expect slight differences between `readable.ps1`, `inlined.ps1`, and the embeded version. The conversion process has not been fully automated since it doesn't happen often.
2. Verify the main JavaScript
    - Look at `deno-guillotine-api.js` (no permissions needed)
    - Look at `deno-guillotine.js` (needs file permissions because its the CLI script)
3. Bundle `deno-guillotine.js`, and inspect the dependencies
    - GoodJs is a permissionless/frontend utility library I maintain
    - FileSystem is a quality of life wrapper around Deno's file system and path. I'd like to remove it from guillotine to make guillotine easier to verify, but thats future work for me.


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