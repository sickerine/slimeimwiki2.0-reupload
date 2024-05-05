import FadeInImage from "@/components/fadeInImage";
import styles from "@/styles/Home.module.css";
import {
	Groups,
	GroupsConfig,
	SkillTextFilter, manageFilter
} from "/components/arrays";
import keywords from "/data/filterkeywords.json";
import forces from "/data/forces.json";

function getName(array, i) {
	if (GroupsConfig[i][3]) return GroupsConfig[i][3][array];
	if (i == Groups.length + 2) {
		return (
			<div className={styles.forceFilter}>
				<FadeInImage src={forces[array[0]][1]} />
				<div>{forces[array[0]][0]}</div>
			</div>
		);
	} else if (i == Groups.length + 3)
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: SkillTextFilter(array[0], true),
				}}
			></div>
		);
	let keywordGroup = Object.keys(keywords).find((keyword) => {
		return Object.keys(keywords[keyword]).find((key) => {
			return (
				JSON.stringify(keywords[keyword][key]) == JSON.stringify(array)
			);
		});
	});
	let keyword = Object.keys(keywords[keywordGroup]).find((key) => {
		return (
			JSON.stringify(keywords[keywordGroup][key]) == JSON.stringify(array)
		);
	});
	keyword = (
		<div className={styles.filterName}>
			<div>{GroupsConfig[i][2]}</div>
			<div>{keywordGroup}</div>
			<div>{keyword}</div>
		</div>
	);
	return keyword;
}

export default function FilterList({ filter, setFilter }) {
	return (
		filter.find((arr) => arr && arr.length > 0) && (
			<div className={styles.filterMatch}>
				{filter.map(
					(group, i) =>
						group &&
						group.map((key, v) => (
							<div
								className={`${styles.filterMatchItem} ${styles.hoverClass}`}
								key={key}
								onClick={() =>
									manageFilter(i, key, setFilter, filter)
								}
							>
								<FadeInImage
									className={styles.cross}
									src={"/cross.png"}
								/>
								{i < Groups.length && !GroupsConfig[i][3] ? (
									<div>
										<div className={styles.forceFilter}>
											<FadeInImage
												src={Groups[i][key][0]}
											/>
											<div>
												{
													Groups[i][key][
														Groups[i][key].length -
															1
													]
												}
											</div>
										</div>
									</div>
								) : (
									<div>{getName(key, i)}</div>
								)}
							</div>
						))
				)}
			</div>
		)
	);
}