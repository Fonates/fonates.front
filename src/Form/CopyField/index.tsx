import LazyBackgroundImage from "@/components/LazyBackgroundImage";
import styles from "./style.module.css";
import { useState } from "react";
import IconCopyDoc from "@/assets/icons/doc.on.doc.svg";

interface ICopyContainer {
      value: string;
      fieldName?: string; 
      onCopy?: () => void;
      disabled?: boolean;
      className?: string | any;
}

export const CopyField = (props: ICopyContainer) => {
      const [isAnimation, setIsAnimation] = useState(false);

      const handleCopy = async() => {
            if (props.disabled) return;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(props.value);
                    setIsAnimation(true);
                    setTimeout(() => {
                        setIsAnimation(false);
                    }, 1000);
                    props.onCopy && props.onCopy();
                } catch (error) {
                    console.error('Failed to copy:', error);
                }
            } else {
                console.error('Clipboard API not available');
            }
      }

      return (
            <div className={`${props.className ? props.className : ''} ${styles.copyField} ${props.disabled && styles.disabled}`}>
                  {props.fieldName && <span className={styles.fieldName}>{props.fieldName}</span>}
                  <div className={`${styles.wrapper} ${isAnimation && styles.animation}`} onClick={handleCopy}>
                        <span>{props.value}</span>
                        <div className={styles.iconWrapper}>
                              <IconCopyDoc />
                        </div>
                  </div>
            </div>
      )
}