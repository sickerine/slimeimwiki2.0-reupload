import styles from '@/styles/Home.module.css'

function Divider({ text, style }) {
	return (<div style={style} className={styles.dividerContainer}>
		<div></div>
		<div>{text}</div>
		<div></div>
	</div>)
}

export default Divider