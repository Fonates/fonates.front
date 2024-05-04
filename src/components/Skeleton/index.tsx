import { CSSProperties, HTMLAttributes, StyleHTMLAttributes } from 'react';
import styles from './style.module.css';

interface ISkeleton {
    children: any;
    style?: CSSProperties | undefined;
    className?: string | any;
    show: boolean;
}

export const Skeleton: React.FC<ISkeleton> = (props) => {
    if (props.show) {
        return props.children
    }

    return (
        <div className={`${styles.skeleton} ${props.className}`} style={props.style} />
    )
}