import styles from './style.module.css';

interface IWrapperContainer { 
    children: React.ReactNode | React.ReactNode[];
    cs?: any;  
    style?: any;
}

export const Wrapper = ({ children, cs, style }: IWrapperContainer) => {
    return (
        <div className={styles.wrapper} style={style}>
            <div className={`${styles.wrapperContent} ${cs ? cs : ''}`}>
                {children}
            </div>
        </div>
    )
}