import styles from "@/styles/Home.module.css";
import Select from "react-select";
import {
	ForcesMapped,
	Groups,
	TownBuffs, manageFilter
} from "/components/arrays";
import keywords from "/data/filterkeywords.json";
import forces from "/data/forces.json";

function getIndicatorColor(text) {
	text = text.toLowerCase();
	if (text.includes("secret")) return "#FD8A39";
	if (text.includes("protection")) return "#1575EC";
	if (text.includes("skill")) return "#2ABA2C";
	if (text.includes("combos")) return "linear-gradient(to right, #FD8A39, #FF2E7E, #1575EC)";
	return "rgba(var(--color2), 0.75)"
}

export default function KeywordFilter({ filter, setFilter, text, id }) {
	let options = [];
	const customStyles = {
		singleValue: (provided, state) => ({
			...provided,
			color: "rgba(var(--color2), 0.5)",
		}),
		input: (provided, state) => ({
			...provided,
			color: "rgba(var(--color2), 1)",
		}),
		option: (provided, state) => ({
			...provided,
			color: "white",
			backgroundColor: "rgba(var(--color2), 0.1)",
			":hover": {
				backgroundColor: "rgba(var(--color2), 0.2)",
			},
		}),
		control: (provided, state) => ({
			...provided,
			backgroundColor: "rgba(var(--color1), 0.5)",
			border: 0,
			boxShadow: state.isFocused ? "0 0 0 1px white" : 0,

		}),
		menu: (provided, state) => ({
			...provided,
			zIndex: 10,
			backgroundColor: "rgba(var(--color1), 1)",
			overflow: "hidden",
		}),
		menuList : (provided, state) => ({
			...provided,
			padding: "0",
		}),
		group: (provided, state) => ({
			...provided,
			backgroundColor: "rgba(var(--color2), 0.1)",
			padding: "0"
		}),
		groupHeading: (provided, state) => ({
			...provided,
			margin: "0",
			paddingBlock: "5px"
		}),
		container: (provided, state) => ({
			...provided,
		}),
	};

	if (id === Groups.length + 2) {
		const sortedForces = forces
			.map((array, i) => ({ value: i, label: array[0], element: <div className={styles.optionWithImage}><img src={array[1]}/>{array[0]}</div> }))
			.sort((a, b) => forces[a.value][0].localeCompare(forces[b.value][0]));
		options = sortedForces;
	} else if (id === Groups.length + 3) {
		const townBuffOptions = TownBuffs.map((array, i) => ({
			value: i,
			label: array, element: array,
		})).sort((a, b) => a.label[0].localeCompare(b.label[0]));
		options = townBuffOptions;
	} else {
		const keywordOptions = Object.keys(keywords).map((keyword) => ({
			label: keyword,
			options: Object.keys(keywords[keyword]).map((key) => ({
				value: keyword + ":" + key,
				label: key.trim(), element:
				<div  className={styles.optionWithImage}>
					<div style={{background: getIndicatorColor(key)}} className={styles.optionIndicator}></div>
					{key.trim()}
				</div>,
			})),
		}));
		options = keywordOptions;
	}

	const handleSelectChange = (selectedOption) => {
		if (
			selectedOption.value === "default" ||
			filter[id]?.includes(selectedOption.label)
		) {
			return;
		}
		let array = selectedOption.label;
		if (id === Groups.length + 2) {
			array = ForcesMapped[parseInt(selectedOption.value)];
		} else if (id === Groups.length + 3) {
			array = TownBuffs[selectedOption.value];
		} else {
			array =
				keywords[selectedOption.value.split(":")[0]][
					selectedOption.value.split(":")[1]
				];
		}
		manageFilter(id, array, setFilter, filter);
	};

	const defaultOption = { value: "default", label: text, isDisabled: true };
	return (
		<Select
			value={defaultOption}
			options={[defaultOption, ...options]}
			onChange={handleSelectChange}
			className={`${styles.keywordSelect}`}
			isSearchable={true}
			styles={customStyles}
			hideSelectedOptions={true}
			instanceId={text}
			formatOptionLabel={(option) => option.element ?? option.label}
		/>
	);
}