import styles from './style.module.css';
import { useState } from 'react';
import IconChevron from '@/assets/icons/chevron.compact.down.svg';
import { AnimatePresence, motion, useAnimation } from "framer-motion"

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
                  <AnimatePresence>
                        {isOpen && (
                              <motion.div  
                                    initial={'close'}
                                    variants={{
                                          open: { height: 'auto', opacity: 1 },
                                          close: { height: 0, opacity: 0 },
                                    }}
                                    exit={{ height: 0, opacity: 0 }} 
                                    animate={isOpen ? "open" : "close"}
                                    transition={{ duration: 0.2 }} 
                                    className={styles.dropdownContent}
                              >
                                    <p>{props.value}</p>
                              </motion.div >
                        )}
                  </AnimatePresence>
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