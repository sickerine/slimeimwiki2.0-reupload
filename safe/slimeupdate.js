const bent = require('bent');
const fs = require('fs');
const jsdom = require("jsdom");
const { Octokit } = require("octokit");
const virtualConsole = new jsdom.VirtualConsole();
const octokit = new Octokit({ 
	auth:
	process.env.SECRET_CODE
})
virtualConsole.on("error", () => { });
let owner = "Seikirin"
let repo = "slimeimwiki2.0"
let Today = new Date()
let shas = {};
let FormattedDate = ((Today.getMonth() + 1) + "/" + Today.getDate() + "/" + Today.getFullYear());
let Characters = {};
let Events = {}
let ForcesData = [];
const RetardedAlias = {
	"Octagram Demon Lord": "Octagram",
}


//TEMP
let TierList = [
	{
		Title: "SSS",
		Color: "red",
		Units: ["Violet1", "Masked1", "Shuna7", "Milim10", "Rimuru12", "Shinsha3"],
		Protection: ["Shuna8", "Towa1", "Shizue3", "Hakurou3", "Guy3", "Veldora3", "Milim9"]
	},
	{
		Title: "SS",
		Color: "crimson",
		Units: ["Shion2", "Gazel1", "Luminus3", "Diablo2", "Veldora2", "Myulan2", "Luminus2", "Milim3", "Carrion1",
			"Rimuru4", "Milim6", "Diablo3", "Shion7", "Alice1", "Velzard1", "Shinsha2", "Benimaru7", "Velzard3", "Milim11", "Luminus4",
			"Rimuru14", "Shion8", "Yuuki2"],
		Protection: ["Veldora6", "Orc1", "Chloe2", "Gabiru2", "Charybdis1", "Benimaru6", "Ramiris3"]
	},
	{
		Title: "S",
		Color: "#A60D22",
		Units: ["Leon2", "Leon1", "Daggrull1", "Diablo1", "Shion1", "Milim2", "Guy2", "Guy1", "Luminus1", "Benimaru2", "Souei1", "Milim1", "Ramiris1", "Deeno1", "Rimuru5", "Velzard2", "Leon3", "Diablo4", "Deeno2", "Shizue4"],
		Protection: ["Ramiris2", "Shion6", "Rimuru9", "Rimuru10", "Soka1", "Elemental1"]
	},
	{
		Title: "A",
		Color: "orange",
		Units: ["Rimuru3", "Shuna1", "Hinata1", "Beretta1", "Milim4", "Rimuru6", "Gobta1", "Shizue2", "Benimaru1", "Treyni1", "Milim5", "Daggrull2", "Clayman1", "Adalman1", "Rain1", "Veldora1",
			"Hakurou1", "Souei2", "Rimuru1", "Frey1", "Rimuru11", "Izis1"],
		Protection: ["Ifrit1", "Shuna6", "Veldora4", "Milim8"]
	},
	{
		Title: "B",
		Color: "darkgoldenrod",
		Units: ["Shizue1", "Ranga1", "Rimuru2", "Shuna2", "Shinsha1", "Eren1", "Misery1", "Geld2", "Rimuru7", "Hiiro1", "Rimuru13", "Soka2", "Suphia2"],
		Protection: [],
	},
	{
		Title: "C",
		Color: "grey",
		Units: ["Myulan1", "Benimaru5", "Shuna5", "Albis1", "Ranga2"],
		Protection: [],
	}
]

const types = {
	Fire: "/images/5c77d32c-f4a9-4ead-a97b-4dfea94d7abd.png",
	Wind: "/images/87416f9f-77af-4f20-bd58-e9ba4108fc7e.png",
	Space: "/images/9ff28d4b-85df-427c-bdc3-ec1a6d5d3c5c.png",
	Light: "/images/783ffe24-291e-4492-8073-6dcab5d40aca.png",
	Dark: "/images/078e2d95-f38b-4472-bbc8-228fc9cee71c.png",
	Earth: "/images/032ce07b-e263-41f0-9610-1523537a4932.png",
	Water: "/images/ea98eed4-91a4-4dfc-a8ec-5bfb3226b1f3.png",
	Melee: "/images/330087cc-a249-4a40-8f15-2a3f74adeeea.png",
	Magic: "/images/9c679e32-53c1-4446-bbc5-1eff49ea008a.png",
}

