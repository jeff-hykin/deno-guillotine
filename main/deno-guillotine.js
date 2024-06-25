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
            deno-guillotine --file ./your_file.js \
                --add-arg '--no-npm' \
                --add-arg '--unstable'
            
            deno-guillotine --file ./your_file.js \
                --add-unix-arg '--unstable-ffi' \
                --add-windows-arg '--unstable-cron'
            
            deno-guillotine --file ./your_file.js \
                --no-default-args \
                --add-arg '--quiet' \
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
    const [ folders, itemName, itemExtensionWithDot ] = FileSystem.pathPieces(path)
    const normalPath = `${folders.join('/')}/${itemName}`
    const ps1Path = `${folders.join('/')}/${itemName}.ps1`
    const contents = Deno.readTextFileSync(path)

    // 
    // enhance script
    // 
    const { newContents, symlinkPath } = enhanceScript({
        filePath: path,
        jsFileContent: contents,
        denoVersion,
        additionalArgs:           typeof additionalArgs           === "string" ? [ additionalArgs ] : additionalArgs,
        additionalArgsForUnix:    typeof additionalArgsForUnix    === "string" ? [ additionalArgsForUnix ] : additionalArgsForUnix,
        additionalArgsForWindows: typeof additionalArgsForWindows === "string" ? [ additionalArgsForWindows ] : additionalArgsForWindows,
        baseArgs: noDefaultArgs ? [] : [ "-q", "-A", "--no-lock", ],
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
