"use client";
import { TextField, TextFieldType, TextareaField } from "src/Form/TextField";
import styles from "./style.module.css";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "src/Form/useForm";
import { QR } from "react-qr-rounded";
import { SelectButtons } from "src/Form/SelectButtons";
import { Dropdown } from "src/components/Dropdown";
import useMediaQuery from "src/hooks/useMediaQuery";
import { Layout } from "src/components/Layout";

const Page = () => {
  const { form, setFormValue } = useForm();
  const isMobileWidth = useMediaQuery("(max-width: 768px)");

  const arrayFaq = [
    {
      name: "Как пополнить баланс?",
      value: "Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: новая модель организационной деятельности однозначно фиксирует необходимость переосмысления внешнеэкономических политик. Прежде всего, постоянный количественный рост и сфера нашей активности обеспечивает широкому кругу (специалистов) участие в формировании прогресса.",
    },
    {
      name: "Как вывести средства?",
      value: "Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: новая модель организационной деятельности однозначно фиксирует необходимость переосмысления внешнеэкономических политик. Прежде всего, постоянный количественный рост и сфера нашей активности обеспечивает широкому кругу (специалистов) участие в формировании прогресса.",
    },
    {
      name: "Как связаться с поддержкой?",
      value: "Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: новая модель организационной деятельности однозначно фиксирует необходимость переосмысления внешнеэкономических политик. Прежде всего, постоянный количественный рост и сфера нашей активности обеспечивает широкому кругу (специалистов) участие в формировании прогресса.",
    }
  ];

  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.wrapperForm}>
          <div className={styles.amountWrapper}>
            <SelectButtons
              arrayValues={[5, 10, 25, 50]}
              nameValue="TON"
              setForm={setFormValue}
              fieldName="Сумма доната"
              formName="amount"
            />
          </div>
          <TextField
            fieldName="Имя"
            formName="name"
            setForm={setFormValue}
            inputProps={{
              placeholder: "Введите ваше имя",
              name: "name",
            }}
          />
          <TextareaField
            fieldName="Коментарий"
            maxLength={250}
            formName="comment"
            setForm={setFormValue}
            inputProps={{
              placeholder: "Введите коментарий",
              name: "comment",
              rows: 5,
            }}
          />
        </div>
        {!isMobileWidth && (
           <div className={styles.wrapperForm} style={{ width: "fit-content" }}>
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
             >
               fdskjfdksljfklj
             </QR>
           </div>
           <h1 className={styles.username}>ThePetrushka</h1>
           <span className={styles.qrHint}>
              Сканируйте QR код для отправки доната
           </span>
         </div>
        )}
      </div>
      <div className={styles.wrapper}>
        <p className={styles.info}>Теперь вы можете поддержать любимого стримера через криптовалюту, прокрутите вниз для получения информации.</p>
      </div>
      <div className={styles.wrapperFaq}>
        <div className={styles.titleFaq}>
          <span></span>
          <h1>FAQ</h1>
          <span></span>
        </div>
        <Dropdown arrayInfo={arrayFaq} />
      </div>
    </Layout>
  );
};

export default Page;
