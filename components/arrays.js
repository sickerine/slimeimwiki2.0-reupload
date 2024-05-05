import forces from "/data/forces.json"
import { useState, useEffect, Fragment } from "react";
import characters from "/data/characters.json"

let Tiers = [
	{
		Title: "SSS",
		Color: "red",
	},
	{
		Title: "SS",
		Color: "crimson",
	},
	{
		Title: "S",
		Color: "#A60D22",
	},
	{
		Title: "A",
		Color: "orange",
	},
	{
		Title: "B",
		Color: "darkgoldenrod",
	},
	{
		Title: "C",
		Color: "grey",
	}
]

const ForcesMapped = forces.map((array, i) => [i])

const AspectRatios = {
	"/images/e3975595-5405-4704-a33e-81ec0f9e79e7.png": "90 / 29",
	"/images/c168cfbb-b59b-4ec3-b7af-42128a70d15f.png": "75 / 29",
	"/images/a21801ba-babf-441f-8ded-a57bc2605ab1.png": "60 / 29"
}

function RouteFilter(group, i, router) {
	if (group >= Groups.length) {
		if (group == Groups.length + 2)
			i = ForcesMapped[i];
		else if (group == Groups.length + 3)
			i = TownBuffs[i]
		else
			i = filterKeywords[i[0]][i[1]];
	}
	sessionStorage.setItem("filter", JSON.stringify([]));
	ManageFilterStorage(group, i);
	router.push("/characters");
}

const GroupsConfig = [
	[["UnitType"], 'or'],
	[["Types"], 'and'],
	[["Weapon"], 'or'],
	[["Growth"], 'or'],
	[["Octagram"], 'or'],
	[["SecretType"], 'or'],
	[["Rarity"], 'or'],
	[["Types"], 'and'],
	[["Skill1",
		"Skill2", "DivineProtection", "SupportDivineProtection",
		"ProtectionSkill", "GuidanceEnhancementTrait", "SecretSkillTrait", "Skill1Fused", "Skill2Fused"], 'and', "Skills"],
	[["Trait1", "Trait1A", "Valor1", "Valor1A"], 'and', "Traits"],
	[["Forces"], 'and', "Forces"],
	[["Town1", "Town2"], 'and', "Town Buffs"]
]

const Stars = ["/images/e74833a8-e4d1-45e6-b7c0-40cc06365b1b.png",
	"/images/c5e77020-ecd4-404c-a3af-a993c051b2ba.png",
	"/images/a21801ba-babf-441f-8ded-a57bc2605ab1.png",
	"/images/c168cfbb-b59b-4ec3-b7af-42128a70d15f.png",
	"/images/e3975595-5405-4704-a33e-81ec0f9e79e7.png",
	"/images/a58cb09e-62f2-4a4e-953e-235266afca06.png"]

