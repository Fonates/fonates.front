"use client";
import { TextField, TextFieldType, TextareaField } from "src/Form/TextField";
import styles from './style.module.css';
import { Fragment } from "react";
import { useForm } from "src/Form/useForm";
import { QR } from "react-qr-rounded";
import { SelectButtons } from "src/Form/SelectButtons";

const Page = () => {
    const {form, setFormValue} = useForm();

    console.log(form);

    return (
        <Fragment>
            <div className={styles.wrapper}>
                <div className={styles.wrapperForm}>
                    <div className={styles.amountWrapper}>
                        <SelectButtons arrayValues={[5, 10, 25, 50]} nameValue="TON" setForm={setFormValue} formName="amount" />
                    </div>
                    <TextField fieldName="Имя" formName="name" setForm={setFormValue} inputProps={{
                        placeholder: 'Введите ваше имя',
                        name: 'name',
                    }} />
                    <TextareaField fieldName="Коментарий" maxLength={250} formName="comment" setForm={setFormValue} inputProps={{
                        placeholder: 'Введите коментарий',
                        name: 'comment',
                        rows: 5,
                    }} />
                </div>
                <div className={styles.wrapperForm} style={{ width: 'fit-content' }}>
                    <div className={styles.qrWrapper}>
                        <QR 
                            color="#fff"
                            backgroundColor="#17171900"
                            rounding={100}
                            width={273}
                            height={273}
                            // cutout
                            // cutoutElement={<img
                            //     src="https://random.imagecdn.app/500/500"
                            //     style={{
                            //         objectFit: "contain",
                            //         width: "100%",
                            //         height: "100%",
                            //     }} />}
                            errorCorrectionLevel="H"
                            children={"fsdjflsdkjfdksjfkdsjflksdjlfkdjslkfjslkfjld"} 
                        />
                    </div>
                    <h1 className={styles.username}>ThePetrushka</h1>
                    <span className={styles.qrHint}>
                        Scan the QR-code below with а саmега in уour TON wallet
                    </span>
                </div>
            </div>
        </Fragment>
    )
}

export default Page;