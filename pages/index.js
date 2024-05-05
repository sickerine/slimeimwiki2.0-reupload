import {
	Groups, Icons, MaxStats,
	SkillTextFilter,
	Stars, removeQueryParams
} from "@/components/arrays";
import EventsList from "@/components/eventsList";
import FadeInImage from "@/components/fadeInImage";
import TextBox from "@/components/textBox";
import characters from "@/data/characters.json";
import Forces from "@/data/forces.json";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import Divider from "../components/divider";
import Events from "../data/events.json";
import styles from "../styles/Home.module.css";

const polygon = "polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0% 100%)";

function formatTimeDiff(timeDiff) {
	const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
	return `${days > 0 ? days + ":" : ""}${
		(hours >= 10 ? "" : "0") + hours + ":"
	}${(minutes >= 10 ? "" : "0") + minutes + ":"}${
		(seconds >= 10 ? "" : "0") + seconds
	}`;
}

function EventCard({ id }) {
	let SameDay = Events[id].Start == Events[id].End;
	let DaysLeft = Math.floor(
		(new Date(Events[id].End) - new Date()) / (1000 * 60 * 60 * 24)
	);
	if (SameDay) DaysLeft = "Announcement";
	else if (DaysLeft <= 0) DaysLeft = "Ending Soon";
	else DaysLeft = DaysLeft > 1 ? DaysLeft + " days left" : "1 day left";
	return (
		<div className={styles.eventCard}>
			<div>
				<div
					style={{
						background: `linear-gradient(90deg, ${
							Events[id].Type ? Icons[Events[id].Type][1] : "grey"
						} -20% -100px, rgba(0,0,0,0) 60%)`,
					}}
					className={styles.eventType}
				>
					<img
						src={Events[id].Type ? Icons[Events[id].Type][0] : ""}
					></img>
					{Events[id].Type}
				</div>
				<div className={styles.eventTitle} alt={id}>
					<div>{id}</div>
				</div>
				<img
					style={
						Object.values(Icons).find(
							(arr) =>
								arr[0] == removeQueryParams(Events[id].Image)
						)
							? { padding: "10%" }
							: {}
					}
					className={styles.eventImage}
					src={Events[id].Image}
				></img>
				<div className={styles.eventTimes}>
					<div>
						{!SameDay
							? `${Events[id].Start} ~ ${Events[id].End}`
							: Events[id].Start}
					</div>
					<div>{DaysLeft}</div>
				</div>
				{Events[id].New && <div className={styles.newFuck}>New</div>}
			</div>
		</div>
	);
}

function Timers() {
	const [time, setTime] = useState(new Date());
	const [timezone, setTimezone] = useState();
	const [resetString, setResetString] = useState("00:00:00");
	const [updateString, setUpdateString] = useState("00:00:00");
	const [resetTime, setResetTime] = useState();
	const [updateTime, setUpdateTime] = useState();
	const hourdata = {
		NA: {
			resethour: 11,
			updatehour: 2,
		},
		EU: {
			resethour: 4,
			updatehour: 2,
		},
		Asia: {
			resethour: 19,
			updatehour: 2,
		},
	};

	useEffect(() => {
		setTimezone(localStorage.getItem("timezone") || "NA");
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!time || !timezone) return;
		const { resethour, updatehour } = hourdata[timezone];
		const resetDate = new Date(time);
		const resetTime = new Date(time);
		resetDate.setUTCHours(resethour, 0, 0, 0);
		resetTime.setUTCHours(updatehour, 0, 0, 0);
		if (time.getUTCHours() >= resethour) {
			resetDate.setUTCDate(resetDate.getUTCDate() + 1);
		}
		if (time.getHours() >= updatehour) {
			resetTime.setUTCDate(resetTime.getUTCDate() + 1);
		}
		setResetTime(
			`${resetDate.toDateString()} ${
				resetDate.toTimeString().split(" ")[0]
			}`
		);
		setUpdateTime(
			`${resetTime.toDateString()} ${
				resetTime.toTimeString().split(" ")[0]
			}`
		);
		const resetDiff = resetDate.getTime() - time.getTime();
		const updateDiff = resetTime.getTime() - time.getTime();
		setResetString(formatTimeDiff(resetDiff));
		setUpdateString(formatTimeDiff(updateDiff));
	}, [time, timezone]);

	return (
		<div className={styles.timersContainer}>
			<div className={styles.timeServers}>
				{Object.keys(hourdata).map((key, index) => {
					return (
						<div
							className={`${styles.timeServer} ${styles.hoverClass}`}
							key={index}
							onClick={() => {
								setTimezone(key);
								localStorage.setItem("timezone", key);
							}}
							active={timezone == key ? "true" : "false"}
						>
							{key}
						</div>
					);
				})}
			</div>
			<div className={styles.timer}>
				<div className={styles.timerTitle}>Reset</div>
				<div className={styles.timerDate}>{resetTime}</div>
				<div className={styles.timerTime}>{resetString}</div>
			</div>
			<div className={styles.timer}>
				<div className={styles.timerTitle}>Update</div>
				<div className={styles.timerDate}>{updateTime}</div>
				<div className={styles.timerTime}>{updateString}</div>
			</div>
		</div>
	);
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

