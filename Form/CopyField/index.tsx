import LazyBackgroundImage from "src/components/LazyBackgroundImage";
import styles from "./style.module.css";
import { useState } from "react";

interface ICopyContainer {
      value: string;
      fieldName: string; 
      onCopy?: () => void;
      disabled?: boolean;
}

export const CopyField = (props: ICopyContainer) => {
      const [isAnimation, setIsAnimation] = useState(false);

      const handleCopy = () => {
            if (props.disabled) return;
            navigator.clipboard.writeText(props.value);
            setIsAnimation(true);
            setTimeout(() => {
                  setIsAnimation(false);
            }, 1000);
            props.onCopy && props.onCopy();
      }

      return (
            <div className={`${styles.copyField} ${props.disabled && styles.disabled}`}>
                  {props.fieldName && <span className={styles.fieldName}>{props.fieldName}</span>}
                  <div className={`${styles.wrapper} ${isAnimation && styles.animation}`} onClick={handleCopy}>
                        <span>{props.value}</span>
                        <div className={styles.iconWrapper}>
                              <LazyBackgroundImage img={'/icons/copy.svg'} style={{ width: '100%', height: '24px'}} />
                        </div>
                  </div>
            </div>
      )
}