const Groups = [
	[
		["/images/93b5a584-ba48-4389-9726-0788be7cbaf0.png", "Battle Characters"],
		["/images/53147347-4e13-4f48-a6da-29a06f706f86.png", "Protection Characters"]
	],
	[
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icAttackTypeMagic.png",
			"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/0a1f0e0465d9153bf363f5d8dfc46c27.png", "M-", "Magic"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icAttackTypePhysics.png",
			"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/500f55cd6c984a5431af3db90c314dc2.png", "P-", "Physical"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementFire.png",
			"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/3e46a97d38612fbb7c3bc2983d5aa6c4.png", "Fire"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementEarth.png",
			"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/3e3d37861ef215f8ccfbf31fec4f2ac3.png", "Earth"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementAir.png",
			"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/9e242e9d670cd1e0d1b43e72f44bf020.png", "Space"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementWind.png",
			"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/accda93bf159b8676eb06285bc727e65.png", "Wind"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementWater.png",
			"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/ef15dd203c040c8e1563a351acca1f83.png", "Water"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementDark.png",
			"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/56431d640473b9c3653fc6ac9d483298.png", "Dark"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icElementHoly.png",
			"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/b67440182d27761d24e085feed59350d.png", "Light"],
	],
	[
		["/images/46b7fadf-5958-414d-aed0-6001bdc241a1.png", "Sword"],
		["/images/899622b9-fddc-436e-a844-ca898b77049f.png", "Katana"],
		["/images/81814941-0ceb-44ac-afb4-d46e0de1a6cc.png", "Hammer"],
		["/images/4c456033-d54c-4176-ac63-64a2944343ef.png", "Lance"],
		["/images/61e1361b-da5f-427d-bda7-6222c67a8d37.png", "Greatsword"],
		["/images/b0557aa1-32b2-4a11-86a0-6d52c5a5732f.png", "Tome"],
		["/images/9ea953f7-83ad-4099-9a7d-e3ddfe33c2d8.png", "Fist"],
	],
	[
		["/images/b0ef6fd8-0247-426c-9220-ac53b211911b.png", "EX Attack", "Attack"],
		["/images/7907d473-c8b5-4c1f-ba30-291d6aca9ddb.png", "EX Balance", "Balance"],
		["/images/4a7f2187-0757-4fad-943d-c786af798be2.png", "EX Defense", "Defense"],
	],
	[
		["/images/1599b702-c168-4ff4-8bd7-0b1400f85ccc.png", true, "Octagram Bazaar"]
	],
	[
		["/images/6ffd137c-de38-4551-b352-9aed9e75966f.png", "All"],
		["/images/d65c4056-71b6-489e-8a75-b4c695d2967e.png", "Single"]
	],
	[
		["/images/a21801ba-babf-441f-8ded-a57bc2605ab1.png", 3],
		["/images/c168cfbb-b59b-4ec3-b7af-42128a70d15f.png", 4],
		["/images/e3975595-5405-4704-a33e-81ec0f9e79e7.png", 5],
	],
	[
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/4b5b2cb58f5f3cae8eb35c189da736cf.png", "Anti-Water"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/47bc7ddd207676866920acf9692ec45f.png", "Anti-Fire"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/93043b256fe14bed62ba553498ab9f0f.png", "Anti-Space"],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/a571147d09bd7a463905e7e547bafd58.png", 'Anti-Dark'],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/69b47880a0d4daec4b2166b55694203d.png", 'Anti-Earth'],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/543570723537fa79d8ad30ec1e307da7.png", 'Anti-Light'],
		["https://ten-sura-m-assets-us.akamaized.net/web-assets/images/d559d0686e9c3fc2cb6e1820032601e0.png", "Anti-Wind"]
	]

]

let TownBuffs = []

const MaxStats = {
	"Hp": [[], []],
	"Atk": [[], []],
	"Def": [[], []],
	"EP": [[], []],
	"Output": [[], []],
}

const MinStats = {
	"Hp": [[], []],
	"Atk": [[], []],
	"Def": [[], []],
	"EP": [[], []],
	"Output": [[], []],
}

function reduceCharacters(obj, minmax) {
	Object.keys(obj).forEach((key) => {
		let Protection = Object.keys(characters).reduce((acc, char) => {
			if (characters[char].UnitType === "Protection Characters") {
				acc[char] = characters[char];
			}
			return acc;
		}, {});

		let Battle = Object.keys(characters).reduce((acc, char) => {
			if (characters[char].UnitType !== "Protection Characters") {
				acc[char] = characters[char];
			}
			return acc;
		}, {});

		obj[key][0][0] = Math.min(...Object.values(Battle).map((char) => char[minmax + key] ?? (key === "Output" ? 60 : 150)))
		obj[key][0][1] = Math.max(...Object.values(Battle).map((char) => char[minmax + key] ?? (key === "Output" ? 60 : 150)))
		obj[key][1][0] = Math.min(...Object.values(Protection).map((char) => char[minmax + key] ?? (key === "Output" ? 60 : 150)))
		obj[key][1][1] = Math.max(...Object.values(Protection).map((char) => char[minmax + key] ?? (key === "Output" ? 60 : 150)))
	})
}

reduceCharacters(MaxStats, "Max");
reduceCharacters(MinStats, "Min");

function removeSecretSkillGauge(str) {
	const index = str.indexOf("Use 200% of secret skill gauge");
	if (index >= 0) {
		return str.substring(0, index);
	}
	return str;
}

