import { Icons, SkillTextFilter } from "@/components/arrays.js";
import FadeInImage from "@/components/fadeInImage";
import { useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import Events from "../data/events.json";
import Divider from "./divider";

function EventCardNew({ id, onClick, style, alwaysImage }) {
	let opacity = 100;
	let HasThumbnail =
		alwaysImage ||
		!Object.values(Icons).find((val) => val[0] == Events[id].Image);
	let Dates;
	let BarPercentage;
	let EventStart;
	let EventEnd;
	let TimeTotal;
	let TimeLeft;

	EventStart = new Date(Events[id].Start);
	EventEnd = new Date(Events[id].End);
	TimeTotal = EventEnd.getTime() - EventStart.getTime();
	TimeLeft = EventEnd.getTime() - new Date().getTime();
	BarPercentage = Math.floor((TimeLeft / TimeTotal) * 100);
	if (EventEnd < new Date()) BarPercentage = 100;

	if (Events[id].Start == Events[id].End) Dates = Events[id].Start;
	else Dates = `${Events[id].Start} ~ ${Events[id].End}`;

	const [progress, setProgress] = useState(0);
	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((oldProgress) => {
				if (BarPercentage > 0) return 100 - BarPercentage;
				else if (BarPercentage >= 100) {
					opacity = 50;
					return 0;
				} else return 0;
			});
		}, 250);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<div
			onClick={onClick}
			style={style}
			className="bg-color1 flex max-w-full cursor-pointer flex-col rounded p-1 hover:brightness-110 md:h-20 md:flex-row"
		>
			{HasThumbnail && (
				<div className="bg-color6 flex h-4/6 md:h-full min-w-[204px] items-center justify-center rounded-l">
					<FadeInImage
						className="h-full w-full"
						src={Events[id].Image}
						style={{ aspectRatio: "420 / 148" }}
					/>
				</div>
			)}
			<div className={`flex-1 max-w-full flex items-center bg-color2 ${HasThumbnail ? "md:w-[calc(100%-204px)]" : ""} `}>
			<div
				className={`
				bg-color2 flex h-20 flex-col justify-center rounded-r p-2 pr-7 w-full`}
			>
				<div className="flex h-1/4 max-w-full gap-1 truncate text-xs font-[600]">
					{Events[id].New && <div className="bg-yellow-300 rounded text-black px-1 text-[0.85em] flex justify-center items-center">NEW</div>}
					<img
						className="h-full p-0.5"
						src={Events[id].Type ? Icons[Events[id].Type][0] : ""}
					/>
					{Events[id].Type}
				</div>
				<div
					className="text-s max-w-full truncate text-white"
					dangerouslySetInnerHTML={{
						__html: SkillTextFilter(id, true).replaceAll(
							"<br>",
							""
						),
					}}
				></div>
				<div className="flex h-1/4 w-full items-center justify-between flex-wrap">
					<div className="bg-color5 h-[30%] w-1/2 overflow-hidden rounded">
						<div
							style={{
								width: `${progress}%`,
							}}
							className="h-full bg-gradient-to-r from-orange-300 via-yellow-200 to-yellow-400 transition-[width] duration-500"
						></div>
					</div>
					<div className="h-full text-xs">{Dates}</div>
				</div>
			</div>
			</div>
		</div>
	);
}

function EventFilterButton({ id, onClick, style, selected }) {
	return (
		<div
			className={`text-s md:w-full ${
				selected
					? "bg-color4 md:h-8 md:text-[0.85em]"
					: "bg-color6 brightness-95 md:h-7 md:text-xs"
			} md:hover:bg-color5 group relative flex h-10 cursor-pointer items-center gap-2 rounded p-3 transition-all md:p-2`}
			onClick={onClick}
			style={style}
		>
			{id[1].length > 0 && (
				<>
					<img className="aspect-square h-full" src={id[1]} />
					<div className="bg-color7 h-full w-[1px]"></div>
				</>
			)}
			<div>{id[0]}</div>
			{selected && (
				<div
					className={`absolute md:-right-1 md:left-auto md:h-full md:w-3
								
						 ${selected ? "bg-color5" : "bg-color6"}`}
				></div>
			)}
		</div>
	);
}

function EventFilterButtonNonMD({ id, onClick, style, selected }) {
	return (
		<div
			className={`text-s md:text-xs ${
				selected ? "bg-color4" : " bg-color2"
			} md:hover:bg-color5 group relative flex h-10 cursor-pointer  items-center gap-2 rounded p-3 transition-all md:h-6 md:p-1.5 md:px-2.5`}
			onClick={onClick}
			style={style}
		>
			{id[1].length > 0 && (
				<>
					<img className="aspect-square h-full" src={id[1]} />
					<div className="bg-color7 h-full w-[1px]"></div>
				</>
			)}
			<div>{id[0]}</div>
			{selected && (
				<div
					className={`absolute
								
						 ${selected ? "bg-color5" : "bg-color6"}`}
				></div>
			)}
		</div>
	);
}

