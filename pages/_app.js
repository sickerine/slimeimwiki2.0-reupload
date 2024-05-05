import { Analytics } from '@vercel/analytics/react';
import styles from "@/styles/Home.module.css";
import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

function Navbar() {
	const router = useRouter();
	const Links = [
		// { name: "Home", href: "/" },
		{ name: "Characters", href: "/characters" },
		{ name: "Forces", href: "/forces" },
		{ name: "Events", href: "/events" },
		// { name: "Gacha", href: "https://old.slimeim.wiki/gacha/" },
		// { name: "Daily", href: "https://old.slimeim.wiki/daily/" },
		// { name: "Tier List", href: "https://old.slimeim.wiki/tierlist/" },
	];
	const { data: session, status } = useSession();

	return (
		<nav>
			<div className={styles.navContainer}>
				<Link
					className={`${styles.logoContainer} ${styles.hoverClass}`}
					href="/"
				>
					<img
						className={styles.logo}
						src="/images/636b8a24-d58b-4873-bcc5-930f3cf34afa.png"
						title={"Home"}
					/>
				</Link>
				{Links.map((Obj) => {
					return (
						<Link
							key={Obj.href}
							active={
								router.pathname == Obj.href ? "true" : "false"
							}
							href={Obj.href}
						>
							<div>{Obj.name}</div>
						</Link>
					);
				})}
				{session && (
					<div className="text-color7">
						{session.user.name}
					</div>
				)}
			</div>
		</nav>
	);
}

export default function App({ Component, pageProps }) {
	const [storage, setStorage] = useState(null);
	useEffect(() => {
		if (typeof window !== "undefined") {
			let Storage = window.sessionStorage;
			setStorage(Storage);
		}
	}, []);

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
				/>
			</Head>
			<article className={poppins.className}>
				<SessionProvider session={pageProps.session}>
					<Navbar />
					<Component storage={storage} {...pageProps} />
					<Analytics />
				</SessionProvider>
			</article>
		</>
	);
}
