import styles from './style.module.css'

interface IAvatarProps {
    username: string;
    size?: AvatarSize;
    style?: React.CSSProperties;
}

export enum AvatarSize {
    small = 'small',
    normal = 'normal',
    medium = 'medium',
    large = 'large',
}

export const Avatar: React.FC<IAvatarProps> = (props) => {
    const { username = 'A', style, size = AvatarSize.large } = props;

    return (
        <div className={`${styles.avatar} ${styles[`avatar__size__${size}`]}`} style={style}>
            <span>{String(username)[0].toUpperCase()}</span>
        </div>
    );
}