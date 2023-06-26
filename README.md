# What is this for?

Making scripts that work on a freshly setup PC => the user does not need to install Deno, nor anything else. Just copy the script file and exeute it. It is the same script for Windows, as it is for Raspbian OS, as it is for 86x MacOS; a script that is still editable/readable JavaScript (e.g. not compiled/mangled).

This is possible because of using some rare builtin tools that allow for a single file to valid bash, and valid powershell, AND valid JavaScript (based partly on [Is it possible to write one script that runs in bash/shell and PowerShell?](https://stackoverflow.com/questions/39421131/is-it-possible-to-write-one-script-that-runs-in-bash-shell-and-powershell))

# How do I make an installer script?

1. Write a deno script, lets call it `example.js`<br>
```js
console.log("Hello World")
```

2. Install guillotine<br>
```shell
deno install -Af https://deno.land/x/deno_guillotine@0.0.8/main/deno-guillotine.js
```

3. Make your script portable<br>
```shell
deno-guillotine ./example.js
# if you have a particular version of deno you want to use, include it as the second argument
deno-guillotine ./example.js 1.33.1
```

4. Profit<br>
- Two files will have been generated, which I'll explain in a moment. More importantly though, typing `./example` in the command line will now try an execute the script (even on Windows)
  - On Linux/Mac and other half-decent operating systems supported by Deno (incuding Arm Linux) there is no catch. If the specified version of Deno isn't available, then it is downloaded. The download will not modify PATH, and will not touch/change any existing Deno install. Once the specified version of Deno is available, the script will execute itself using that version of Deno.
  - On Windows there is one catch; **a fresh Windows install will block execution of all powershell scripts by default**. `Set-ExecutionPolicy unrestricted` will need to be run in an admin terminal before powershell scripts of can be executed. After that, it follows the same process as the other operating systems (downloads the spcific version of Deno if needed, and executes itself using that version).

- Deno guillotine will have generated two files, but one is just a symlink to the other. And if you don't want two files there are some compromises to get away with a single file:
  - Technically executing `./example.ps1` will run on all OS's (Linux/Mac ignore the `.ps1` and run it using bash/zsh/etc). However, I find that very ugly, it would be much better to type `./example` and the script execute. On Windows `./example` will actually run the `example.ps1` file. On Linux/Mac adding a symlink to the `.ps1` file allows `./example` to be used to execute the file.
  - If you don't care about Windows supoort, delete the non-ps1 file (the symlink), and then just rename the `.ps1` file so that it doesn't have a `.ps1`.


# How can something be valid Powershell, Bash, and Deno all at the same time?

I wrote out an explaination [here](https://stackoverflow.com/questions/39421131/is-it-possible-to-write-one-script-that-runs-in-bash-shell-and-powershell/67292076#67292076) that covers the basics, and it was fairly straightforward to add support for JavaScript on top of Bash/Powershell. In particular, I just took the offical Deno install script and compressed it to fit inline at the top of a file.
