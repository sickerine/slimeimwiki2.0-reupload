import Divider from "@/components/divider";
import styles from "@/styles/Home.module.css";
import TextBox from "@/components/textBox";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import SearchBar from "@/components/searchBar";
import Toggle from "@/components/toggle";
import FilterBar from "@/components/filterBar";
import KeywordFilter from "@/components/keywordFilter";
import {
    Groups, ForcesMapped, TownBuffs, manageFilter, GetStates
} from "/components/arrays.js";
import FilterList from "@/components/filterList";
import characters from "@/data/characters.json"
import { Tier } from "@/components/tier";
import CharacterIcon from "@/components/characterIcon";

export default function Home({storage}) {
	const [tierList, setTierList] = useState({
		"SSS": [],
		"SS": [],
		"S": [],
		"A": [],
		"B": [],
		"C": [],
	});
	const [selectedCharacter, setSelectedCharacter] = useState(null);
	const [filter, setFilter, getSort, setSort] = GetStates(storage);
	const [search, setSearch] = useState("");
	const [descriptionsToggle, setDescriptionsToggle] = useState(false);
	const router = useRouter();
	const confirmFunction = search.length > 0
			? (key) => {
					const me = characters[key];
					if (!descriptionsToggle)
						return me.Name.toLowerCase().includes(
							search.toLowerCase()
						);
					const str = JSON.stringify(
						Object.values(me)
					).toLowerCase();
					if (
						str.includes(search.toLocaleLowerCase())
					)
						return true;
					return false;
			  }
			: (() => true)

	// useEffect(() => {
	// 	function handleClick(e) {
	// 		//check if ancestor has tierlist-clickable class, if not then unset selectedCharacter
	// 		let target = e.target;
	// 		while (target != null) {
	// 			if (target.classList.contains("tierlist-clickable"))
	// 				return;
	// 			target = target.parentElement;
	// 		}
	// 		setSelectedCharacter(null);
	// 	}
	// 	window.addEventListener("click", handleClick);
	// 	return () => window.removeEventListener("click", handleClick);
	// }, []);

	function NewCharacterIcon(props)
		{
			return (
				<CharacterIcon
					{...props}
					className={`${styles.smallIcon} ${selectedCharacter ? (selectedCharacter == props.id ? "animate-pulse" : "opacity-50") : "" } tierlist-clickable`}
					onClick={
						( e ) => {
							if (selectedCharacter == props.id) {
								setSelectedCharacter(null);
							} else {
								setSelectedCharacter(props.id);
							}
						}
					}
				/>
			);
		}

	return (
		<>
			<Head>
				<title>Tier List - SLIMEIM.WIKI</title>
				<meta
					rel="canonical"
					href="https://www.slimeim.wiki/tierlist"
				/>
			</Head>
			<main>
			<TextBox
					style={{
						marginTop: "10px",
						borderTopLeftRadius: "5px",
						borderTopRightRadius: "5px",
					}}
				>
					<h1 style={{ fontSize: "1em", fontWeight: "normal" }}>
						<b>Source: </b><span className="">The Japanese</span>
							<br/>
					</h1>
				</TextBox>
				<TextBox
					style={{
						background: "linear-gradient(90deg, darkred, crimson)",
						color: "white",
						borderBottomLeftRadius: "5px",
						borderBottomRightRadius: "5px",
					}}
					text={
						<div>
							Please be aware that not all characters have been
							assigned their appropriate <b>weapons</b>.
						</div>
					}
				>
				</TextBox>
				<Divider text={"Filters"} />
				<SearchBar search={search} setSearch={setSearch}>
					<Toggle
						text={"Search Skills"}
						toggle={descriptionsToggle}
						setToggle={setDescriptionsToggle}
					/>
				</SearchBar>
				<div className={styles.filterBar}>
					<FilterBar filter={filter} setFilter={setFilter} />
				</div>
				<div className={styles.keywordFilterList}>
					<KeywordFilter
						filter={filter}
						setFilter={setFilter}
						text={"SKILLS"}
						id={Groups.length}
					/>
					<KeywordFilter
						filter={filter}
						setFilter={setFilter}
						text={"TRAITS"}
						id={Groups.length + 1}
					/>
					<KeywordFilter
						filter={filter}
						setFilter={setFilter}
						text={"FORCES"}
						id={Groups.length + 2}
					/>
					<KeywordFilter
						filter={filter}
						setFilter={setFilter}
						text={"TOWN"}
						id={Groups.length + 3}
					/>
				</div>
				<FilterList filter={filter} setFilter={setFilter} />
				<Divider text={"TIER LIST"} />
				<div className="flex flex-col gap-1 bg-color1 rounded">
					{
						Object.keys(tierList).map((tier) => {
							return (
								<Tier
									onClick={selectedCharacter ? () => {
										setTierList({
											...tierList,
											[tier]: [...tierList[tier], selectedCharacter]
										})
										setSelectedCharacter(null);
									} : null}
									className={(selectedCharacter ? "animate-pulse cursor-pointer hover:animate-none" : "") + " tierlist-clickable"}
									tier={tier} ignore={true} filter={filter} key={tier} confirmFunction={(key) => confirmFunction(key) && tierList[tier].includes(key)}
									AlternateCharacterIcon={NewCharacterIcon}
								/>
							)
						})
					}
					<div
						onClick={() => {
							//remove selectecCharacter from tierList
							const tier = Object.keys(tierList).find((tier) => tierList[tier].includes(selectedCharacter));
							if (tier) {
								setTierList({
									...tierList,
									[tier]: tierList[tier].filter((id) => id != selectedCharacter)
								})
								setSelectedCharacter(null);
							}
						}}
						className={`w-full bg-color2 flex flex-wrap p-2 tierlist-clickable ${(selectedCharacter ? "cursor-pointer" : "")}`}>
						{
							Object.keys(characters).map((id) => 
								!Object.values(tierList).flat().includes(id) && confirmFunction(id) &&
									<NewCharacterIcon
										id={id}
										key={id}
										filter={filter}
										text={"None"}
									/>
										
							)
						}
					</div>
				</div>
			</main>
		</>
	);
}
