import { useEffect, useRef, useState } from 'react';
import styles from './style.module.css';

export enum TextFieldType {
    number = 'number',
    text = 'text',
}

interface TextFieldProps {
    valueName?: string;
    fieldName?: string;
    formName: string;
    type?: TextFieldProps | string;
    setForm: (formName: string, value: string) => void;
    inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
}

export const TextField = (props: TextFieldProps) => {
    const refTextField: any = useRef(null);
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState('');

    const handleChangeValue = (value: string) => {
        if (props.type === TextFieldType.number) {
            // Если введенное значение начинается с 0, заменяем его на "0."
            if (value === '0') return setValue('0.');

            // Если введенное значение равно "0.", заменяем его на "0"
            if (value === '0.') return setValue('0');

            // Если введенное значение является числом или пустой строкой, устанавливаем его
            if (value.match(/^[0-9]*\.?[0-9]*$/) || value === '') {
                setValue(value);
            }
            return
        }

        setValue(value);
    }

    useEffect(() => {
        props.setForm(props.formName, value);
    }, [value]);


    useEffect(() => {
        if (refTextField?.current) {
            refTextField.current?.addEventListener('focus', () => {
                setIsFocus(true);
            });
            refTextField.current?.addEventListener('blur', () => {
                setIsFocus(false);
            });

            return () => {
                refTextField?.current?.removeEventListener('focus', () => {
                    setIsFocus(true);
                });
                refTextField?.current?.removeEventListener('blur', () => {
                    setIsFocus(false);
                });
            }
        }
    }, []);

    return (
        <div className={styles.wrapper}>
            {props.fieldName && <span>{props.fieldName}</span>}
            <div className={`${styles.textFieldWrapper} ${isFocus && styles.textFieldWrapperFocus}`}>
                <input ref={refTextField} type="text" value={value} onChange={(event) => handleChangeValue(event.target.value)} {...props.inputProps}/>
                {props.valueName && (
                    <span className={styles.valueName}>
                        {props.valueName}
                    </span>
                )}
            </div>
        </div>
    );
}

interface TextareaFieldProps {
    valueName?: string;
    fieldName?: string;
    maxLength: number;
    formName: string;
    setForm: (formName: string, value: string) => void;
    inputProps?: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
}

export const TextareaField = (props: TextareaFieldProps) => {
    const refTextField: any = useRef(null);
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState('');

    const handleChangeValue = (value: string) => {
        if (value.length <= props.maxLength) {
            const newValue = value.replace(/\n/g, ''); // Удаляем все символы новой строки
            setValue(newValue);
        }
    }

    useEffect(() => {
        props.setForm(props.formName, value);
    }, [value]);

    useEffect(() => {
        if (refTextField.current) {
            refTextField.current.addEventListener('focus', () => {
                setIsFocus(true);
            });
            refTextField.current.addEventListener('blur', () => {
                setIsFocus(false);
            });

            return () => {
                refTextField.current.removeEventListener('focus', () => {
                    setIsFocus(true);
                });
                refTextField.current.removeEventListener('blur', () => {
                    setIsFocus(false);
                });
            }
        }
    }, []);

    return (
        <div className={styles.wrapper} style={{ flex: 1 }}>
            {props.fieldName && <span>{props.fieldName}</span>}
            <div className={`${styles.multifeald} ${styles.textFieldWrapper} ${isFocus && styles.textFieldWrapperFocus}`} style={{ height: 'auto', 'flex': 1 }}>
                <textarea ref={refTextField} value={value} onChange={(event) => handleChangeValue(event?.target.value)} {...props.inputProps}></textarea>
                {props.valueName && (
                    <span className={styles.valueName}>
                        {props.valueName}
                    </span>
                )}
                {value != '' && (
                    <span className={styles.maxLength}>
                        {value.length}/{props.maxLength}
                    </span>
                )}
            </div>
        </div>
    );
}