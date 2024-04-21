import styles from './style.module.css';

export enum TypeButton {
      primary = "primary",
      secondary = "secondary",
      tertiary = "tertiary",
      accentBorder = "accent_border",
}

export enum ButtonSize {
      small = "small",
      medium = "medium",
}

interface IButton {
      type: TypeButton | string;
      onClick?: () => void;
      size?: ButtonSize;
      style?: React.CSSProperties;
      children: React.ReactNode;
      disabled?: boolean;
}

export const Button = (props: IButton) => {
      const { size = ButtonSize.medium, disabled = false } = props;

      return (
            <button
                  className={`${styles.button} ${styles[size]} ${styles[props.type]} ${disabled ? styles.disabled : ''}`}
                  onClick={props.disabled ? () => {} : props.onClick}
                  style={props.style}
            >
                  {props.children}
            </button>
      );
}