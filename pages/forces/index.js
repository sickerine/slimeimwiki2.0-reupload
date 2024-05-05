import CharacterList from "@/components/characterList";
import Divider from "@/components/divider";
import FadeInImage from "@/components/fadeInImage";
import SearchBar from "@/components/searchBar";
import Toggle from "@/components/toggle";
import Head from "next/head";
import { useMemo, useState } from "react";
import { characters } from "/components/arrays";
import Forces from "/data/forces.json";
import styles from "/styles/Home.module.css";

function ForcesGroup({force, i, namesToggle, search}) {
	const [open, setOpen] = useState(false);
	const totalCharacters = useMemo(() => {
		return Object.keys(characters).filter(key => {
			return characters[key]?.Forces.includes(i);
		}).length;
	}, [i]);
	
	return (
		<div style={open ? {maxHeight: "2000px"} : {}} key={i} className={styles.forcesGroup}>
			<div className={`${styles.forceGroupName} ${styles.hoverClass}`}
				onClick={() => setOpen(!open)}>
				<FadeInImage src={force[1]} alt={force[0].name} />
				<div>
					{force[0]}
				</div>
				<div>
					<span>{totalCharacters}</span> 
					<FadeInImage
						className={styles.forcesGroupCharacterIcon}
						src="/images/63d3948c-f1cf-4768-82b6-7c24cb8eb8a1.png"
						alt="characters" />
					<FadeInImage style={{
						transform: `rotate(${open ? "180deg" : "0deg"})`,
					}} className={styles.forcesArrow} src="/images/f5911eb3-6957-40b4-ae6a-c22e0eb9be19.png"alt="arrow" />
				</div>
			</div>
			{open && <CharacterList
				setClass={styles.forceCharacters}
				confirmFunction={(key) => {
					const isInForce = characters[key]?.Forces.includes(i);
					const nameMatch = search == "" || characters[key].Name.toLowerCase().includes(search.toLocaleLowerCase());
					return namesToggle ? nameMatch && isInForce : isInForce;
				}} />}
		</div>
	)
}

export default function ForcesPage(props) {
	const [search, setSearch] = useState("");
	const [namesToggle, setNamesToggle] = useState(false);
	const sortedForces = useMemo(() => {
		return Forces.map((force, i) => [force, i]).sort((a, b) => {
			return a[0][0].localeCompare(b[0][0]);
		}).filter(([force, i]) => {
			const nameMatch = search == "" || force[0].toLowerCase().includes(search.toLocaleLowerCase());
			const characterMatch = search == "" || Object.keys(characters).find(key => {
				return characters[key]?.Forces.includes(i) && characters[key].Name.toLowerCase().includes(search.toLocaleLowerCase());
			});
			return namesToggle ? characterMatch : nameMatch;
		})
	}, [search, namesToggle]);
	return (
		<>
			<Head>
				<title>Forces List - SLIMEIM.WIKI</title>
				<link rel="canonical" href="https://www.slimeim.wiki/forces" />
			</Head>
			<main>
				<Divider text="Forces" />
				<SearchBar search={search} setSearch={setSearch}>
					<Toggle text={"Characters"} toggle={namesToggle} setToggle={setNamesToggle} textLeft={"Forces"} />
				</SearchBar>
				<div className={styles.forcesGroups}>
					{
						sortedForces.map(([force, i]) => {
							return <ForcesGroup force={force} i={i} key={i} 
								search={search} namesToggle={namesToggle}
							/>
						})
					}
				</div>
            </main>
		</>
	);
}
