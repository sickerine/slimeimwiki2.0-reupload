import characters from "@/data/characters.json";
import { useMemo } from "react";
import CharacterList from "./characterList";
import { Tiers } from "/components/arrays";

export function Tier({
	tier,
	filter,
	confirmFunction,
	ignore,
	className,
	onClick,
	AlternateCharacterIcon,
}) {
	confirmFunction = confirmFunction || (() => true);
	const CharactersProtection = useMemo(() => {
		return Object.keys(characters).filter((id) => {
			return (
				(ignore || characters[id].Tier === tier) &&
				characters[id].UnitType == "Protection Characters" &&
				confirmFunction(id)
			);
		});
	}, [tier, filter, confirmFunction, ignore]);
	const CharactersBattle = useMemo(() => {
		return Object.keys(characters).filter((id) => {
			return (
				(ignore || characters[id].Tier === tier) &&
				characters[id].UnitType != "Protection Characters" &&
				confirmFunction(id)
			);
		});
	}, [tier, filter, confirmFunction, ignore]);
	const CharacterListProps = useMemo(() => {
		return {
			filter: filter,
			AlternateCharacterIcon: AlternateCharacterIcon,
			className: "w-full",
			classNameContainer: "flex flex-wrap",
		};
	}, [filter, AlternateCharacterIcon]);

	return (
		<div
			onClick={onClick}
			className={`w-full
						flex
						bg-color2
						rounded ${className}`}
		>
			<div
				style={{
					backgroundColor: Object.values(Tiers).find(
						(one) => one.Title == tier
					).Color,
				}}
				className="flex-1 flex justify-center items-center text-white rounded-l"
			>
				{tier}
			</div>
			<div className="w-[90%] col-span-9 flex flex-wrap p-2 gap-1 min-h-[73px]">
				{
					<CharacterList
						confirmFunction={(id) => CharactersBattle.includes(id)}
						{...CharacterListProps}
					/>
				}
				<div className="w-full h-[2px] p-1 m-auto">
					<div
						className="h-[1px]"
						style={{
							backgroundColor: Object.values(Tiers).find(
								(one) => one.Title == tier
							).Color,
						}}
					>
						{" "}
					</div>
				</div>
				{
					<CharacterList
						confirmFunction={(id) =>
							CharactersProtection.includes(id)
						}
						{...CharacterListProps}
					/>
				}
			</div>
		</div>
	);
}