function FilterDescription(text) {
	let DescriptionStart = text.indexOf(":");
	let ActualDescription = text.slice(DescriptionStart + 1);
	return removeSecretSkillGauge(ActualDescription);
}


function ManageFilterStorage(FilterGroup, FilterChoice, filter) {
	if (!filter)
		filter = JSON.parse(sessionStorage.getItem("filter"));
	const FilterVariable = GroupsConfig[FilterGroup];
	const newFilter = [...filter];
	let filterGroup = newFilter[FilterGroup] ?? [];
	const choiceIndex = filterGroup.indexOf(FilterChoice);
	if (choiceIndex >= 0) {
		filterGroup.splice(choiceIndex, 1);
	} else {
		if (FilterVariable[1] == 'and')
			filterGroup.push(FilterChoice);
		else
			filterGroup = [FilterChoice];
	}
	newFilter[FilterGroup] = filterGroup;
	sessionStorage.setItem("filter", JSON.stringify(newFilter));
	return newFilter;
}

Object.keys(characters).forEach((key) => {
	["Town1", "Town2"].forEach((town) => {
		if (characters[key][town] !== undefined) {
			if (!TownBuffs.find(buff => buff.includes(characters[key][town])))
				TownBuffs.push([characters[key][town]]);
			// if (TownBuffs[characters[key][town]] === undefined)
			// 	TownBuffs[characters[key][town]] = [];
			// TownBuffs[characters[key][town]].push(key);
		}
	})
})

const Sorts = [
	[
		"/images/171976dc-b295-458e-880c-d3f9cab3081c.png",
		(keys) => keys,
		"Name",
		"Release",
	],
	[
		"/images/835fc623-2e28-4b33-81d7-bcf06c3f46ad.png",
		(keys) =>
			keys.sort((b, a) => {
				return characters[a].MaxAtk - characters[b].MaxAtk;
			}),
		"MaxAtk",
		"Attack",
	],
	[
		"/images/b05271b7-bd0e-4347-a5bb-7f00baf5cbbb.png",
		(keys) =>
			keys.sort((b, a) => {
				return characters[a].MaxHp - characters[b].MaxHp;
			}),
		"MaxHp",
		"Health",
	],
	[
		"/images/b219f051-f62d-49ed-96db-23a00af3e8c4.png",
		(keys) =>
			keys.sort((b, a) => {
				return characters[a].MaxDef - characters[b].MaxDef;
			}),
		"MaxDef",
		"Defense",
	],
	[
		"/images/001946c6-3d30-43e5-9d39-4593640e5316.png",
		(keys) =>
			keys.sort((b, a) => {
				return characters[a].MaxEP - characters[b].MaxEP;
			}),
		"MaxEP",
		"Existence",
	],
	[
		"/images/acf84951-74fb-45fc-b248-e58d9b7d3569.png",
		(keys) =>
			keys.sort((b, a) => {
				return characters[a].Rarity - characters[b].Rarity;
			}),
		"Rarity",
		"Rarity",
	],
	[
		"/images/63d3948c-f1cf-4768-82b6-7c24cb8eb8a1.png",
		(keys) =>
			keys.sort((a, b) => {
				return characters[a].Name.localeCompare(characters[b].Name);
			}),
		"Name",
		"Name",
	],
];


function getStorageItem(key, def, storage) {
	const item = storage ? storage.getItem(key) : null;
	return item ? JSON.parse(item) : def;
}

