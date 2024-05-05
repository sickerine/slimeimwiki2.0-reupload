import FadeInImage from "@/components/fadeInImage";
import styles from "@/styles/Home.module.css";
import { Fragment, useEffect, useState } from "react";
import {
	AspectRatios,
	Groups,
	GroupsConfig,
	characters,
	manageFilter,
	removeQueryParams
} from "/components/arrays";
import forces from "/data/forces.json";

function FilterButton({ array, group, filter, setFilter }) {
	const [active, setActive] = useState("false");
	const FilterGroup = Groups.indexOf(group);
	const FilterChoice = group.indexOf(array);
	const GroupConfig = GroupsConfig[FilterGroup];
	const clicked = () => {
		manageFilter(FilterGroup, FilterChoice, setFilter, filter);
	};

	useEffect(() => {
		if (!filter[FilterGroup] || !filter[FilterGroup].includes(FilterChoice))
			setActive("false");
		else setActive("true");
	}, [filter]);

	return GroupConfig[3] ? (
		<div
			className={`${styles.hoverClass}`}
			active-toggle={active}
			onClick={clicked}
		>
			{GroupConfig[3][FilterChoice]}
		</div>
	) : (
		<FadeInImage
			style={{ aspectRatio: `${AspectRatios[array[0]] ?? "1 / 1"}` }}
			className={`${styles.hoverClass}`}
			src={array[0]}
			active-toggle={active}
			onClick={clicked}
			alt={array[array.length - 1]}
		/>
	);
}

export default function FilterBar({ filter, setFilter }) {
	let Types = [];
	Object.keys(characters).forEach((key) => {
		let character = characters[key];
		if (character.Types)
			character.Types.forEach((type) => {
				let IsInGroups = false;
				Groups.forEach((group) => {
					if (group.find((arr) => arr.includes(type)))
						IsInGroups = true;
				});
				if (
					!IsInGroups &&
					!Types.find((arr) => arr.includes(type)) &&
					!forces.find(
						(force) =>
							removeQueryParams(force[1]) ===
							removeQueryParams(type)
					)
				)
					Types.push([type, type]);
			});
	});
	return (
		<>
			{Groups.map((group, groupIndex) => (
				<Fragment key={groupIndex}>
					<div className={styles.filterList} key={groupIndex}>
						{group.map((key, keyIndex) => (
							<FilterButton
								filter={filter}
								setFilter={setFilter}
								array={key}
								group={group}
								key={keyIndex}
							/>
						))}
					</div>
					{groupIndex !== Groups.length - 1 && (
						<div className={styles.splitter} />
					)}
				</Fragment>
			))}
		</>
	);
}