function Stat({ me, stat, icon, text }) {
	return (
		<div className="h-1/4 w-full flex relative">
			<div className="w-1/4 flex justify-end items-center">
				<img className="w-2 md:w-3 h-1/2" src={icon} />
			</div>
			<div className="w-1/2 text-xs flex justify-start items-center pl-2 font-[300]">
				{text}
			</div>
			<div className="w-1/2 text-xs flex justify-center items-center font-[500] bg-color3">
				{me["Max" + stat]}
			</div>
			<div className="absolute bg-color1 left-0 right-0 bottom-0 h-0.5">
				<div
					style={{
						width: `${getBarWidth(me, stat)}%`,
					}}
					className="h-full bg-gradient-to-r from-orange-300 via-yellow-200 to-yellow-400"
				></div>
			</div>
		</div>
	);
}

function Stats({ me }) {
	return (
		<div
			className="w-full h-full
			flex flex-col
		"
		>
			<Stat
				me={me}
				stat="Hp"
				icon="/images/44370964-c4b7-489d-8ad5-0f4c4d7bc0b4.png"
				text="Health"
			/>
			<Stat
				me={me}
				stat="Atk"
				icon="/images/3a9f4209-9d7d-4b68-981b-69cc7a9f9733.png"
				text="Attack"
			/>
			<Stat
				me={me}
				stat="Def"
				icon="/images/c52b14c4-cd1b-4ee6-9f6d-430c411f2c23.png"
				text="Defense"
			/>
			<Stat
				me={me}
				stat="EP"
				icon="/images/001946c6-3d30-43e5-9d39-4593640e5316.png"
				text="Existence"
			/>
		</div>
	);
}

function Skill({ me, number }) {
	let ValueName;
	let Description;
	let Title;
	let Icon;
	let Skill;
	let Cost = "";

	if (number > 0) {
		if (me.Skill1) ValueName = "Skill" + number;
		else ValueName = number == 1 ? "DivineProtection" : "ProtectionSkill";

		Skill = me[ValueName];
		Icon = me[ValueName + "Icon"];
		if (!Icon)
			Icon =
				"/images/253e8052-7f32-4973-b19d-d203b8e3dcc1.png";

		if (Skill.includes(":")) {
			const index = Skill.indexOf(":");
			Title = Skill.substring(0, index);
			Description = Skill.substring(index + 1).split("Cost:")[0];
		}
		Title = Title.replaceAll("Lv.1/Lv.10", "");
		Title = Title.replaceAll("Lv.MAX", "");
		if (Skill.includes("Cost:")) Cost = Skill.split("Cost:")[1];
	}

	return (
		<div
			className="text-xs w-1/2 h-full flex flex-col md:group-hover:pb-2"
			style={number == 0 ? { width: "60px" } : {}}
		>
			<div className="w-full h-full md:group-hover:h-1/4 bg-color4 flex justify-start items-center gap-1 pr-2 text-color7 text-[1em] min-h-[27.5px] md:min-h-[31px]">
				<div className="h-full max-w-[5em] min-w-[5em] bg-color7 p-0.5 pr-3.5" style={{ clipPath: polygon }}>
					<FadeInImage
						className="h-full m-auto"
						src={Icon}
						
					/>
				</div>
				<div className="max-w-1/2 truncate">{Title}</div>
				<div className="font-black ml-auto text-white">{Cost}</div>
			</div>
			<div
				className="text-[10px] h-full p-2 pb-0 overflow-y-scroll overflow-x-hidden"
				dangerouslySetInnerHTML={{
					__html: SkillTextFilter(Description),
				}}
			></div>
		</div>
	);
}

