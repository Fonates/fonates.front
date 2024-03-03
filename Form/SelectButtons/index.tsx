import { Fragment, useEffect, useState } from 'react';
import styles from './style.module.css';
import { TextField, TextFieldType } from '../TextField';

interface SelectButtonsProps {
      arrayValues: Array<number | string>;
      nameValue?: string;
      formName: string;
      setForm: (formName: string, value: string) => void;
}

export const SelectButtons = (props: SelectButtonsProps) => {
      const [indexElem, setIndex] = useState(0);

      console.log(indexElem);

      const handleChangeValue = (index: number) => {
            props.setForm(props.formName, props.arrayValues[index].toString());
      };

      useEffect(() => {
            if (indexElem === -1) return;
            handleChangeValue(indexElem);
      }, [indexElem]) 

      return (
           <Fragment>
                  <div className={styles.wrapper}>
                        {props.arrayValues.map((value, index) => {
                              return (
                                    <span key={index} className={`${styles.button} ${index === indexElem && styles.active}`} onClick={() => setIndex(index)}>
                                          {value} {props.nameValue}
                                    </span>
                              )
                        })}
                        <span className={`${styles.button} ${indexElem < 0 && styles.active} ${styles.otherBtn}`} onClick={() => setIndex(-1)}>
                              Другая
                        </span>
                  </div>
                  {indexElem < 0 && (
                        <TextField type={TextFieldType.number} valueName="TON" setForm={props.setForm} formName="amount" inputProps={{
                              placeholder: 'Введите сумму доната',
                              name: 'amount',
                        }} />
                  )}
           </Fragment>
      )
};