let typeconvert = {
	physics: types["Melee"],
	magic: types["Magic"],
	holy: types["Light"],
	dark: types["Dark"],
	wind: types["Wind"],
	fire: types["Fire"],
	air: types["Space"],
	water: types["Water"],
	earth: types["Earth"]
}

let typeconvert2 = {
	physics: "/images/36c4ef15-1f89-4d06-b1e6-d44a63d5dc51.png",
	magic: "/images/d129a3dc-1c6b-44c0-951b-0fc42a537784.png",
}

///

let TypeAssets = {
	fire: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementFire.png",
	water: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementWater.png",
	wind: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementWind.png",
	holy: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementHoly.png",
	dark: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementDark.png",
	earth: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementEarth.png",
	air: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementAir.png",
	physics: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icAttackTypePhysics.png",
	magic: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icAttackTypeMagic.png",
}

let Icons = {
	Notice: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_info.png",
	Event: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_event.png",
	Recruit: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_scout.png",
	Campaign: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_campaign.png",
	Issues: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_bug.png",
	Update: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_update.png",
	Maintenance: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_maintenance.png"
}

async function getDOM(url) {
	try {
	  const getStream = bent(url);
	  const stream = await getStream();
	  const status = stream.status;
	  const statusCode = stream.statusCode;
	  const str = await stream.text();
	  const dom = new jsdom.JSDOM(str, { virtualConsole });
	  return dom.window.document;
	} catch (error) {
	  console.error(`Error fetching DOM: ${error}`);
	  return null;
	}
  }
function removeQueryParams(url) {
	const index = url.indexOf('?');
	return index === -1 ? url : url.slice(0, index);
}

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

function extractPointsRequired(str) {
	const regex = /Points Required: (\d+)/i;
	const match = str.match(regex);
	return match ? parseInt(match[1]) : null;
}

function OutputToJSONFile(file, data) {
	// append and replace \n with actual newlines
	fs.appendFileSync(file, JSON.stringify(data, null, 2).replace(/\\n/g, '\n'));
}

