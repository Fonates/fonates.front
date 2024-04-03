import styles from './style.module.css';

export const Wrapper = ({ children, cs }: { children: React.ReactNode | React.ReactNode[], cs?: any }) => {
    return (
        <div className={styles.wrapper}>
            <div className={`${styles.wrapperContent} ${cs ? cs : ''}`}>
                {children}
            </div>
        </div>
    )
}