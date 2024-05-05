import styles from "../styles/Home.module.css";


export default function Toggle({ toggle, setToggle, text, textLeft}) {
	return (
		<div
			className={`${styles.toggleContainer} ${styles.hoverClass}`}
			onClick={() => setToggle(!toggle)}
		>
            {textLeft}
			<div className={styles.toggleInner}>
				<div
					style={{
						backgroundColor: toggle ? "lime" : "red",
						transform: toggle
							? "translateX(75%)"
							: "translateX(0%)",
					}}
					className={styles.toggleBall}
				></div>
			</div>
			{text}
		</div>
	);
}