async function scrapFields(DOM, Character, Key) {
	let GridItems = Array.from(DOM.querySelectorAll(".chara-status-grid-item"))
	let Sections = Array.from(DOM.querySelectorAll("section"))

	//Info
	let CharaImg = DOM.querySelector(".chara-img > img").getAttribute("src")
	let Rarity = DOM.previousElementSibling.getAttribute("data-rarity");
	let Types = [];
	if (DOM.previousElementSibling.getAttribute("data-attribute")) {
		Types.push(TypeAssets[DOM.previousElementSibling.getAttribute("data-attribute")])
	}
	if (DOM.previousElementSibling.getAttribute("data-type")) {
		Types.push(TypeAssets[DOM.previousElementSibling.getAttribute("data-type")])
	}
	DOM.previousElementSibling.querySelectorAll("img").forEach((ele) => {
		Types.push(removeQueryParams(ele.getAttribute("src")))
	})

	// Stats
	let Attack = GridItems.find(item => item.textContent.includes("ATK")).querySelector(".chara-status-value").textContent
	let Health = GridItems.find(item => item.textContent.includes("HP")).querySelector(".chara-status-value").textContent
	let Defense = GridItems.find(item => item.textContent.includes("DEF")).querySelector(".chara-status-value").textContent
	let Output = GridItems.find(item => item.textContent.includes("Output")).querySelector(".chara-status-value").textContent
	let OutputBuffs = GridItems.find(item => item.textContent.includes("Output")).nextElementSibling.textContent.trim();

	//Forces
	let Forces = [];
	let ForcesElems = Sections.find(el => el.textContent.includes('Forces'))
	ForcesElems && ForcesElems.querySelectorAll(".chara-category-item").forEach((ele) => {
		if (!ForcesData.find(arr => arr[0] == ele.textContent.trim()))
			ForcesData.push([ele.textContent.trim(), ele.querySelector("img").getAttribute("src")])
		Forces.push(ForcesData.indexOf(ForcesData.find(arr => arr[0] == ele.textContent.trim())))
	})

	let NewCharacter = {
		New: Character.New ?? true,
		Octagram: Character.Octagram ?? false,
		Release: Character.Release ?? undefined,
		Name: Character.Name,
		Icon: Character.Icon ?? CharaImg,
		Art: Character.Art ?? CharaImg,
		Types: Types,
		Weapon: Character.Weapon ?? undefined,
		Growth: Character.Growth ?? undefined,
		Rarity: Character.Rarity ?? Number(Rarity),
		MinAtk: Character.MinAtk ?? Number(Attack.split("(")[0]),
		MaxAtk: Character.MaxAtk ?? Number(Attack.split("(")[1].replace(")", "")),
		MinHp: Character.MinHp ?? Number(Health.split("(")[0]),
		MaxHp: Character.MaxHp ?? Number(Health.split("(")[1].replace(")", "")),
		MinDef: Character.MinDef ?? Number(Defense.split("(")[0]),
		MaxDef: Character.MaxDef ?? Number(Defense.split("(")[1].replace(")", "")),
		MinOutput: Character.MinOutput ?? Number(Output.split("(")[0]),
		MaxOutput: Character.MaxOutput ?? Number(Output.split("(")[1].replace(")", "")),
		Town1: Character.Town1 ?? (OutputBuffs.split("%")[0] + '%'),
		Town2: Character.Town2 ?? (OutputBuffs.split("%")[1] + '%'),
		Forces: Forces,
	}

	//Skills
	let SecretSkillDescription, EXSecretSkillDescription, SecretSkillName, EXSecretSkillName,
		BattleSkill1Description, BattleSkill2Description, BattleSkill1Name, BattleSkill2Name,
		BattleSkill1Icon, BattleSkill2Icon;
	let SkillsSection = Sections.find(el => el.textContent.includes('Skill Details') && !el.textContent.includes('Secret Skill Details'))
	let RetardedSecretSection = Sections.find(el => el.textContent.includes('Secret Skill Details'))
	let RetardedDivineSection = Sections.find(el => el.textContent.includes('Divine Protection Details'))
	let EXSecretSkillSection = Array.from(SkillsSection.querySelectorAll(`.chara-skills-category`)).find(ele => ele.textContent == "EX Secret Skill")
	let SecretSkillSection = Array.from(SkillsSection.querySelectorAll(`.chara-skills-category`)).find(ele => ele.textContent == "Secret Skill")
	let BattleSkillsSection = Array.from(SkillsSection.querySelectorAll(`.chara-skills-category`)).filter(ele => ele.textContent.includes("Battle Skills"))
	if (!SecretSkillSection && RetardedSecretSection) {
		SecretSkillSection = Array.from(RetardedSecretSection.querySelectorAll(`.chara-skills-category`)).find(ele => ele.textContent == "Secret Skill")
	}
	if (!EXSecretSkillSection && RetardedSecretSection) {
		EXSecretSkillSection = Array.from(RetardedSecretSection.querySelectorAll(`.chara-skills-category`)).find(ele => ele.textContent == "EX Secret Skill")
	}
	console.log("Character: " + Character.Name);
	if (SecretSkillSection) {
		console.log("Character has secret skill")
		SecretSkillName = SecretSkillSection.parentElement.querySelector(".chara-skills-name").textContent
		SecretSkillDescription = SecretSkillSection.parentElement.querySelector(".chara-skills-text").textContent

		NewCharacter.SecretType = SecretSkillDescription.toLowerCase().includes("all-target") ? "All" : "Single"
		NewCharacter.Secret = Character.Secret ?? `${SecretSkillName}:${SecretSkillDescription}`
	}
	else
		console.log("Character has no secret skill")
	if (EXSecretSkillSection) {
		EXSecretSkillName = EXSecretSkillSection.parentElement.querySelector(".chara-skills-name").textContent
		EXSecretSkillDescription = EXSecretSkillSection.parentElement.querySelector(".chara-skills-text").textContent

		NewCharacter.EXSecret = Character.EXSecret ?? `${EXSecretSkillName}:${EXSecretSkillDescription}`
	}
	if (BattleSkillsSection.length) {
		class BattleSkill {
			constructor(Name, Description, Icon) {
				this.Name = Name;
				this.Description = Description;
				this.Icon = Icon;
			}
		}
		let SkillIndex = 0;
		let FusionIndex = 0;
		let BattleSkills = [[],[]]
		BattleSkillsSection.forEach((ele) => {
			ele.parentElement.querySelectorAll(".chara-skills-grid").forEach((grid) => {
				let Name = grid.querySelector(".chara-skills-name").textContent;
				let Description = grid.querySelector(".chara-skills-text").textContent;
				let Icon = grid.querySelector("img").getAttribute("src");
				BattleSkills[SkillIndex][FusionIndex] = new BattleSkill(Name, Description, Icon);
				if (FusionIndex == 1 || Array.from(grid.parentElement.classList).includes("chara-skills-container"))
				{
					FusionIndex = 0;
					SkillIndex++;
				}
				else
					FusionIndex++;
			})
		})
		for (let i = 0; i < 2; i++) {
			let Skill = BattleSkills[i][0];
			let FusedSkill = BattleSkills[i][1];
			// NewCharacter.Skill1 = Character.Skill1 ?? `${BattleSkill1Name}/Lv.10:${BattleSkill1Description.replace(`Points Required: ${extractPointsRequired(BattleSkill1Description)}`, "")}Cost: ${extractPointsRequired(BattleSkill1Description)}`
			NewCharacter[`Skill${i+1}`] = Character[`Skill${i+1}`] ?? `${Skill.Name}/Lv.10:${Skill.Description.replace(`Points Required: ${extractPointsRequired(Skill.Description)}`, "")}Cost: ${extractPointsRequired(Skill.Description)}`
			NewCharacter[`Skill${i+1}Icon`] = Character[`Skill${i+1}Icon`] ?? Skill.Icon
			if (FusedSkill)
			{
				console.log("Fused skill found");
				NewCharacter[`Skill${i+1}Fused`] = Character[`Skill${i+1}Fused`] ?? `${FusedSkill.Name}/Lv.10:${FusedSkill.Description.replace(`Points Required: ${extractPointsRequired(FusedSkill.Description)}`, "")}Cost: ${extractPointsRequired(FusedSkill.Description)}`
				NewCharacter[`Skill${i+1}FusedIcon`] = Character[`Skill${i+1}FusedIcon`] ?? FusedSkill.Icon
			}
		}
		// if (FusedBattleSkill2)
		// 	NewCharacter.Skill2Fused = Character.Skill2Fused ?? `${FusedBattleSkill2.Name}/Lv.10:${FusedBattleSkill2.Description.replace(`Points Required: ${extractPointsRequired(FusedBattleSkill2.Description)}`, "")}`
		
			// let BattleSkill1 = BattleSkillsSection.parentElement.querySelectorAll(".chara-skills-grid")[0];
		// let BattleSkill2 = BattleSkillsSection.parentElement.querySelectorAll(".chara-skills-grid")[1];
		// BattleSkill1Name = BattleSkill1.querySelector(".chara-skills-name").textContent;
		// BattleSkill1Description = BattleSkill1.querySelector(".chara-skills-text").textContent;

		// BattleSkill2Name = BattleSkill2.querySelector(".chara-skills-name").textContent;
		// BattleSkill2Description = BattleSkill2.querySelector(".chara-skills-text").textContent;

		// BattleSkill1Icon = BattleSkill1.querySelector("img").getAttribute("src");
		// BattleSkill2Icon = BattleSkill2.querySelector("img").getAttribute("src");

		// NewCharacter.Skill1 = Character.Skill1 ?? `${BattleSkill1Name}/Lv.10:${BattleSkill1Description.replace(`Points Required: ${extractPointsRequired(BattleSkill1Description)}`, "")}Cost: ${extractPointsRequired(BattleSkill1Description)}`
		// NewCharacter.Skill2 = Character.Skill2 ?? `${BattleSkill2Name}/Lv.10:${BattleSkill2Description.replace(`Points Required: ${extractPointsRequired(BattleSkill2Description)}`, "")}Cost: ${extractPointsRequired(BattleSkill2Description)}`
		// NewCharacter.Skill1Icon = Character.Skill1Icon ?? BattleSkill1Icon
		// NewCharacter.Skill2Icon = Character.Skill2Icon ?? BattleSkill2Icon
	}

	//Divine Protection
	let ProtectionName, ProtectionDescription, SupportProtectionName, SupportProtectionDescription,
		ProtectionSkillName, ProtectionSkillDescription, ProtectionSkillIcon;
	let ProtectionSection = Array.from(SkillsSection.querySelectorAll(`.chara-skills-category`)).find(ele => ele.textContent == "Divine Protection")
	let ProtectionSkillSection = Array.from(SkillsSection.querySelectorAll(`.chara-skills-category`)).find(ele => ele.textContent == "Protection Skill")
	if (!ProtectionSection && RetardedDivineSection)
		ProtectionSection = Array.from(RetardedDivineSection.querySelectorAll(`.chara-skills-category`)).find(ele => ele.textContent == "Divine Protection")
	if (ProtectionSection) {
		ProtectionName = ProtectionSection.parentElement.querySelectorAll(".chara-skills-name")[0].textContent
		ProtectionDescription = ProtectionSection.parentElement.querySelectorAll(".chara-skills-text")[0].textContent
		SupportProtectionName = ProtectionSection.parentElement.querySelectorAll(".chara-skills-name")[1].textContent
		SupportProtectionDescription = ProtectionSection.parentElement.querySelectorAll(".chara-skills-text")[1].textContent
		ProtectionSkillName = ProtectionSkillSection.parentElement.querySelector(".chara-skills-name").textContent
		ProtectionSkillDescription = ProtectionSkillSection.parentElement.querySelector(".chara-skills-text").textContent
		ProtectionSkillIcon = ProtectionSkillSection.parentElement.querySelector("img").getAttribute("src")

		NewCharacter.DivineProtection = Character.DivineProtection ?? `${ProtectionName}:${ProtectionDescription}`
		NewCharacter.SupportDivineProtection = Character.SupportDivineProtection ?? `${SupportProtectionName}:${SupportProtectionDescription}`
		NewCharacter.ProtectionSkillIcon = Character.ProtectionSkillIcon ?? ProtectionSkillIcon
		NewCharacter.ProtectionSkill = Character.ProtectionSkill ?? `${ProtectionSkillName}/Lv.10:${ProtectionSkillDescription}`
	}
	NewCharacter.UnitType = ProtectionSection ? "Protection Characters" : "Battle Characters";


	//Valor Traits
	let Valor1Description, Valor1ADescription, Valor1Name, Valor1AName;
	let ValorSection = Sections.find(el => el.textContent.includes('Valor Traits'))
	if (ValorSection) {
		let Valor1 = ValorSection.querySelectorAll("section")[0]
		let Valor1A = ValorSection.querySelectorAll("section")[1]
		Valor1Name = Valor1.querySelector(".header").textContent
		Valor1Description = Valor1.querySelector(".chara-skills-text").textContent

		NewCharacter.Valor1 = Character.Valor1 ?? (Valor1Name + ":" + Valor1Description);
		if (Valor1A) {
			Valor1AName = Valor1A.querySelector(".header").textContent
			Valor1ADescription = Valor1A.querySelector(".chara-skills-text").textContent
			NewCharacter.Valor1A = Character.Valor1A ?? (Valor1AName + ":" + Valor1ADescription);
		}
	}
	
	//Character Traits
	let Trait1Description, Trait1ADescription, Trait1Name, Trait1AName;
	let TraitSection = Sections.find(el => el.textContent.includes('Character Traits'))
	if (TraitSection) {
		let Trait1 = TraitSection.querySelectorAll("section")[0]
		let Trait1A = TraitSection.querySelectorAll("section")[1]
		Trait1Name = Trait1.querySelector(".header").textContent
		Trait1Description = Trait1.querySelector(".chara-skills-text").textContent
		Trait1AName = Trait1A.querySelector(".header").textContent
		Trait1ADescription = Trait1A.querySelector(".chara-skills-text").textContent

		NewCharacter.Trait1 = Character.Trait1 ?? (Trait1Name + ":" + Trait1Description);
		NewCharacter.Trait1A = Character.Trait1A ?? (Trait1AName + ":" + Trait1ADescription);
	}

	//Secret Skill Enhancement
	let EnhancementDescription;
	let EnhancementSection = Sections.find(el => el.textContent.includes('Secret Skill Enhancement Traits'))
	if (EnhancementSection) {
		let Enhancement = EnhancementSection.querySelector("section")
		EnhancementDescription = Enhancement.querySelector(".chara-skills-text").textContent

		NewCharacter.SecretSkillTrait = `Enhance Secret Skill (6★ Awaken x5):${EnhancementDescription}`;
	}

	//Guidance Enhancement
	let GuidanceEnhancementDescription;
	let GuidanceEhancementSection = Sections.find(el => el.textContent.includes('Guidance Enhancement Trait'))
	if (GuidanceEhancementSection) {
		let Enhancement = GuidanceEhancementSection.querySelector("section")
		GuidanceEnhancementDescription = Enhancement.querySelector(".chara-skills-text").textContent

		NewCharacter.GuidanceEnhancementTrait = `Enhance Guidance (6★ Awaken x5):${GuidanceEnhancementDescription}`;
	}

	//EX Ability
	let EXAbility1Description, EXAbility2Description, EXAbility1Name, EXAbility2Name;
	let EXAbilitySection = Sections.find(el => el.textContent.includes('EX Ability Release'))
	if (EXAbilitySection) {
		let EXAbility1 = EXAbilitySection.querySelectorAll(".chara-skills-grid")[0]
		let EXAbility2 = EXAbilitySection.querySelectorAll(".chara-skills-grid")[1]
		EXAbility1Name = EXAbility1.querySelector(".chara-skills-name").textContent
		EXAbility1Description = EXAbility1.querySelector(".chara-skills-text").textContent
		EXAbility2Name = EXAbility2.querySelector(".chara-skills-name").textContent
		EXAbility2Description = EXAbility2.querySelector(".chara-skills-text").textContent

		NewCharacter.EXAbility1 = Character.EXAbility1 ?? (EXAbility1Name + ":" + EXAbility1Description);
		NewCharacter.EXAbility2 = Character.EXAbility2 ?? (EXAbility2Name + ":" + EXAbility2Description);
	}

	// console.log(NewCharacter)
	console.log("key " + Key);
	Characters[Key] = NewCharacter
}

