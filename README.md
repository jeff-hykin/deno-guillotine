# What is this for?

Making scripts that work on a freshly setup PC (no prerequisites/manual dependencies)

# How do I use it?

1. Write a deno script, lets call it `example.js`<br>
```js
console.log("Hello World")
```

2. Install guillotine<br>
```shell
deno install -Af https://deno.land/x/deno_guillotine@0.0.3/main/deno-guillotine.js
```

3. Make your script portable<br>
```shell
deno-guillotine ./example.js 1.24.3 # Deno version
```

4. Profit<br>
It will generate two files. One with no extension, and one with a `.ps1` extension. One file is a shortcut to the other. Typing `./example` will run the file with a specific version of deno, and if the user doesn't have deno it is automatically installed (without changing the user's PATH if they have another version of deno). One file is just a shortcut to the other one, and technically `./example.ps1` will work on all platforms, but typing that is not as pretty.

# How does it work?

Magic. The generated script is valid powershell, bash, and JavaScript all at the same time, which is what allows it to run cross-platform. I wrote out an explaination [here](https://stackoverflow.com/questions/39421131/is-it-possible-to-write-one-script-that-runs-in-bash-shell-and-powershell/67292076#67292076) that covers the basics, and I may write more in time. 