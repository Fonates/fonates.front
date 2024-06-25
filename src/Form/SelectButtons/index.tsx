import { Fragment, useEffect, useState } from 'react';
import styles from './style.module.css';
import { TextField, TextFieldType } from '../TextField';

interface SelectButtonsProps {
      arrayValues: Array<number | string>;
      nameValue?: string;
      formName: string;
      fieldName?: string;
      disabled?: boolean;
      value?: any;
      setForm: (formName: string, value: string) => void;
}

export const SelectButtons = (props: SelectButtonsProps) => {
      const [indexElem, setIndex] = useState(0);

      const handleChangeValue = (index: number) => {
            props.setForm(props.formName, props.arrayValues[index].toString());
      };

      useEffect(() => {
            if (indexElem === -1) return;
            handleChangeValue(indexElem);
      }, [indexElem]);

      const handleSelect = (index: number) => {
            if (props?.disabled) return;
            setIndex(index);
      }

      return (
           <Fragment>
                  <div className={styles.wrapperSelectButtons}>
                        {props.fieldName && <span>{props.fieldName}</span>}
                        <div className={styles.wrapper}>
                              {props.arrayValues.map((value, index) => {
                                    return (
                                          <span key={index}
                                                className={`${styles.button} ${index === indexElem && styles.active} ${props?.disabled ? styles.disabled : ''}`}
                                                onClick={() => handleSelect(index)}>
                                                {value} {props.nameValue}
                                          </span>
                                    )
                              })}
                              <span className={`${styles.button} ${indexElem < 0 && styles.active} ${styles.otherBtn} ${props?.disabled ? styles.disabled : ''}`} onClick={() => handleSelect(-1)}>
                                    Other
                              </span>
                        </div>
                  </div>
                  {indexElem < 0 && (
                        <TextField 
                              type={TextFieldType.number}
                              valueName="TON"
                              setForm={props.setForm}
                              formName="amount" 
                              maxChars={11} 
                              value={props.value}
                              inputProps={{
                                    placeholder: 'Enter donation amount',
                                    name: 'amount',
                              }}
                        />
                  )}
           </Fragment>
      )
};
