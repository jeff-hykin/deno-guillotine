console.log(
    Deno.args[0].replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/\$\{/g,"\\${")
)