async function scrapCharacters(DOM, Event) {
	let CharacterContainers = DOM.querySelectorAll(".chara-grid")
	let ContainersHTML = [...CharacterContainers].map(el => el.innerHTML)
	// OutputToJSONFile("ContainersHTML.json", ContainersHTML)
	let NewBanner = [];
	for await (const CharacterGrid of CharacterContainers) {
		let NameElement = CharacterGrid.previousElementSibling
		let FullName = NameElement.querySelector(".headline-m-text").textContent
		FullName = `${FullName.split("] ")[1]} ${FullName.split("] ")[0]}]`
		let CharacterKey = Object.keys(Characters).find(key => Characters[key] && Characters[key].Name == FullName)
		if (CharacterKey == undefined) {
			let FirstName = FullName.split(" ")[0]
			let ID = 1;
			Object.keys(Characters).forEach(key => { ID += Characters[key].Name.split(" ")[0] == FirstName })
			CharacterKey = FirstName + ID
			console.log("new character: " + CharacterKey)
			Characters = Object.assign(
				{
					[CharacterKey]: {
						Name: FullName,
						Release: Event.Start,
						Octagram: Event.Octagram
					},
				}, Characters)
		}
		else {
			Characters[CharacterKey].New = Characters[CharacterKey].New ?? false;
			Characters[CharacterKey].Octagram = Characters[CharacterKey].Octagram || Event.Octagram;
		}
		NewBanner.push(CharacterKey)
		await scrapFields(CharacterGrid, Characters[CharacterKey], CharacterKey)
		// if (CharacterKey == "Ifrit1")
	}
	Event.Banner = NewBanner;
}

