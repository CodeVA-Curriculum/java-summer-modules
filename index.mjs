import fs from 'fs/promises'
import {write, read} from 'to-vfile'
import {renderFile} from './src/renderer.mjs'
import inquirer from 'inquirer'
import path from "path"

main()

async function ask() {
    const questions = [
        {
            name: "readFrom",
            type: "input",
            message: "Type the path to the folder containing your modules:",
            default: "./modules"
            // TODO: validate format
        },
        {
            name: "assetsLocation",
            type: "input",
            message: "Enter the path to the folder containing the media assets referenced in your modules:",
            default: "./assets"
        },
        {
            name: "writeTo",
            type: "input",
            message: "Type the path of the folder you would like to create to contain the newly rendered modules:",
            default: "./dist"
            // TODO: check if folder already exists, throw error if it does. Check path format
        }
    ]
    return inquirer.prompt(questions);
}

async function main() {
    const {readFrom, assetsLocation, writeTo} = await ask()
    await fs.mkdir(writeTo)
    await render(readFrom, writeTo)
    copyDir(assetsLocation, writeTo+"/assets")
}

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fs.copyFile(srcPath, destPath);
    }
}

// TODO: throw error if the target directory is in the wrong format
async function render(readFrom, writeTo) {
    // Get all the files in ./modules/
    const files = await getFiles(readFrom +'/')
    
    // For each file in ./modules/, create a rendered version in ./dist/
    let madeDirs = []
    for(const file of files) {
        // Create the directory
        let newDirectory = file.path.replace(readFrom+'/', "")
        newDirectory = writeTo+"/"+newDirectory.substring(0, newDirectory.indexOf('/'))+"/"

        // If the folder doesn't already exist
        if(!madeDirs.includes(newDirectory)) {
            await fs.mkdir(newDirectory)
            madeDirs.push(newDirectory)
        }

        // Render the file
        const vf = await renderFile(file.path)

        // Get the new path
        await write({
            path: newDirectory+file.name.replace('.md', '.html'),
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
