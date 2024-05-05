import styles from 'styles/Home.module.css';

function TextBox({ text, style, children }) {
	return (
		<div className={styles.textBox} style={style}>{text}
            {children}
        </div>
	)
}

export default TextBox;