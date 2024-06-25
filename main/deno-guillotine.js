import { FileSystem } from "https://deno.land/x/quickr@0.6.67/main/file_system.js"
import { enhanceScript } from "./deno-guillotine-api.js"
const currentVersion = `${Deno.version.deno}`

// 
// args
// 
const path = Deno.args[0]
const version = Deno.args[1] || currentVersion

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
const additionalArgs = []
const additionalArgsForUnix = []
const additionalArgsForWindows = []
const { newContents, symlinkPath } = enhanceScript({
    filePath: path,
    jsFileContent: contents,
    denoVersion: version,
    additionalArgs: additionalArgs,
    additionalArgsForUnix: additionalArgsForUnix,
    additionalArgsForWindows: additionalArgsForWindows,
    baseArgs: [ "-q", "-A", "--no-lock", ],
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