function getRelease(key) {
	const ReversedEvents = Object.keys(Events).reverse()

	console.log("searching release for " + key)
	for (const Event of ReversedEvents) {
		if (Events[Event].Banner?.includes(key)) {
			console.log("found release for " + key + " in " + Event + " (" + Events[Event].Start + ")");
			return Events[Event].Start;
		}
	}
}

async function scrapPages() {
	let Promises = []
	for await (const Event of Object.keys(Events)) {
		if (Events[Event].Current != true)
			continue;
		Promises.push(new Promise(async (resolve, reject) => {
			console.log(`Scraping ${Event}...`)
			console.log(`	Name: ${Event}`)
			console.log(`	Link: ${Events[Event].Link}`)
			let DOM = await getDOM(Events[Event].Link)
			if (DOM == null)
				return resolve();
			let ImageElement = DOM.querySelector(".detail-banner > img")
			Events[Event].Type = DOM.querySelector(".article-category").textContent.trim();
			Events[Event].Image = removeQueryParams(ImageElement ? ImageElement.src : Icons[Events[Event].Type.trim()])
			if (Event.includes("Octagram Bazaar"))
				Events[Event].Octagram = true;
			else
				Events[Event].Octagram = false;
			await scrapCharacters(DOM, Events[Event]);
			resolve();
		}))
	}
	await Promise.all(Promises)
	// console.log(Characters);
	Object.keys(Characters).forEach(key => {
		Characters[key].MinEP = Math.floor(Characters[key].MinHp + ((Characters[key].MinAtk * 5) + (Characters[key].MinDef * 2.5)))
		Characters[key].MaxEP = Math.floor(Characters[key].MaxHp + ((Characters[key].MaxAtk * 5) + (Characters[key].MaxDef * 2.5)))
		Characters[key].Tier = Characters[key].Tier ?? TierList.find(tier => tier.Units.includes(key) || tier.Protection.includes(key))?.Title
		Characters[key].Release = Characters[key].Release ?? getRelease(key)
	})
	ForcesData.forEach(force => {
		force[1] = removeQueryParams(force[1])
	})
	pushFile("data/characters.json", JSON.stringify(Characters, null, 4));
	pushFile("data/events.json", JSON.stringify(Events, null, 4));
	pushFile("data/forces.json", JSON.stringify(ForcesData, null, 4));
}

