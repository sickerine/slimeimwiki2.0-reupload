import styles from "../styles/Home.module.css";
import FadeInImage from "./fadeInImage";

export default function SearchBar({children, search, setSearch}) {
	return (
		<div className={`${styles.searchContainer}`}>
			<div
				className={`${styles.searchBar} ${styles.hoverClass}`}
				style={{ paddingRight: search.length > 0 ? "0px" : "5px" }}
			>
				<FadeInImage
					className={styles.searchIcon}
					src={
						"/images/21de2367-4344-4c04-a4b1-bd745ef345be.png"
					}
				/>
				<input
					className={styles.searchInput}
					type="text"
					placeholder="Search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				></input>
				<FadeInImage
					style={search.length > 0 ? {} : { width: "0px" }}
					className={`${styles.searchClear}`}
					src={"/cross.png"}
					onClick={() => setSearch("")}
				/>
			</div>
			{children}
		</div>
	);
}
