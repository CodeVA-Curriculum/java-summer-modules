import fs from 'fs/promises'
import {write} from 'to-vfile'
import {renderFile} from './src/renderer.mjs'

main()

async function main() {
    // Get all the files in ./modules/
    const files = await getFiles('./modules/')
    
    // For each file in ./modules/, create a rendered version in ./dist/
    let madeDirs = []
    for(const file of files) {
        // Create the directory
        let newDirectory = file.path.replace("./modules/", "")
        newDirectory = "./dist/"+newDirectory.substring(0, newDirectory.indexOf('/'))+"/"

        // If the folder doesn't already exist
        if(!madeDirs.includes(newDirectory)) {
            await fs.mkdir(newDirectory)
            madeDirs.push(newDirectory)
        }

        // Render the file
        const vf = await renderFile(file.path)

        // Get the new path
        await write({
            path: newDirectory+file.name,
            value: vf.value
        })
    }
}

async function getFiles(path) {
    const entries = await fs.readdir(path, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter(file => !file.isDirectory())
        .map(file => ({ ...file, path: path + file.name }));
	
    // Get folders within the current directory
    const folders = entries.filter(folder => folder.isDirectory());

    for (const folder of folders)
        /*
          Add the found files within the subdirectory to the files array by calling the
          current function itself
        */
        files.push(...await getFiles(`${path}${folder.name}/`));

    return files;
}
