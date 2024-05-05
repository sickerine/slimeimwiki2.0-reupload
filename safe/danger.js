import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import cliprogress from "cli-progress"

const directory = "../";
const excludeddirectories = ["node_modules", ".git", ".next", "public"]
const allurls = [];
const urlregex = /https?:\/\/[^\s]+(discord|imgur)[^\s]+.png/g;

// get all URLs from all files in all subdirectories of the given directory and push them to the allurls array
const getUrls = (directory) => {
    const files = readdirSync(directory);

    files.forEach((file) => {
        const filepath = join(directory, file);
        const stat = statSync(filepath);

        if (stat.isDirectory() && !excludeddirectories.includes(file)) {
            getUrls(filepath);
        } else if (stat.isFile()) {
            const filecontent = readFileSync(filepath, "utf8");
            const urls = filecontent.match(urlregex);
            if (urls) {
                urls.forEach((url) => {
                    allurls.push(url);
                });
            }
        }
    });
}
getUrls(directory);

const uniqueurls = [...new Set(allurls)];

const downloadDirectory = "../public/images";
const oldurltoNewurl = {};

// download all images from the allurls array and save them to the downloadDirectory and show the current progress on the cli, in the case of an error print the error to the cli

const downloadImages = async () => {
    const bar = new cliprogress.SingleBar({}, cliprogress.Presets.shades_classic);
    bar.start(uniqueurls.length, 0);

    for (let i = 0; i < uniqueurls.length; i++) {
        const url = uniqueurls[i];
        const filename = uuidv4() + ".png";
        const filepath = join(downloadDirectory, filename);
        try {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            // Write the image to the downloadDirectory
            writeFileSync(filepath, Buffer.from(buffer));
            // Save the old url and the new url to the oldurltoNewurl object
            oldurltoNewurl[url] = `/images/${filename}`;
        } catch (error) {
            // Print an error without breaking the progress bar
            console.error(error);
        }
        bar.update(i + 1);
    }
    bar.stop();
}

await downloadImages();

// get all files in the directory and replace all old urls with the new urls and save the files
const replaceUrls = (directory) => {
    const files = readdirSync(directory);

    files.forEach((file) => {
        const filepath = join(directory, file);
        const stat = statSync(filepath);

        if (stat.isDirectory() && !excludeddirectories.includes(file)) {
            replaceUrls(filepath);
        } else if (stat.isFile()) {
            const filecontent = readFileSync(filepath, "utf8");
            let newfilecontent = filecontent;
            for (const [oldurl, newurl] of Object.entries(oldurltoNewurl)) {
                newfilecontent = newfilecontent.replaceAll(oldurl, newurl);
            }
            writeFileSync(filepath, newfilecontent);
        }
    });
}
replaceUrls(directory);