async function updateEvents(DOM) {
	let Items = DOM.querySelectorAll(".event")

	Items.forEach(item => {
		let Event = Object.keys(Events).find(key => Events[key].Link?.includes(item.querySelector("a").href))
		if (Event != undefined) {
			let EventDate = item.querySelector(".event-date").textContent;
			let Start, End;
			if (EventDate) {
				[Start, End] = EventDate.split("~")
				Start = Start.split("/")[0].split("").reverse().join("").split(" ")[0].split("(")[0].split("").reverse().join("")
					+ "/" + Start.split("/")[1].split(" ")[0].split("(")[0] + "/" + Today.getFullYear()
				if (End.includes("/"))
					End = End.split("/")[0].split("").reverse().join("").split(" ")[0].split("(")[0].split("").reverse().join("")
						+ "/" + End.split("/")[1].split(" ")[0].split("(")[0] + "/" + Today.getFullYear()
				else
					End = Start
			}
			Events[Event].Start = Start ?? Events[Event].Start
			Events[Event].End = End ?? Events[Event].End
		}
	})
	await scrapPages()
}

async function getEvents() {
	let DOM = await getDOM("https://api-us.ten-sura-m.wfs.games/web/announcement?region=1&language=2&phoneType=1")
	let Items = DOM.querySelectorAll(".article-item")
	Object.keys(Events).forEach(Event => { Events[Event].Current = false; Events[Event].New = false });
	for (let i = Items.length - 1; i >= 0; i--) {
		let Name = Items[i].querySelector(".article-body").textContent
		if (Events[Name] == undefined) {
			Events = Object.assign({
				[Name]: {
					Start: FormattedDate,
					End: FormattedDate,
				}
			}, Events)
			console.log(`Assigned ${Name} to Events`)
		}
		Events[Name].Current = true;
		Events[Name].Link = "https://api-us.ten-sura-m.wfs.games" + Items[i].querySelector("a").href;
		Events[Name].New = Items[i].querySelector(".is-new") != null;

	}
	await updateEvents(DOM)
}

