import { TextField, TextareaField } from "@/Form/TextField";
import styles from "./style.module.css";
import { Fragment } from "react";
import { useForm } from "@/Form/useForm";
import { SelectButtons } from "@/Form/SelectButtons";
import { Dropdown } from "@/components/Dropdown";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button, ButtonSize, TypeButton } from "@/Form/Button";
import { useRouter } from "next/navigation";
import ApiLinks from "@/API/links";
import { GetServerSideProps, NextPage } from "next";
import { Address, Builder, beginCell } from "@ton/core";
import { Wrapper } from "@/components/Wrapper";
import Link from "next/link";

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

  const body = beginCell().
    store(storeDonate(danate)).
    endCell().
    toBoc().
    toString('base64');

  const deeplink = `ton://transfer/${'EQCUed4SHlw2Cr2SWywVvmOytRGCfHZXw5ORtz1njNuEUNhf'}?amount=${amount}&bin=${toBase64Url(body)}`;
  console.log(deeplink)

  const arrayFaq = [
    {
      name: "Установка кошелька",
      value: "Загрузите и установите мобильную версию кошелька; Перейдите в App Store или Google Play на своём мобильном устройстве и найдите приложение Tonkeeper. Скачайте и установите его на своё устройство.",
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
      <div className={styles.wrapper}>
        <Wrapper cs={styles.wrapperForm}>
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
        </Wrapper>
        {!isMobileWidth && (
          <Wrapper cs={styles.userInfo}>
            <div className={styles.userInfoContent}>
              <h2>{pageProps.username}</h2>
              <p>Теперь вы можете поддержать любимого стримера через криптовалюту</p>
            </div>
            <div className={styles.avatar}>
              <span>{String(pageProps.username)[0].toUpperCase()}</span>
            </div>
            <div className={styles.donatesButton}>
              <Button
                type={TypeButton.primary}
                onClick={() => router.push(deeplink)}
                size={ButtonSize.medium}
                style={{ width: "100%" }}
              >
                Поддержать
              </Button>
              <Link href={'/articles/how-it-is-works'}>
                Как это работает?
              </Link>
            </div>
         </Wrapper>
        )}
      </div>
      <div className={styles.wrapperFaq}>
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
