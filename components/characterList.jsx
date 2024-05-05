import styles from "@/styles/Home.module.css";
import { useMemo } from "react";
import { CheckFilter, Sorts } from "./arrays";
import searchMatch from "./searchMatch";
import CharacterIcon from "/components/characterIcon";
import characters from "/data/characters.json";

function SortBar({ getSort, setSort, Sorts }) {
	return (
		<div className={styles.sortBar}>
			<div
				className={`${styles.sortItem} ${styles.hoverClass}`}
				onClick={() => {
					let newSort = [...getSort];
					newSort[1] = (newSort[1] + 1) % 2;
					setSort(newSort);
				}}
			>
				<img
					style={{
						transform: `rotate(${getSort[1] ? "180deg" : "0deg"})`,
					}}
					src={
						"/images/f5911eb3-6957-40b4-ae6a-c22e0eb9be19.png"
					}
				/>
			</div>
			{Sorts.map((sort, i) => (
				<div
					className={`${styles.sortItem} ${styles.hoverClass}`}
					key={sort[0]}
					sort-active={getSort[0] == i ? "true" : "false"}
					onClick={() => {
						let newSort;
						if (i === getSort[0])
							newSort = [i, (getSort[1] + 1) % 2];
						else newSort = [i, 0];
						setSort(newSort);
						sessionStorage.setItem("sort", JSON.stringify(newSort));
					}}
				>
					<img src={sort[0]} />
					{sort[3]}
				</div>
			))}
		</div>
	);
}

function SortCharacters(keys, getSort) {
	if (!getSort) return keys;
	let ret = Sorts[getSort[0]][1](keys);
	if (getSort[1] === 1) ret = ret.reverse();
	return ret;
}

function CharacterList(props) {
	const Icon = props.AlternateCharacterIcon ?? CharacterIcon;
	const filter = props.filter ?? [];
	const confirmFunction = props.confirmFunction ?? (() => true);
	const getSort = props.getSort ?? null;
	const setSort = props.setSort ?? null;
	const list = useMemo(() => {
		return SortCharacters(Object.keys(characters), getSort).filter(
			(key) =>
				confirmFunction(key) &&
				searchMatch(props.descriptionsToggle, props.search, key) &&
				CheckFilter(key, filter)
		);
	}, [
		filter,
		getSort,
		confirmFunction,
		props.search,
		props.descriptionsToggle,
	]);
	return (
		<div className={props.className ?? styles.characterList}>
			{getSort && (
				<SortBar getSort={getSort} setSort={setSort} Sorts={Sorts} />
			)}
			<div
				className={
					props.classNameContainer ?? styles.charactersContainer
				}
			>
				{list.map((key) => {
					return (
						<Icon
							filter={filter}
							text={getSort ? Sorts[getSort[0]][2] : "Name"}
							key={key}
							id={key}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default CharacterList;