// async function getStandardCharacters() {
// 	let DOM = await getDOM("https://api-us.ten-sura-m.wfs.games/web/announcement/99500204?region=1&language=2&phoneType=1")
// 	await scrapCharacters(DOM, Events[Event]);
// 	console.log(Object.keys(Characters))
// 	pushFile("data/characters.json", JSON.stringify(Characters, null, 4));
// }

// let Unknown = {};

// function conversion(typeimg, category) {
// 	let Index = Object.keys(typeconvert).find(key => typeconvert[key] == typeimg);
// 	if (!Index)
// 		Index = Object.keys(typeconvert2).find(key => typeconvert2[key] == typeimg);
// 	if (Index)
// 		return (TypeAssets[Index])
// 	else {
// 		if (Unknown[typeimg] == undefined)
// 			Unknown[typeimg] = {
// 				["Battle Characters"]: 0,
// 				["Protection Characters"]: 0
// 			};

// 		Unknown[typeimg][category]++;
// 	}
// }


// function convertTypes() {
// 	for (const key of Object.keys(Characters)) {
// 		if (Characters[key].Types != undefined)
// 			Characters[key].Types = Characters[key].Types.map(Type => removeQueryParams(Type));
// 		else {
// 			Characters[key].Types = [];
// 			if (Characters[key].Type)
// 				Characters[key].Types.push(conversion(Characters[key].Type, Characters[key].UnitType ?? "Battle Characters"));
// 			if (Characters[key].AtkType)
// 				Characters[key].Types.push(conversion(Characters[key].AtkType, Characters[key].UnitType ?? "Battle Characters"));
// 			if (Characters[key].SecondType)
// 				Characters[key].Types.push(conversion(Characters[key].SecondType, Characters[key].UnitType ?? "Battle Characters"));
// 		}
// 	}
// 	pushFile("data/characters.json", JSON.stringify(Characters, null, 4));
// 	pushFile("data/events.json", JSON.stringify(Events, null, 4));
// 	pushFile("data/forces.json", JSON.stringify(ForcesData, null, 4));
// }

