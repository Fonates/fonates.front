import { useOutsideClick } from '@/hooks/useOutsideClick';
import styles from './style.module.css'
import { useRef, useState } from "react";

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

    useOutsideClick(refDropdownWrapper, () => {
        setIsOpen(false);
    });

    return (
        <div ref={refDropdownWrapper} className={styles.wp} onClick={() => setIsOpen(!isOpen)} >
            {props.children}
            {isOpen && (
                <div className={styles.dropdownItems}>
                    {props.arrayInfo.map((item, index) => (
                        <div key={index} onClick={item.onClick} className={styles.itemDropdown}>
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}