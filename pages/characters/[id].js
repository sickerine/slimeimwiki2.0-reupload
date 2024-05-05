import {
	GroupsConfig,
	RouteFilter
} from "@/components/arrays";
import FadeInImage from "@/components/fadeInImage";
import styles from "@/styles/Home.module.css";
import fs from "fs";
import Head from "next/head";
import { useRouter } from "next/router";
import path from "path";
import { useEffect, useRef, useState } from "react";
import {
	FilterDescription,
	Groups,
	MaxStats,
	SkillTextFilter,
	Stars,
	TownBuffs,
	characters,
	removeSecretSkillGauge,
} from "/components/arrays";
import CharacterList from "/components/characterList";
import Divider from "/components/divider";
import filterKeywords from "/data/filterkeywords.json";
import forces from "/data/forces.json";

function TextBox({ text, style }) {
	return (
		<div className={styles.textBox} style={style}>
			{text}
		</div>
	);
}

function removeQueryParams(url) {
	const index = url.indexOf("?");
	return index === -1 ? url : url.slice(0, index);
}

function getBarWidth(me, stat) {
	const typeIndex = me.UnitType == "Protection Characters" ? 1 : 0;
	const minValue = MaxStats[stat][typeIndex][0];
	const maxValue = MaxStats[stat][typeIndex][1];
	const Percent = Math.floor(
		((me["Max" + stat] - minValue) / (maxValue - minValue)) * 100
	);
	return Percent;
}

function StatColumn({ me, stat, icon, text }) {
	{
		return (
			<>
				<div>
					<div>
						{icon && <FadeInImage src={icon} />}
						{text}
					</div>
					{me["Max" + stat] ? (
						<>
							{me["Min" + stat] != me["Max" + stat] && (
								<div>{me["Min" + stat] ?? "-"}</div>
							)}
							<div>{me["Max" + stat] ?? "-"}</div>
						</>
					) : (
						<div>{me[stat] ?? "-"}</div>
					)}
				</div>
				{me["Max" + stat] && (
					<div className={styles.barContainer}>
						<div
							style={{
								width: `${getBarWidth(me, stat)}%`,
							}}
						></div>
					</div>
				)}
			</>
		);
	}
}


function SkillElement({
	icon,
	inicon,
	title,
	description,
	cost,
	style,
	topstyle,
	className,
	fusion
}) {
	return (
		<div
			style={style}
			className={`${styles.skillContainer} ${className ?? ""}`}
		>
			<div style={topstyle} className={styles.skillTop}>
				{icon && (
					<div fusion={fusion} className={styles.skillIconContainer}>
						<FadeInImage src={icon} />
						{inicon && <FadeInImage src={inicon} />}
					</div>
				)}
				<div>
					<div
						dangerouslySetInnerHTML={{
							__html: SkillTextFilter(title + (fusion == "true" ? "(Fusion Lv. 1)" : ""), true),
						}}
					></div>
					{cost && <span>{cost}</span>}
				</div>
			</div>
			<div
				className={styles.skillDesc}
				dangerouslySetInnerHTML={{
					__html: SkillTextFilter(description),
				}}
			></div>
		</div>
	);
}

function TownTags({ me, id, text, router }) {
	return (
		TownBuffs.map((buff, i) => {
			const GroupConfig = GroupsConfig[id];
			const Variables = GroupConfig[0];
			let IsActive = false;
			Variables.forEach((variable) => {
				if (me[variable] && IsActive == false)
					if (FilterDescription(me[variable]).includes(buff[0]))
						IsActive = true;
			});
			if (IsActive)
				return (
					<div
						key={i}
						className={`${styles.filterMatchItem} ${styles.hoverClass}`}
						onClick={() => RouteFilter(id, i, router)}
						dangerouslySetInnerHTML={{
							__html: SkillTextFilter(buff[0], true),
						}}
						style={{ paddingInline: "1em", display: "flex", gap: "5px", alignItems: "center", justifyContent: "center" }}
					>
					</div>
				);
		})
	)
}