async function getData() {
	Characters = JSON.parse(await pullFile('data/characters.json'));
	Events = JSON.parse(await pullFile('data/events.json'));
	ForcesData = JSON.parse(await pullFile('data/forces.json'));
	// updateForces()
	getEvents();
}


async function updateForces() {
	Characters = JSON.parse(await pullFile('data/characters.json'));
	ForcesData = JSON.parse(await pullFile('data/forces.json'));

	let DOM = await getDOM("https://api-us.ten-sura-m.wfs.games/web/announcement/100000375?region=1&language=2&phoneType=1")
	let ForcesDivs = DOM.querySelectorAll("table:nth-child(5) > tbody > tr > td")
	for await (const ForceDiv of ForcesDivs) {
		const Name = RetardedAlias[ForceDiv.textContent.trim()] ?? ForceDiv.textContent.trim()
		if (!ForcesData.find(array => array.includes(Name)))
			ForcesData.push([Name, removeQueryParams(ForceDiv.querySelector("img").src)])
	}
	// pushFile("data/forces.json", JSON.stringify(ForcesData, null, 4));

	let Items = DOM.querySelectorAll("details > table > tbody > tr")
	for await (const item of Items) {
		let Char;
		for await (const character of Object.keys(Characters))
		{
			const Obj = Characters[character]
			let Name = Obj.Name.split("[")[1].replaceAll("]", "")
			//remove "The" or "the" from name if it starts with it
			if (Name.startsWith("The "))
				Name = Name.replace("The ", "")
			else if (Name.startsWith("the "))
				Name = Name.replace("the ", "")
			if (item.querySelector("td").textContent.includes(Name))
			{
				Char = character;
				break;
			}
		}
		if (Char)
		{
			Characters[Char].Forces = [];
			let ForcesNames = item.querySelectorAll("td")[1].innerHTML.split("<br>")
			ForcesNames.forEach(ForceName => {
				const Name = RetardedAlias[ForceName.trim()] ?? ForceName.trim();
				if (Name != "")
				{
					let Force = ForcesData.findIndex(array => array.includes(Name))
					if (Force != -1)
					{
						if (Characters[Char].Forces == undefined)
							Characters[Char].Forces = [];
						if (!Characters[Char].Forces.includes(Force))
							Characters[Char].Forces.push(Force);
					}
				}
			})
		}

	}
	// pushFile("data/characters.json", JSON.stringify(Characters, null, 4));
}

getData()
// updateForces();