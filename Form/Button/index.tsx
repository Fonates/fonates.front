import styles from './style.module.css';

export enum TypeButton {
      primary = "primary",
      secondary = "secondary",
      tertiary = "tertiary",
      accentBorder = "accent_border",
}

interface IButton {
      type: TypeButton | string;
      onClick?: () => void;
      style?: React.CSSProperties;
      children: React.ReactNode;
}

export const Button = (props: IButton) => {
      return (
            <button
                  className={`${styles.button} ${styles[props.type]}`}
                  onClick={props.onClick}
                  style={props.style}
            >
                  {props.children}
            </button>
      );
}