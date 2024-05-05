import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta content="SLIMEIM.WIKI" property="og:title" />
				<meta
					content="Database site for SLIME - Isekai Memories."
					property="og:description"
				/>
				<meta content="https://slimeim.wiki/" property="og:url" />
				<meta
					content="/images/34f2bf0a-d329-46d2-bef0-006a83b1bf5a.png"
					property="og:image"
				/>
				<meta
					content="#262626"
					data-react-helmet="true"
					name="theme-color"
				/>

				<meta
					name="description"
					content="SLIMEIM.WIKI is a Database for SLIME - Isekai Memories, the That Time I Got Reincarnated as a Slime mobile game developed by WFS and published by Bandai Namco Entertainment."
				/>
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black"
				/>

				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/icons/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/icons/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/icons/favicon-16x16.png"
				/>
				<link rel="manifest" href="/icons/site.webmanifest" />
				<link
					rel="mask-icon"
					href="/icons/safari-pinned-tab.svg"
					color="#262626"
				/>
				<link rel="shortcut icon" href="/icons/favicon.ico" />
				<meta
					name="apple-mobile-web-app-title"
					content="SLIMEIM.WIKI"
				/>
				<meta name="application-name" content="SLIMEIM.WIKI" />
				<meta name="msapplication-TileColor" content="#262626" />
				<meta
					name="msapplication-config"
					content="/icons/browserconfig.xml"
				/>
				<meta name="theme-color" content="#262626" />

				<Script
					strategy="afterInteractive"
					src="https://www.googletagmanager.com/gtag/js?id=G-BM68X05VGE"
				/>
				<Script
					id="google-analytics"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', 'G-BM68X05VGE', {
							page_path: window.location.pathname,
							});
					`,
					}}
				/>
				{/* <script>
					{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BM68X05VGE');
          `}
				</script> */}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