function GetStates(storage) {
	const [filter, setFilter] = useState(getStorageItem("filter", [], storage));
	const [getSort, setSort] = useState(
		getStorageItem("sort", [0, 0], storage)
	);
	const [search, setSearch] = useState(
		getStorageItem("search", "", storage)
	);
	useEffect(() => {
		setFilter(getStorageItem("filter", [], storage));
		setSort(getStorageItem("sort", [0, 0], storage));
		setSearch(getStorageItem("search", "", storage));
	}, [storage]);
	return [filter, setFilter, getSort, setSort, search, setSearch];
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const RarityColors = [
	0,
	0,
	0,
	"linear-gradient(90deg, #8A7DA6, #D9CEE8)",
	"linear-gradient(90deg, #E78722, #E78722)",
	"linear-gradient(90deg, #E68DF6, #5AF7FD)",
	"linear-gradient(90deg, #FE5DAE, #F5C460)",
];

function wordsRegex(words) {
	const regexStr = `(?<!\\| )\\b(${words.join('|')})\\b`;
	return new RegExp(regexStr, 'gi');
}
function SkillTextFilter(text, nostat, router) {
	if (text) {
		text = text.trim();
		let alphabet = [
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g",
			"h",
			"i",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z",
		];
		let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
		let symbols = [")", "%"];
		text = text.replaceAll(/\(([^\)]+) *; *([^\)]+)\)/g, function (match, g1, g2) {
			return "(" + g1 + ") (" + g2 + ")";
		});
		text = text.replaceAll("Lv.1/Lv.10", "");
		text = text.replaceAll(
			"Soul of Protection",
			"Soul of Divine Protection"
		);
		text = text.replace(
			/%[a-zA-Z]/g,
			(match) => match.slice(0, 1) + "<br>" + match.slice(1)
		);
		text = text.replace(
			/％[a-zA-Z]/g,
			(match) => match.slice(0, 1) + "<br>" + match.slice(1)
		);
		text = text.replaceAll("Cost:", "<span appearance='cost'>• Cost:");
		if (text.includes("Cost:")) {
			text = text + " •</span> ";
		}
		alphabet.forEach((letter) => {
			text = text.replaceAll(
				". " + letter.toUpperCase(),
				".<br>" + letter.toUpperCase()
			);
			text = text.replaceAll(
				"." + letter.toUpperCase(),
				".<br>" + letter.toUpperCase()
			);
			alphabet.forEach((letter2) => {
				text = text.replaceAll(
					letter + letter2.toUpperCase(),
					letter + ". <br>" + letter2.toUpperCase()
				);
			});
			symbols.forEach((symbol) => {
				text = text.replaceAll(
					symbol + letter.toUpperCase(),
					symbol + "<br>" + letter.toUpperCase()
				);
			});
			symbols.forEach((symbol) => {
				text = text.replaceAll(
					symbol + "." + letter.toUpperCase(),
					symbol + "<br>" + letter.toUpperCase()
				);
			});
			numbers.forEach((letter2) => {
				text = text.replaceAll(
					letter2 + letter.toUpperCase(),
					letter2 + "<br>" + letter.toUpperCase()
				);
			});
		});
		text = text.replaceAll("(s)", "/s/");
		text = text.replaceAll("(", "<span appearance = 'turns'>(");
		text = text.replaceAll(").", ")");
		text = text.replaceAll("%/", "/");
		text = text.replaceAll("<br>Max", ")<br><span appearance = 'turns'>(Max");
		text = text.replaceAll(")", ")</span>");
		text = text.replaceAll("/s/", "(s)");
		text = text.replaceAll(" Increases", "<br>Increases");
		text = text.replaceAll(/\+?x?\d+(:?\d+)?\/?\d*%?/g, function (match) {
			return "<span appearance='percentage'>" + match + "</span>";
		});


		if (!nostat)
			forces.map((force, i) => ([force, i])).sort((a, b) => b[0][0].length - a[0][0].length).forEach(([force, i]) => {
				text = text.replaceAll(wordsRegex([force[0]]), function (match) {
					return `
					<div appearance="descriptionIcon" group="${Groups.length + 2}" i="${i}">
						<div appearance="iconImageContainer" >
							<img appearance="iconImage" src="${force[1]}"/>
							| ${match}
						</div>
					</div>`
				})
			});

		if (!nostat)
			Groups[1].forEach((group, i) => {
				if (i > 0)
					text = text.replaceAll(wordsRegex(group), function (match) {
						return `
						<div appearance="descriptionIcon" element="true" group="${1}" i="${i}" >
							<div appearance="iconImageContainer" >
								<img appearance="iconImage" src="${group[0]}"/>
								${capitalizeFirstLetter(match)}
							</div>
						</div>`
					})
			});
		const stats = [
			[
				"/images/3a9f4209-9d7d-4b68-981b-69cc7a9f9733.png",
				"ATK",
			],
			[
				"/images/44370964-c4b7-489d-8ad5-0f4c4d7bc0b4.png",
				"HP",
			],
			[
				"/images/c52b14c4-cd1b-4ee6-9f6d-430c411f2c23.png",
				"DEF",
			],
		];
		if (!nostat)
			stats.forEach((stat) => {
				text = text.replaceAll(
					stat[1],
					`<div appearance="descriptionIcon" stat="true" ><div appearance="iconImageContainer" ><img appearance="iconImage" src="${stat[0]}"/>${stat[1]}</div></div>`
				);
			});

		text = text.replaceAll("(", "");
		text = text.replaceAll(")", "");
		text = text.replaceAll("Turns:", "Turns ");
		text = text.replaceAll("Max:", "Max ");
		text = text.replaceAll("Max ", "Max ");
		// text = text.replaceAll("Turns ", "Turns");
		text = text.replaceAll(
			"; Uses by this character per battle: ",
			"</span><br><span appearance = 'turns'>Uses "
		);
		// text = text.replaceAll(":", "");

		// const souls = [["Soul of Skills", "blue"], ["Soul of Divine Protection", "green"], ["Soul of Secrets", "orange"]]
		// souls.forEach((soul) => {
		// 	text = text.replaceAll(soul[0], `<div style="background-color: ${soul[1]}; color: white" class="descriptionIcon" ><div>${soul[0]}</div></div>`)
		// })
	}
	return text;
}

