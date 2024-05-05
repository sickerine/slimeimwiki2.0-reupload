import { characters } from "@/components/arrays";
import Divider from "@/components/divider";
import fs from "fs";
import path from "path";
import { useState, useEffect, useRef } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import Toggle from "@/components/toggle";

function OptionsList({ optionList, me, value, setValue, getValue }) {
	optionList.sort();
	return (
		<select
			className="w-full bg-color1 rounded p-2"
			value={me[value]}
			onChange={(e) => {
				setValue(e.target.value);
			}}
		>
			<option value=""></option>
			{optionList.map((option, i) => {
				return (
					<option key={i} value={option}>
						{option}
					</option>
				);
			})}
		</select>
	);
}

function ToggleContainer({ me, value, getValue, setValue }) {
	return (
		<div className="h-10 p-1 flex rounded w-full bg-color1">
			<Toggle
				toggle={getValue}
				setToggle={setValue}
				text={"true"}
				textLeft={"false"}
			/>
		</div>

	)
}

function ProperElement({ me, arr, getValue, setValue, originalCopy }) {
	const options = ["Growth", "Weapon", "UnitType", "SecretType"];
	const bools = ["New", "Octagram"];
	const preview = ["Art", "Icon", "ProtectionSkillIcon", "Skill1FusedIcon", "Skill1Icon", "Skill2FusedIcon", "Skill2Icon"];
	const [key, type, optionValues] = arr;
	const newValue = useRef(getValue);

	if (options.includes(key))
		return <OptionsList optionList={optionValues} me={me} value={key} getValue={getValue} setValue={setValue} />;
	else if (bools.includes(key))
		return <ToggleContainer me={me} type={type} value={key} getValue={getValue} setValue={setValue} />;
	else
		return (
			<div className="grid grid-cols-12 gap-1">
				{preview.includes(key) && (
					<div className="col-span-2 bg-color1 rounded p-2 flex justify-center items-center aspect-square">
						<img src={getValue} />
					</div>
				)}
				<div
					className={`w-full bg-color1 break-words rounded p-2 col-span-${preview.includes(key) ? "10" : "full"
						}`}
					contentEditable="true"
					dangerouslySetInnerHTML={{
						__html: me[key],
					}}
					onInput={(e) => {
						let value = e.target.innerHTML;
						if (type == "number") {
							value = parseInt(e.target.innerHTML);
						}
						else if (type == "object") {
							value = JSON.parse(e.target.innerHTML);
						}
						newValue.current = value;
					}}
				></div>
				<div className="grid grid-cols-2 col-span-12 bg-color2 overflow-hidden rounded">
					<button className="bg-color1 p-1 text-s hover:bg-color2" onClick={() => {
						console.log(newValue.current);
						setValue(newValue.current);
					}}>Apply</button>
					<button
						className="bg-color1 rounded p-1 text-s hover:bg-color2"
						onClick={() => {
							setValue(originalCopy[arr[0]]);
						}}
						>
						Revert
					</button>
				</div>
				
			</div>
		);
}

function ValueContainer({ me, arr, originalCopy }) {
	const [getValue, setValue] = useState(me[arr[0]]);
	const typeColors = {
		number: "bg-green-400",
		string: "bg-orange-400",
		object: "bg-pink-400 ",
		boolean: "bg-blue-400 ",
	};
	if (getValue != undefined)
		me[arr[0]] = getValue;
	return (
		<div className={`w-full text-color7 ${JSON.stringify(originalCopy[arr[0]]) == JSON.stringify(me[arr[0]]) ? "brightness-50" : ""}`}>
			<div className="text-color5 flex items-center gap-2">
				{arr[0]}
				<div className={` ${typeColors[arr[1]]} px-1 rounded text-[0.65em] text-black`}>
					{arr[1]}
				</div>
			</div>
			<ProperElement me={me} arr={arr} getValue={getValue} setValue={setValue} originalCopy={originalCopy} />
		</div>
	)
}

function ListType({ matchType, fields, me, originalCopy }) {

	return (
		<>
			{/* <Divider text={me.Name} /> */}
			{fields.map((arr, i) => {
				return (
					<ValueContainer me={me} arr={arr} key={i} originalCopy={originalCopy} />
				);
			})}
		</>
	);
}

export default function Edit({ storage, id }) {
	const { data: session, status } = useSession();
	const me = characters[id];
	let fields = [];
	Object.keys(characters).forEach((char) => {
		Object.keys(characters[char]).forEach((field) => {
			if (!fields.find((arr) => arr.includes(field))) {
				fields.push([field, typeof characters[char][field], []]);
			}
			else {
				const index = fields.findIndex((arr) => arr.includes(field));
				if (!fields[index][2].includes(characters[char][field]))
					fields[index][2].push(characters[char][field]);
			}
		});
	});
	fields = fields.sort();
	const Exclude = ["AtkType", "EP", "EXAbility1Icon", "EXAbility2Icon", "SeconType", "Stats", "Type"]
	fields = fields.filter(([key, type]) => !Exclude.includes(key))
	const originalCopy = JSON.parse(JSON.stringify(me));
	return (
		<main className="pt-7">
			<Divider text={me.Name} />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
				{
					["INFO"].map((type, i) => {
						return <ListType matchType={type} fields={fields} me={me} key={type + i} originalCopy={originalCopy} />
					})

				}
			</div>
			{/* A button to send a save request to the /update-character endpoint, it should support session auth */}
			<div className="grid grid-cols-1 mt-8 gap-[15px]">
				<button
					className="bg-color3 border border-color5 hover:bg-color5 transition-colors text-color7 rounded p-2 w-full"
					onClick={async () => {
						const res = await fetch("/api/update-character", {
							method: "POST",
							body: JSON.stringify({
								id: id,
								newCopy: me,
							}),
						});
						if (res.status == 200) {
							alert("Success!");
						} else {
							alert("Error!");
						}
					}}
				>
					Save
				</button>
			</div>


		</main>
	);
}

export async function getStaticProps({ params }) {
	return {
		props: {
			id: params.id,
		},
	};
}

export async function getStaticPaths() {
	const filePath = path.join(process.cwd(), "data", "characters.json");
	const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

	const paths = Object.keys(data).map((char, i) => {
		return {
			params: { id: char },
		};
	});

	return {
		paths: paths,
		fallback: false,
	};
}
