import { GetStates } from "@/components/arrays";
import FilterBar from "@/components/filterBar";
import FilterList from "@/components/filterList";
import KeywordFilter from "@/components/keywordFilter";
import SearchBar from "@/components/searchBar";
import TextBox from "@/components/textBox";
import Toggle from "@/components/toggle";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { useState } from "react";
import { Groups } from "/components/arrays";
import CharacterList from "/components/characterList";
import Divider from "/components/divider";

export default function Home({ storage }) {
	const [filter, setFilter, getSort, setSort, search, setSearch] = GetStates(storage);
	const [descriptionsToggle, setDescriptionsToggle] = useState(false);

	return (
		<>
			<Head>
				<title>Characters - SLIMEIM.WIKI</title>
				<link
					rel="canonical"
					href="https://www.slimeim.wiki/characters"
				/>
			</Head>
			<main className={styles.main}>
				<TextBox
					style={{
						marginTop: "10px",
						borderRadius: "5px",
						backgroundColor: "rgba(255,0,0,0.5)",
						color: "white",
					}}
					text={
						<div>
							Please be aware that not all characters have been
							assigned their appropriate <b>weapons</b>.
						</div>
					}
				/>
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
				<Divider text={"Characters"} />
				<CharacterList
					filter={filter}
					setFilter={setFilter}
					getSort={getSort}
					setSort={setSort}
					descriptionsToggle={descriptionsToggle}
					search={search}
				/>
			</main>
		</>
	);
}
