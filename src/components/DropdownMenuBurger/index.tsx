import { useOutsideClick } from '@/hooks/useOutsideClick';
import styles from './style.module.css'
import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion"

interface DropdownProps {
    arrayInfo: Array<{
        name: string;
        value: string;
        onClick: () => void;
    }>;
    children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const refDropdownWrapper = useRef(null);
    const controls = useAnimation();

    useOutsideClick(refDropdownWrapper, () => {
        setIsOpen(false);
    });

    return (
        <div ref={refDropdownWrapper} className={styles.wp} onClick={() => setIsOpen(!isOpen)} >
            {props.children}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={'close'}
                        variants={{
                            open: { opacity: 1, y: 0 },
                            close: { opacity: 0, y: -10 },
                        }}
                        exit={{ opacity: 0, y: -10 }} 
                        animate={isOpen ? "open" : "close"}
                        transition={{ duration: 0.2 }} 
                        className={styles.dropdownItems}
                    >
                            {props.arrayInfo.map((item, index) => (
                                <div key={index} onClick={item.onClick} className={styles.itemDropdown}>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                    </motion.div>  
                )}
            </AnimatePresence>
        </div>
    )
}