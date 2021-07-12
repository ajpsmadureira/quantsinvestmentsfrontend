import styles from './Logo.module.css';
import logo from '../../images/logo.svg';

function Logo() {

	return (
		<img className={`navbar-brand ${styles.img}`}
			src={logo}
			alt="Quants.Investments logo" />
	);
}

export default Logo;