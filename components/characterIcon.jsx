import FadeInImage from "@/components/fadeInImage";
import Link from "next/link";
import { useMemo } from "react";
import { Groups, RarityColors, Stars } from "/components/arrays";
import characters from "/data/characters.json";
import styles from "/styles/Home.module.css";
import Image from "next/image";

function getProperTypeIcon(id, icon) {
	if (characters[id].UnitType == "Protection Characters") {
		let Group = Groups.find((Group) =>
			Group.find((type) => type.includes(icon))
		);
		if (!Group) return icon;
		if (Groups.indexOf(Group) == 7) return icon;
		let Type = Group.find((Type) => Type.includes(icon));
		if (Type) return Type[1];
	}
	return icon;
}

function CharacterTypes({ id }) {
	const me = characters[id];

	return (
		me.Types?.length > 0 && (
			<>
				{characters[id].Types.length > 1 && (
					<FadeInImage
						src={getProperTypeIcon(
							id,
							characters[id].Types[
								characters[id].Types.length - 2
							]
						)}
					></FadeInImage>
				)}
				<FadeInImage
					src={getProperTypeIcon(
						id,
						characters[id].Types[characters[id].Types.length - 1]
					)}
				></FadeInImage>
			</>
		)
	);
}

function IconContent({ id, text }) {
	const isEx = useMemo(() => {
		return characters[id].Growth?.includes("EX");
	}, [id]);

	return (
		<>
			<FadeInImage
				className={styles.iconImage}
				src={characters[id].Icon}
				alt={`${characters[id].Name}`}
			/>
			<FadeInImage
				alt={`0 Stars`}
				style={{ filter: "grayscale(1.0) brightness(0.25)" }}
				className={styles.iconRarity}
				src={Stars[4]}
			/>
			<FadeInImage
				alt={`${characters[id].Rarity} Stars`}
				style={
					isEx
						? {
								filter: "drop-shadow(0px 0px 1px #FE5DAE) hue-rotate(300deg)",
						  }
						: {}
				}
				className={styles.iconRarity}
				src={Stars[characters[id].Rarity - 1]}
			/>
			<div className={styles.iconTypeList}>
				<CharacterTypes id={id} />
			</div>
			{text != "None" && (
				<div className={styles.iconName}>
					{typeof characters[id][text] == typeof ""
						? characters[id][text].split(" ")[0]
						: Math.floor(characters[id][text])}
				</div>
			)}
			<div
				style={{
					background: `${
						RarityColors[characters[id].Rarity + (isEx ? 1 : 0)]
					}`,
				}}
				className={styles.iconBar}
			></div>
		</>
	);
}

function CharacterIcon({ id, text, className, onClick, style }) {
	return (
		<div
			className={`${className ?? styles.characterIcon} ${
				styles.characterIcon
			}`}
			onClick={onClick}
			style={style}
		>
			<div className={`${styles.iconContainer} ${styles.hoverClass}`}>
				{!onClick ? (
					<Link href={`/characters/${id}`}>
						<IconContent id={id} text={text} />
					</Link>
				) : (
					<IconContent id={id} text={text} />
				)}
			</div>
		</div>
	);
}

export default CharacterIcon;