function CharacterShowcase({ id, i, length}) {
	const me = characters[id];
	const orphan = length % 2 == 1 && i == length - 1;
	const StarsStyle = me.Growth?.includes("EX")
		? { filter: "drop-shadow(0px 0px 1px #FE5DAE) hue-rotate(300deg)" }
		: {};
	let Types = [...me.Types, ...me.Forces.map((id) => Forces[id][1])];
	if (me.Weapon)
		Types.push(Groups[2].find((arr) => arr.includes(me.Weapon))[0]);
	// check if Types has any duplicates and keep only one
	Types = Types.filter((item, index) => Types.indexOf(item) === index);

	return (
		<>
			{
				orphan && <div className="col-span-1 hidden md:block">

				</div>
			}
			<div className="col-span-2">
				<Link href={`/characters/${id}`}>
					<div className="group w-full h-28 md:h-32 rounded bg-color2 flex flex-col divide-y-[1px] divide-color7 overflow-hidden text-color7 hover:shadow-md md:hover:shadow-neutral-700 transition-shadow duration-1000 hover:brightness-110">
						<div className="w-full h-[75%] md:group-hover:h-0 flex transition-all duration-200 md:group-hover:opacity-0">
							<div
								className="z-[5] pr-0 h-full aspect-square bg-color4 relative rounded-l"
								style={{ clipPath: polygon }}
							>
								<FadeInImage src={me.Icon} className="h-full" />
							</div>
							<div
								className="z-[4] -ml-8 w-[45%] md:w-[40%] h-full bg-color3 relative rounded-l
							flex justify-center items-center
							flex-col gap-1
							"
								style={{ clipPath: polygon }}
							>
								<div className="w-full text-s font-black text-center">
									{me.Name.split(" ")[0]}
								</div>
								<img
									className="h-3.5 -mt-1.5"
									src={Stars[me.Rarity - 1]}
									style={StarsStyle}
								/>
								{/* <div className="w-full text-xs font-[300] text-center -mt-1.5 trun">
								{me.Name.split(" [")[1].replace("]", "")}
							</div> */}
								<div className="h-5 rounded p-0.5 bg-color7 flex min-w-full justify-center divide-x divide-color5">
									{Types.map((type, index) => {
										return (
											<div className="h-full aspect-square p-0.5" key={index}> 
												<img
													src={type}
													className="h-full w-full"
													key={index}
												/>
											</div>
										);
									})}
								</div>
							</div>
							<div className="z-[3] -ml-10 flex-1 pl-2 h-full rounded bg-color4 relative rounded-l overflow-hidden">
								<Stats me={me} />
							</div>
						</div>
						<div className="h-[25%] md:group-hover:h-full flex">
							<Skill me={me} number={1} />
							<Skill me={me} number={2} />
						</div>
					</div>
				</Link>
			</div>
			{
				orphan && <div className="col-span-1 hidden md:block">

				</div>
			}
		</>
	);
}

export default function Home() {
	const [selectedBanner, setSelectedBanner] = useState(null);
	const filteredcharacters = useMemo(() => {return Object.keys(characters).filter((key) => {
		const char = characters[key];
		if (!char?.Release) return false;
		const Release = new Date(char.Release);
		if (
			Release.getTime() + 2592000000 >
			new Date().getTime()
		) {
			return true;
		}
	})}, []);

	// EventFilters.push([...["Past", "/images/6ab801f4-8164-4413-b481-a5953dfb4617.png", "white", (id) => Events[id].Current == false]])

	return (
		<>
			<Head>
				<title>Home - SLIMEIM.WIKI</title>
				<link rel="canonical" href="https://www.slimeim.wiki" />
			</Head>
			<main className="border-0 shadow-neutral-700 rounded shadow text-color7 p-[15px]">
				<Divider text={"ABOUT"} />
				<TextBox
					style={{
						borderTopLeftRadius: "5px",
						borderTopRightRadius: "5px",
					}}
				>
					<h1 style={{ fontSize: "1em", fontWeight: "normal" }}>
						SLIMEIM.WIKI is a Database for SLIME - Isekai Memories,
						the That Time I Got Reincarnated as a Slime mobile game
						developed by WFS and published by Bandai Namco
						Entertainment.
					</h1>
				</TextBox>
				<TextBox
					style={{
						background: "linear-gradient(90deg, darkred, crimson)",
						color: "white",
						borderBottomLeftRadius: "5px",
						borderBottomRightRadius: "5px",
					}}
					text={
						"This website is only getting automatic updates until I get the slimeim.wiki domain back, if ever."
					}
				>
				</TextBox>
				<Divider text={"TIMERS"} />
					<Timers />
				<Divider text={"LATEST"} />
				<div
					className="bg-color2 p-2
					grid grid-cols-2 gap-3
					md:grid-cols-4
					rounded-t
					"
				>
					{filteredcharacters.map((id, i) => {
						return <CharacterShowcase id={id} key={id} i={i} length={filteredcharacters.length}/>;
					})}
				</div>
				{/* <Divider text={"ONGOING EVENTS"} /> */}
					<EventsList />
				<div className="">
					<Divider text={"RECENT LIVESTREAM"} />
					<div className={styles.streamContainer}>
						<iframe
							src="https://www.youtube.com/embed/Cf5v0MA9eMM"
							title="転生したらスライムだった件 魔王と竜の建国譚 1.5周年お祭りだ！生放送！！"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;"
						></iframe>
					</div>
				</div>
			</main>
		</>
	);
}
