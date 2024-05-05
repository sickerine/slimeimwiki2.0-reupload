import Divider from '@/components/divider';
import TextBox from '@/components/textBox';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/Home.module.css';

export default function Home() {
    const router = useRouter();

    return (
        <>
			<Head>
				<title>Daily Story - SLIMEIM.WIKI</title>
				<meta rel="canonical" href="https://www.slimeim.wiki/daily" />
			</Head>
            <main>
                <Divider text="IMPORTANT" />
                <TextBox
				style={{
					background: "linear-gradient(90deg, darkred, crimson)",
					color: "white",
					borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px"
				}}
				text={
					"This page is not ready yet, you can visit the old one in the meantime: "
				}
			>
				<Link
					href={`https://old.slimeim.wiki${router.pathname}`}
					className={`${styles.boxedDiv} ${styles.hoverClass}`}
				>
                    old.slimeim.wiki{router.pathname}
				</Link>
			</TextBox>
            </main>
        </>
    );
}