function ListedEvents({ confirmFunction, setIframeOpen }) {
	const ref = useRef([]);
	const Months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const Data = useMemo(() => {
		return Object.keys(Events).filter((key) => confirmFunction(key));
	}, [confirmFunction]);
	const [isMD, setisMD] = useState(true);

	useEffect(() => {
		const handleResize = () => {
			setisMD(window.innerWidth > 768);
		};
		window.addEventListener("resize", handleResize);
		handleResize();
	}, []);

	return (
		<div className="bg-color2 rounded p-1">
			<List
				height={10 * (isMD ? 80 : 220)}
				itemData={Data}
				itemCount={Data.length}
				itemSize={isMD ? 80 : 220}
				width={"100%"}
			>
				{({ data, index, style }) => {
					const id = data[index];
					// let EventMonthAndYear = new Date(Events[id].Start);
					// const MonthName = Months[EventMonthAndYear.getMonth()];
					// EventMonthAndYear = `${EventMonthAndYear.getMonth()}/${EventMonthAndYear.getFullYear()}`;

					return (
						<EventCardNew
							id={id}
							key={id}
							alwaysImage={true}
							onClick={() => {
								setIframeOpen(Events[id].Link);
							}}
							style={style}
						/>
					);
				}}
			</List>
		</div>
	);
}

export default function EventsList({ page, externalConfirmFunction }) {
	const [iframeOpen, setIframeOpen] = useState("");
	const [openAnimation, setOpenAnimation] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [confirmFunction, setConfirmFunction] = useState(0);
	const CheckCurrent = (id) => Events[id].Current == true || page == true;
	const EventFilters = Object.keys(Icons).map((id) => [
		id,
		Icons[id][0],
		Icons[id][1],
		(key) => Events[key].Type == id && CheckCurrent(key),
	]);
	EventFilters.unshift([...["All", "", "white", (id) => CheckCurrent(id)]]);
	EventFilters.push([
		...[
			"Packs",
			"/images/cd43ba3e-da25-4a22-ac4c-c52445411e6c.png",
			"white",
			(id) => id.includes("Pack") && CheckCurrent(id),
		],
	]);
	externalConfirmFunction = externalConfirmFunction || (() => true);

	useEffect(() => {
		if (iframeOpen.length > 0) {
			setTimeout(() => {
				setOpenAnimation(true);
			}, 100);
		}
	}, [iframeOpen]);

	return (
		<>
			{iframeOpen.length > 0 && (
				<div
					className={`bg-color4 fixed bottom-0 left-0 right-0 top-[50px] ${
						openAnimation ? "max-h-[100%]" : "max-h-0"
					} shadow-color5 z-50 flex items-center justify-center overflow-hidden shadow-lg transition-all`}
				>
					<div
						className={`bg-color2 border-color5 hover:bg-color4 absolute top-0 z-[51] mt-1.5 cursor-pointer rounded-xl border p-0.5 px-6 text-[0.85em]  ${
							openAnimation ? "opacity-100" : "opacity-0"
						} transition-all`}
						onClick={() => {
							setLoaded(false);
							setOpenAnimation(false);
							setTimeout(() => {
								setIframeOpen("");
							}, 100);
						}}
					>
						Close
					</div>
					<div
						className={`bg-color2 absolute inset-0 mt-[1.15em] ${
							loaded == false ? "animate-pulse" : ""
						} border-color5 border-t`}
					></div>
					<div
						className={`relative -right-[3.35%] h-[90%] w-full scale-105 overflow-hidden  ${
							loaded == false ? "animate-pulse" : ""
						} transition-all`}
					>
						<iframe
							onLoad={() => {
								setLoaded(true);
							}}
							className={`absolute -left-[6.75%] h-full w-full ${
								loaded ? "opacity-100" : "opacity-0"
							} transition-all`}
							src={iframeOpen}
						></iframe>
					</div>
				</div>
			)}
			{!page ? (
				<div className=" bg-color2 divide-color5 flex w-full flex-col divide-y-[2px] rounded-b p-2 md:flex-row md:divide-x-[2px] md:divide-y-0">
					<div className="flex w-full flex-row flex-wrap justify-center gap-1 pb-5 pr-1 pt-1 md:w-1/4 md:flex-col md:justify-start">
						{EventFilters.map((key, i) => (
							<EventFilterButton
								selected={confirmFunction == i}
								id={key}
								key={key}
								onClick={() => {
									setConfirmFunction(i);
								}}
							/>
						))}
					</div>
					<div className="bg-color6 flex w-full flex-col gap-1 overflow-y-scroll rounded p-1 pr-0  md:h-[512px] md:w-3/4">
						{Object.keys(Events).map(
							(key) =>
								EventFilters[confirmFunction][3](key) && (
									<EventCardNew
										id={key}
										key={key}
										onClick={() => {
											setIframeOpen(Events[key].Link);
										}}
									/>
								)
						)}
					</div>
				</div>
			) : (
				<div>
					{/* {list events with a Divider with each month} */}
					<div className="bg-color1 flex w-full flex-row flex-wrap justify-center gap-1 rounded p-1">
						{EventFilters.map((key, i) => (
							<EventFilterButtonNonMD
								selected={confirmFunction == i}
								id={key}
								key={key}
								onClick={() => {
									setConfirmFunction(i);
								}}
							/>
						))}
					</div>
					<Divider text="Ongoing" />
					<ListedEvents
						confirmFunction={(key) =>
							externalConfirmFunction(key) &&
							Events[key].Current == true &&
							EventFilters[confirmFunction][3](key)
						}
						setIframeOpen={setIframeOpen}
					/>
					<Divider text="Ended" />
					<ListedEvents
						confirmFunction={(key) =>
							externalConfirmFunction(key) &&
							Events[key].Current != true &&
							EventFilters[confirmFunction][3](key)
						}
						setIframeOpen={setIframeOpen}
					/>
				</div>
			)}
		</>
	);
}
