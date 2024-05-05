import fs from "fs";
import path from "path";
const { Octokit } = require("octokit");
const octokit = new Octokit({
	auth:
		process.env.SECRET_CODE
})
let owner = "Seikirin"
let repo = "slimeimwiki2.0"
let Today = new Date()
let shas = {};

async function pullFile(path) {
	let Pull = await octokit.request(`GET /repos/Seikirin/${repo}/contents/` + path)
	shas[path] = { sha: Pull.data.sha, content: Buffer.from(Pull.data.content, 'base64').toString('utf8') }
	return shas[path].content;
}

async function pushFile(path, content) {
	let currentContent = content;

	if (shas[path] === undefined || shas[path].content !== currentContent) {
		console.log("Pushing file " + path)
		currentContent = Buffer.from(content).toString('base64')
		let Push = await octokit.request(`PUT /repos/Seikirin/${repo}/contents/` + path, {
			message: 'Update',
			content: currentContent,
			sha: shas[path]?.sha,
		});
		shas[path] = { sha: Push.data.content.sha, content: currentContent };
		return Push;
	} else {
		console.log('No changes to file ' + path);
		return null;
	}
}

// export default async (req, res) => {
// 	const session = await getSession({ req });
// 	if (session && session.user.name == "seikirin") {
// 		const characters = JSON.parse(await pullFile('data/characters.json'));
// 		const {	id, newCopy } = JSON.parse(req.body);
// 		characters[id] = newCopy;
// 		await pushFile('data/characters.json', JSON.stringify(characters, null, 4));
// 		res.status(200).end();
// 	} else {
// 		res.status(401).end();
// 	}
// };

import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session?.provider?.id == 81483357) {
        const characters = JSON.parse(await pullFile('data/characters.json'));
        const { id, newCopy } = JSON.parse(req.body);
        characters[id] = newCopy;
        await pushFile('data/characters.json', JSON.stringify(characters, null, 4));
        res.status(200).end();
    } else {
        res.status(401).end();
    }
}