import styles from './style.module.css';
import { useState } from 'react';
import IconChevron from '@/assets/icons/chevron.compact.down.svg';

interface DropdownProps {
      arrayInfo: Array<{
            name: string;
            value: string;
      }>;
}

const DropdownItem = (props: { name: string; value: string }) => {
      const [isOpen, setIsOpen] = useState(false);

      return (
            <div className={styles.dropdownItem} onClick={() => setIsOpen(!isOpen)}>
                  <div className={styles.header}>
                        <p>{props.name}</p>
                        <IconChevron style={{ transform: !isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                  {isOpen && (
                        <div className={styles.dropdownContent}>
                              <p>{props.value}</p>
                        </div>
                  )}
            </div>
      )
};

export const Dropdown = (props: DropdownProps) => {
      return (
            <div className={styles.wrapper}>
                  {props.arrayInfo.map((item, index) => {
                        return (
                              <DropdownItem
                                    key={index}
                                    name={item.name}
                                    value={item.value}
                              />
                        )
                  })}
            </div>
      )
};