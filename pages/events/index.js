import Divider from "@/components/divider";
import EventsList from "@/components/eventsList";
import SearchBar from "@/components/searchBar";
import TextBox from "@/components/textBox";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
	const [search, setSearch] = useState("");
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Events - SLIMEIM.WIKI</title>
				<meta rel="canonical" href="https://www.slimeim.wiki/events" />
			</Head>
			<main className="text-color7">
				<TextBox
					style={{
						marginTop: "10px",
						borderRadius: "5px",
						backgroundColor: "rgba(255,0,0,0.5)",
						color: "white",
					}}
					text={
						<div>
							Events earlier than <b>July 2022</b> will not be listed when filtering.
						</div>
					}
				/>
				<Divider text={"Filters"} />
				<SearchBar search={search} setSearch={setSearch} />
				<EventsList page={true} externalConfirmFunction={(id) => search == "" || id.toLowerCase().includes(search.toLocaleLowerCase()) } />
			</main>
		</>
	);
}
