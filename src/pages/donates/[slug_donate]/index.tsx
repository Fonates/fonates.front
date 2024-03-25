import { TextField, TextFieldType, TextareaField } from "@/Form/TextField";
import styles from "./style.module.css";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "@/Form/useForm";
import { QR } from "react-qr-rounded";
import { SelectButtons } from "@/Form/SelectButtons";
import { Dropdown } from "@/components/Dropdown";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Layout } from "@/components/Layout";
import { Button, TypeButton } from "@/Form/Button";
import { useRouter } from "next/navigation";
import ApiLinks from "@/API/links";
import { GetServerSideProps, NextPage } from "next";
import { Address, Builder, Cell, beginCell } from "@ton/core";

interface IDonatePage {
  username: string;
  address: string;
}

export type Donate = {
  $$type: 'Donate';
  to: Address;
  text: string;
  value: number | bigint;
}


export function storeDonate(src: Donate) {
  return (builder: Builder) => {
      let b_0 = builder;
      b_0.storeUint(2018962093, 32);
      b_0.storeAddress(src.to);
      b_0.storeStringRefTail(src.text);
      b_0.storeInt(src.value, 257);
  };
}

function toBase64Url(base64String: string) {
    return base64String
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

const DonatePage: NextPage<IDonatePage> = (pageProps) => {
  const { form, setFormValue } = useForm();
  const isMobileWidth = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  const amount = Number(form.amount || 0) * 10 ** 9;

  const danate: Donate = {
    $$type: 'Donate',
    to: Address.parse(pageProps.address),
    text: `ton.fonates|${form.name}|${form.comment}` || '',
    value: amount,
  }

  console.log(danate, pageProps.address)

  const body = beginCell().
    store(storeDonate(danate)).
    endCell().
    toBoc().
    toString('base64');

  const deeplink = `ton://transfer/${'EQCUed4SHlw2Cr2SWywVvmOytRGCfHZXw5ORtz1njNuEUNhf'}?amount=${amount}&bin=${toBase64Url(body)}`;
  console.log(deeplink)

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
    <Fragment>
      <div className={styles.msgWrapper}>
        <p>Теперь вы можете поддержать любимого стримера через криптовалюту, нажмите кнопку рядом чтобы получить больше информации.</p>
        <Button type={TypeButton.secondary} onClick={() => router.push('/articles/how-it-is-works?')}>
          Как это работает?
        </Button>
      </div>
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
               {deeplink}
             </QR>
           </div>
           <h1 className={styles.username}>{pageProps.username}</h1>
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
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug_donate } = context.params || {};

  if (!slug_donate || slug_donate === '') {
    return {
      notFound: true,
    }
  }

  const api = new ApiLinks({
    baseURL: process.env.NEXT_PUBLIC_API_URL_V1 || '',
    headers: {},
  });

  const walletAddress = slug_donate as string;
  const response = await api.GetLinkByAddress(walletAddress);

  if (!response || response?.error) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      username: response.username,
      address: response.address,
    },
  }
};

export default DonatePage;