function CharacterTags({ me, id, text }) {
	const router = useRouter();

	return (
		<>
			{Object.keys(filterKeywords).map((filterGroup, i) =>
				Object.keys(filterKeywords[filterGroup]).map((filter, j) => {
					let Values = GroupsConfig[id];
					let Keywords = filterKeywords[filterGroup][filter];
					let IsActive = false;
					Values[0].forEach((value) => {
						if (me[value] && IsActive == false)
							Keywords.forEach((keyword) => {
								if (
									FilterDescription(me[value]).includes(
										keyword
									) &&
									IsActive == false
								)
									IsActive = true;
							});
					});
					if (IsActive)
						return (
							<div
								key={i + j}
								className={`${styles.filterMatchItem} ${styles.hoverClass}`}
								onClick={() => {
									RouteFilter(
										id,
										[filterGroup, filter],
										router
									);
								}}
							>
								<div>
									<div className={styles.filterName}>
										<div>{text}</div>
										<div>{filterGroup}</div>
										<div>{filter}</div>
									</div>
								</div>
							</div>
						);
				})
			)}
		</>
	);
}

function IconTag({ src, group, i, style, text }) {
	const router = useRouter();

	return (
		<div
			className={`${styles.filterMatchItem} ${styles.hoverClass}`}
			onClick={() => {
				RouteFilter(group, i, router);
			}}
		>
			{typeof src == typeof "" ? (
				<FadeInImage src={src} />
			) : (
				<>
					<div style={style}>
						<div className={styles.forceFilter}>
							<FadeInImage src={src[0]} />
							<div>{`${(text ?? "")} ${src[src.length - 1]}`}</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

function TopBar({ me, isInViewport, setIsInViewport, sticky, StarsStyle }) {
	const ref = useRef(null);
	useEffect(() => {
		if (sticky) return;
		const handleScroll = () => {
			const top = ref.current?.getBoundingClientRect().top;
			setIsInViewport(top >= 0 && top <= window.innerHeight);
		};
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={`${styles.topBar}
			${sticky
					? !isInViewport
						? styles.topBarSticky
						: styles.topBarHidden
					: isInViewport
						? ""
						: styles.topBarBasicHidden
				}`}
			ref={ref}
		>
			<FadeInImage src={me.Icon}></FadeInImage>
			<div className={styles.characterNames}>
				<div>{me.Name.split(" [")[1].replace("]", "")}</div>
				<div>{me.Name.split(" [")[0]}</div>
				<div className={styles.characterTypes}>
					<FadeInImage
						src={
							Groups[0][
							me.UnitType == "Battle Characters" ? 0 : 1
							][0]
						}
					/>
					{me.Weapon && (
						<FadeInImage
							src={
								Groups[2].find((arr) =>
									arr.includes(me.Weapon)
								)[0]
							}
						/>
					)}
					<FadeInImage style={StarsStyle} src={Stars[me.Rarity - 1]} />
				</div>
			</div>
		</div>
	);
}

function FindGroup(url) {
	const Group = Groups.find((group) => group.find(arr => arr.includes(url)));
	return Groups.indexOf(Group);
}

export default function Character({ id }) {
	const me = characters[id];
	const router = useRouter();
	const [isInViewport, setIsInViewport] = useState(true);
	let SecretGap = (me.EXSecret ? 1 : 0) + (me.SecretSkillTrait ? 1 : 0);
	let SecretBoxWidth = 100 / (1 + SecretGap);
	let SkillBoxWidth = 100 / ((me.Skill1 ? 1 : 0) + (me.Skill2 ? 1 : 0) + (me.Skill1Fused ? 1 : 0) + (me.Skill2Fused ? 1 : 0));
	let ProtectionGap =
		(me.SupportDivineProtection ? 1 : 0) +
		(me.GuidanceEnhancementTrait ? 1 : 0);
	let ProtectionBoxWidth = 100 / (1 + ProtectionGap);
	const StarsStyle = me.Growth?.includes("EX") ? { filter: "drop-shadow(0px 0px 1px #FE5DAE) hue-rotate(300deg)" } : {};

	Object.keys(me).forEach((key) => {
		if (typeof me[key] == typeof "")
			me[key] = me[key]
				.replaceAll("★", "*")
				.replaceAll("（", "(")
				.replaceAll("）", ")")
				.replaceAll("％", "%");
	});

	useEffect(() => {
		const elements = document.querySelectorAll(`*[group]`)
		elements.forEach((element) => {
			element.setAttribute("class", styles.hoverClass);
			element.onclick = () => {
				RouteFilter(Number(element.getAttribute("group")), Number(element.getAttribute("i")), router);
			}
		});
	}, [])

	return (
		<>
			<Head>
				<title>{`${me.Name} - SLIMEIM.WIKI`}</title>
				<link rel="canonical" href={`https://www.slimeim.wiki/characters/${id}`} />
			</Head>
			{/* <div className={styles.stickyTopBarContainer}> */}
			{/* <TopBar me={me} isInViewport={isInViewport} setIsInViewport={setIsInViewport} sticky={true} /> */}
			{/* </div> */}
			
			<main className={`${styles.main} ${styles.characterMain}`}>
				{/* <TopBar me={me} isInViewport={isInViewport} sticky={true} /> */}
				<TopBar
					me={me}
					isInViewport={isInViewport}
					setIsInViewport={setIsInViewport}
					StarsStyle={StarsStyle}
				/>
				<div className={styles.infoContainer}>
					<div className={styles.paddedInfo}>
						<div className={styles.artContainer}>
							<div className={styles.characterArt}>
								<FadeInImage src={me.Art}></FadeInImage>
							</div>
							<div>
								<Divider text="Stats" />
								<div className={styles.statsContainer}>
									<StatColumn
										me={me}
										stat="Hp"
										icon="/images/44370964-c4b7-489d-8ad5-0f4c4d7bc0b4.png"
										text="Health"
									/>
									<StatColumn
										me={me}
										stat="Atk"
										icon="/images/3a9f4209-9d7d-4b68-981b-69cc7a9f9733.png"
										text="Attack"
									/>
									<StatColumn
										me={me}
										stat="Def"
										icon="/images/c52b14c4-cd1b-4ee6-9f6d-430c411f2c23.png"
										text="Defense"
									/>
									<StatColumn
										me={me}
										stat="EP"
										icon="/images/001946c6-3d30-43e5-9d39-4593640e5316.png"
										text="Existence"
									/>
									<StatColumn
										me={me}
										stat="Output"
										icon="/images/410caf8e-9e04-40bf-9739-d11a2307aa63.png"
										text="Output"
									/>
									<StatColumn
										me={me}
										stat="Release"
										text="Release"
									/>
								</div>
								<Divider text="Forces" />
								<div className={styles.forcesList}>
									{me.Forces && me.Forces.length > 0 ? (
										me.Forces.map((id, i) => {
											return (
												<div className={styles.hoverClass} onClick={() => {
													RouteFilter(Groups.length + 2, id, router)
												}} key={i}>
													<FadeInImage src={forces[id][1]} />
													<div>{forces[id][0]}</div>
												</div>
											);
										})
									) : (
										<div style={{ width: "100%" }}>
											No forces have been assigned.
										</div>
									)}
								</div>
								<Divider text="Tags" />
								<div
									className={`${styles.filterMatch} ${styles.characterTags}`}
								>
									<TownTags
										me={me}
										id={Groups.length + 3}
										text={"Town"}
										router={router}
									/>
									{me.UnitType && (
										<IconTag
											group={0}
											i={
												me.UnitType ==
													"Battle Characters"
													? 0
													: 1
											}
											src={
												Groups[0][
												me.UnitType ==
													"Battle Characters"
													? 0
													: 1
												]
											}
										/>
									)}
									{me.Growth && (
										<IconTag
											style={StarsStyle ?? {}}
											group={3}
											i={Groups[3].findIndex((arr) =>
												arr.includes(me.Growth)
											)}
											src={Groups[3].find((arr) =>
												arr.includes(me.Growth)
											)}
											text={me.Growth?.includes("EX") ? "EX" : null}
										/>
									)}
									{me.Weapon && (
										<IconTag
											group={2}
											i={Groups[2].findIndex((arr) =>
												arr.includes(me.Weapon)
											)}
											src={Groups[2].find((arr) =>
												arr.includes(me.Weapon)
											)}
										/>
									)}
									{me.SecretType && (
										<IconTag
											group={5}
											i={Groups[5].findIndex((arr) =>
												arr.includes(me.SecretType)
											)}
											src={Groups[5].find((arr) =>
												arr.includes(me.SecretType)
											)}
										/>
									)}
									{me.Types.map((type, i) => {
										return (
											!forces.find(
												(arr) =>
													removeQueryParams(arr[1]) ==
													removeQueryParams(type)
											) && (
												<IconTag
													group={FindGroup(type)}
													i={Groups[FindGroup(type)].findIndex(
														(arr) =>
															arr.includes(type)
													)}
													src={
														Groups[FindGroup(type)].find((arr) =>
															arr.includes(type)
														) ?? type
													}
													key={i}
												/>
											)
										);
									})}
									{me.Rarity && (
										<IconTag
											style={StarsStyle ?? {}}
											group={6}
											i={Groups[6].findIndex((arr) =>
												arr.includes(me.Rarity)
											)}
											src={Groups[6].find((arr) =>
												arr.includes(me.Rarity)
											)}
											text={me.Growth?.includes("EX") ? "EX" : null}
										/>
									)}
									<CharacterTags
										me={me}
										id={Groups.length}
										text={"Skills"}
									/>
									<CharacterTags
										me={me}
										id={Groups.length + 1}
										text={"Traits"}
									/>
								</div>
							</div>
						</div>
					</div>
					{me.Message && <TextBox style={{marginTop: "10px", backgroundColor: "rgba(255,0,0,0.5)", color: "white" }} text={<div>{me.Message}</div>} />}
					<div className={styles.skillsContainer}>
						{me.UnitType != "Protection Characters" ? (
							<>
								<div className={styles.paddedInfo}>
									<Divider text={"BATTLE SKILLS"} />
								</div>
								<SkillElement
									style={{ width: `${SkillBoxWidth}%` }}
									icon={me.Skill1Icon}
									title={me.Skill1.split("Lv.1/Lv.10:")[0]}
									description={
										me.Skill1.split("Lv.1/Lv.10:")[1].split(
											"Cost:"
										)[0]
									}
									cost={
										me.Skill1.split("Lv.1/Lv.10:")[1].split(
											"Cost:"
										)[1] + " Skill Points"
									}
								/>
								{
									me.Skill1Fused && (
										<SkillElement
											style={{ width: `${SkillBoxWidth}%` }}
											fusion={"true"}
											icon={me.Skill1FusedIcon}
											title={me.Skill1Fused.split("Lv.1/Lv.10:")[0]}
											description={
												me.Skill1Fused.split("Lv.1/Lv.10:")[1].split(
													"Cost:"
												)[0]
											}
											cost={
												me.Skill1Fused.split("Lv.1/Lv.10:")[1].split(
													"Cost:"
												)[1] + " Skill Points"
											}
										/>
									)
								}
								<SkillElement
									style={{ width: `${SkillBoxWidth}%` }}
									icon={me.Skill2Icon}
									title={me.Skill2.split("Lv.1/Lv.10:")[0]}
									description={
										me.Skill2.split("Lv.1/Lv.10:")[1].split(
											"Cost:"
										)[0]
									}
									cost={
										me.Skill2.split("Lv.1/Lv.10:")[1].split(
											"Cost:"
										)[1] + " Skill Points"
									}
								/>
								{
									me.Skill2Fused && (
										<SkillElement
											style={{ width: `${SkillBoxWidth}%` }}
											icon={me.Skill2FusedIcon}
											fusion={"true"}
											title={me.Skill2Fused.split("Lv.1/Lv.10:")[0]}
											description={
												me.Skill2Fused.split("Lv.1/Lv.10:")[1].split(
													"Cost:"
												)[0]
											}
											cost={
												me.Skill2Fused.split("Lv.1/Lv.10:")[1].split(
													"Cost:"
												)[1] + " Skill Points"
											}
										/>
									)
								}
								<div className={styles.paddedInfo}>
									<Divider text={"SECRET SKILLS"} />
								</div>
								<SkillElement
									style={{ width: `${SecretBoxWidth}%` }}
									icon={
										"/images/badcba68-a095-4047-a83b-ba0199b6926a.png"
									}
									inicon={me.Icon}
									title={me.Secret.split("Lv.MAX")[0]}
									description={removeSecretSkillGauge(
										me.Secret.split("Lv.MAX:")[1]
									)}
									cost={"100% Secret Gauge"}
								/>
								{me.EXSecret && (
									<SkillElement
										style={{ width: `${SecretBoxWidth}%` }}
										title={
											"EX " + me.Secret.split("Lv.MAX")[0]
										}
										description={removeSecretSkillGauge(
											me.EXSecret.split("Lv.MAX:")[1]
										)}
										cost={"200% Secret Gauge"}
									/>
								)}
								{me.SecretSkillTrait && (
									<SkillElement
										style={{ width: `${SecretBoxWidth}%` }}
										icon={""}
										title={"Enhanced Secret Skill"}
										description={me.SecretSkillTrait.slice(
											me.SecretSkillTrait.indexOf(":") + 1
										)}
										cost={"Awaken 5/6"}
									/>
								)}
							</>
						) : (
							<>
								<div className={styles.paddedInfo}>
									<Divider text={"DIVINE PROTECTION"} />
								</div>
								<SkillElement
									style={{ width: `${ProtectionBoxWidth}%` }}
									icon={
										"	/images/253e8052-7f32-4973-b19d-d203b8e3dcc1.png"
									}
									title={
										me.DivineProtection.split("Lv.MAX")[0]
									}
									description={removeSecretSkillGauge(
										me.DivineProtection.split("Lv.MAX:")[1]
									)}
									cost={"Primary"}
								/>
								{me.SupportDivineProtection && (
									<SkillElement
										style={{
											width: `${ProtectionBoxWidth}%`,
										}}
										title={
											me.SupportDivineProtection.split(
												"("
											)[0].split("Lv.")[0]
										}
										description={removeSecretSkillGauge(
											me.SupportDivineProtection.split(
												"Lv.MAX:"
											)[1]
										)}
										cost={"Support"}
									/>
								)}
								{me.GuidanceEnhancementTrait && (
									<SkillElement
										style={{
											width: `${ProtectionBoxWidth}%`,
										}}
										title={"Enhanced Guidance"}
										description={removeSecretSkillGauge(
											me.GuidanceEnhancementTrait.slice(
												me.GuidanceEnhancementTrait.indexOf(
													":"
												) + 1
											)
										)}
										cost={"Awaken 5/6"}
									/>
								)}
								<div className={styles.paddedInfo}>
									<Divider text={"PROTECTION SKILL"} />
								</div>
								<SkillElement
									style={{ width: "100%" }}
									icon={me.ProtectionSkillIcon}
									title={
										me.ProtectionSkill.split(
											"Lv.1/Lv.10:"
										)[0]
									}
									description={
										me.ProtectionSkill.split(
											"Lv.1/Lv.10:"
										)[1]
									}
									cost={"100% Protection Gauge"}
								/>
							</>
						)}
					</div>
					<div className={styles.skillsContainer}>
						{me.Trait1 && (
							<>
								<div className={styles.paddedInfo}>
									<Divider text={"Traits"} />
								</div>
								<SkillElement
									icon={
										"/images/eb8f10d6-4603-494a-888d-164d8c255f85.png"
									}
									title={me.Trait1.slice(
										0,
										me.Trait1.indexOf("(")
									)}
									description={me.Trait1.slice(
										me.Trait1.indexOf(":") + 1
									)}
									cost={"Awaken 1/5"}
									className={styles.simpleSkill}
								/>
								<SkillElement
									icon={""}
									title={me.Trait1A.slice(
										0,
										me.Trait1A.indexOf("(")
									)}
									description={me.Trait1A.slice(
										me.Trait1A.indexOf(":") + 1
									)}
									cost={"Awaken 3/5"}
									className={`${styles.simpleSkill} ${styles.awakenedSkill}`}
								/>
							</>
						)}
						{me.Valor1 && (
							<>
								{/* <div className={styles.paddedInfo}>
                  <Divider text={"Valor Traits"} />
                </div> */}
								<SkillElement
									style={!me.Valor1A ? { width: "100%" } : {}}
									icon={
										"/images/b2f811bb-6419-4ea3-b813-58cd9bcc93dd.png"
									}
									title={me.Valor1.slice(
										0,
										me.Valor1.indexOf(":")
									)}
									description={me.Valor1.slice(
										me.Valor1.indexOf(":") + 1
									)}
									cost={"Awaken 0/5"}
									className={styles.simpleSkill}
								/>
								{me.Valor1A && (
									<SkillElement
										icon={""}
										title={
											me.Valor1A.slice(
												0,
												me.Valor1A.indexOf(":")
											).split("(")[0]
										}
										description={me.Valor1A.slice(
											me.Valor1A.indexOf(":") + 1
										)}
										cost={"Awaken 2/5"}
										className={`${styles.simpleSkill} ${styles.awakenedSkill}`}
									/>
								)}
							</>
						)}
						{me.EXAbility1 && (
							<>
								<div className={styles.paddedInfo}>
									<Divider text={"EX Abilities"} />
								</div>
								<SkillElement
									style={
										!me.EXAbility2 ? { width: "100%" } : {}
									}
									icon={
										"https://ten-sura-m-assets-us.akamaized.net/web-assets/images/fcac5e3898026b79a3a3c64707ab4c3d.png?16792230394118?16792230394118"
									}
									title={me.EXAbility1.slice(
										0,
										me.EXAbility1.indexOf(":")
									)}
									description={me.EXAbility1.slice(
										me.EXAbility1.indexOf(":") + 1
									)}
									//   cost={"Awaken 0/5"}
									className={styles.simpleSkill}
								/>
								{me.EXAbility2 && (
									<SkillElement
										icon={""}
										title={
											me.EXAbility2.slice(
												0,
												me.EXAbility2.indexOf(":")
											).split("(")[0]
										}
										description={me.EXAbility2.slice(
											me.EXAbility2.indexOf(":") + 1
										)}
										// cost={"Awaken 2/5"}
										className={`${styles.simpleSkill} ${styles.awakenedSkill} ${styles.showAwakened}`}
									/>
								)}
							</>
						)}
						{/* <SkillElement
                icon={
                  "/images/eb8f10d6-4603-494a-888d-164d8c255f85.png"
                }
                title={me.Valor1.slice(0, me.Valor1.indexOf(":"))}
                description={me.Valor1.slice(me.Valor1.indexOf(":") + 1)}
                cost={"Awaken 0/5"}
                topstyle={{ background: 0 }}
              /> */}
					</div>
				</div>
				<Divider text={me.Name.split("[")[0]} />
				<CharacterList
					className={"w-full p-5 bg-color3 rounded"}
					classNameContainer={"flex flex-wrap"}
					confirmFunction={(key) => characters[key].Name.split("[")[0] == me.Name.split("[")[0] && characters[key] != me}/>
			</main>
		</>
	);
}

export async function getStaticProps({ params }) {
	return {
		props: {
			id: params.id,
		},
	};
}

export async function getStaticPaths() {
	const filePath = path.join(process.cwd(), "data", "characters.json");
	const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

	const paths = Object.keys(data).map((char, i) => {
		return {
			params: { id: char },
		};
	});

	return {
		paths: paths,
		fallback: false,
	};
}