Object.keys(characters).forEach((character) => {
	const me = characters[character];
	me.Forces = me.Forces ?? [];
	if (me.UnitType == "Protection Characters") {
		me.Types.forEach((type) => {
			const index = forces.findIndex((force) => force[1] == type);
			if (index != -1) me.Forces.push(index);
		});
	}
});


let Icons = {
	Notice: [
		"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_info.png",
		"red",
	],
	Event: [
		"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_event.png",
		"yellow",
	],
	Recruit: [
		"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_scout.png",
		"pink",
	],
	Campaign: [
		"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_campaign.png",
		"green",
	],
	Issues: [
		"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_bug.png",
		"grey",
	],
	Update: [
		"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_update.png",
		"blue",
	],
	Maintenance: [
		"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_maintenance.png",
		"purple",
	],
};

function removeQueryParams(url) {
	if (!url) return url;
	const index = url.indexOf('?');
	return index === -1 ? url : url.slice(0, index);
}

function manageFilter(FilterGroup, FilterChoice, setFilter, filter) {
	setFilter(ManageFilterStorage(FilterGroup, FilterChoice, filter));
}

function CheckFilter(id, filter) {
	let Character = characters[id];
	let Appear = true;
	filter.forEach((array) => {
		if (array && array.length > 0 && Appear == true) {
			let Index = filter.indexOf(array);
			let VariableNames = GroupsConfig[Index][0];
			array.forEach((Value) => {
				let Found = false;
				VariableNames.forEach((VariableName) => {
					let Variable = Character[VariableName];
					let ToCompare = Groups[Index]
						? Groups[Index][Value]
						: Value;
					if (ToCompare && Variable)
						ToCompare.forEach((Comparable) => {
							if (Appear == true) {
								let Value = Variable;
								if (
									(typeof Variable == typeof "" &&
										Index == Groups.length + 1) ||
									Index == Groups.length + 2
								)
									Value = FilterDescription(Value);
								if (Value.includes) {
									if (Value.includes(Comparable))
										Found = true;
								} else if (Value == Comparable) Found = true;
							}
						});
				});
				if (Found == false) Appear = false;
			});
		}
	});
	return Appear;
}

export { RarityColors, Sorts, CheckFilter, GetStates, Tiers, manageFilter, RouteFilter, removeQueryParams, GroupsConfig, Groups, Stars, ForcesMapped, MinStats, MaxStats, removeSecretSkillGauge, FilterDescription, ManageFilterStorage, TownBuffs, SkillTextFilter, characters, AspectRatios, Icons }


