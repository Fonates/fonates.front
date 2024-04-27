import { TextField, TextareaField } from "@/Form/TextField";
import styles from "./style.module.css";
import { Fragment, useEffect } from "react";
import { useForm } from "@/Form/useForm";
import { SelectButtons } from "@/Form/SelectButtons";
import { Dropdown } from "@/components/Dropdown";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button, ButtonSize, TypeButton } from "@/Form/Button";
import { useRouter } from "next/navigation";
import ApiLinks, { ILink } from "@/API/links";
import { GetServerSideProps, NextPage } from "next";
import { Address, Builder, Cell, beginCell } from "@ton/core";
import { Wrapper } from "@/components/Wrapper";
import Link from "next/link";
import { useTonAddress, useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
import axios from "axios";
import ApiDonates, { IDonate } from "@/API/donate";
import { SMART_CONTRACT_FORWARDER } from "@/constants/globals";

interface IDonatePage {
  link: ILink;
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
  const { open } = useTonConnectModal();
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const address = useTonAddress();

  console.log(pageProps)

  const amount = Number(form.amount || 0) * 10 ** 9;

  const danate: Donate = {
    $$type: 'Donate',
    to: Address.parse(String(pageProps.link.User?.address || '')),
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

  const requestTxTonapi = async (hash: string): Promise<boolean> => {
    try {
      const { data } = await axios.get(`https://tonapi.io/v2/events/${hash}`)
      if (!data?.actions || !Array.isArray(data?.actions)) {
        throw new Error('[ERROR]: requestTxTonapi');
      }
      if (data.actions.length === 0) {
        throw new Error('[ERROR]: array actions is null');
      }

      return data.actions[0]?.status || false;
    } catch (error) {
      console.error(error);
      return false
    }
  }

  const handleDonate = async () => {
    try {
      const tx = await tonConnectUI.sendTransaction({
        messages: [
          {
            address: SMART_CONTRACT_FORWARDER,
            amount: String(amount),
            payload: body
          }
        ],
        validUntil: Date.now() + 60
      }, {
        modals: ['before', 'success', 'error'],
        notifications: ['before', 'success', 'error']
      });

      const hash = Cell.fromBase64(tx.boc).hash().toString('hex');
      const status = await requestTxTonapi(hash)
        
      if (!status) {
        throw new Error('[ERROR]: send donate');
      }

      const api = new ApiDonates({
        baseURL: process.env.NEXT_PUBLIC_API_URL_V1 || '',
        headers: {},
      });

      const result = await api.Create({
        id: pageProps.link.id,
        hash: hash,
        amount: amount,
        username: form.name,
        comment: form.comment,
        linkId: pageProps.link.id,
      });

      if (!result) {
        throw new Error('[ERROR]: handleCreateDonate');
      }

      alert('Транзакция успешно отправлена');
    } catch (error) {
      console.error(error);
      alert('Во время отправки произошла ошибка');
    }
  }

  const arrayFaq = [
    {
      name: "Почему TON Fonates?",
      value: "Скорость транзакций превосходит обычный перевод в банковских приложениях. Ваши средства не будут заморожены, если вы не ведёте трансляцию определённое время. TON Fonates не имеет такого понятия, как баланс личного кабинета, а все пожертвования напрямую отправляются на кошелёк стримера. Вы сможете отправлять и получать пожертвования из любой страны, несмотря на ограничения регуляторов. Станете активным пользователем Web3 технологий недалёкого будущего.",
    },
    {
      name: "Как установить и создать TON кошелёк?",
      value: "Перейдите в App Store или Google Play на своём мобильном устройстве и найдите приложение Tonkeeper. Скачайте и установите его на своё устройство. После установки приложения Tonkeeper, запустите его на своём устройстве и выберите «Создать новый кошелёк». Создайте надёжный пароль для вашего нового кошелька TON в Tonkeeper. После этого вам может быть предложено сделать резервную копию вашего кошелька. Обязательно сохраните seed-фразу (набор слов), которая позволит восстановить доступ к вашему кошельку в случае утери пароля."
    },
    {
      name: "Как пополнить баланс?",
      value: "Приобрести TON можно за фиатную валюту или путём обмена другой криптовалюты на биржах или Р2Р-маркетах. Если вы новичок, рекомендуем использовать вариант с покупкой TON за фиатную валюту в Р2Р-маркете Telegram Wallet. Это самый лёгкий и быстрый способ приобрести TON.",
    },
    {
      name: "Как отправить донат?",
      value: "Авторизуйтесь используя свой кошелёк. Перейдите на страницу доната, выберите сумму и напишите текст для отправки. Нажмите «Отправить донат». Подтвердите и отправьте транзакцию в кошельке Tonkeeper.",
    }
  ];

  return (
    <Fragment>
      <div className={styles.wrapper}>
        <Wrapper cs={styles.wrapperForm}>
          <div className={styles.amountWrapper}>
              <SelectButtons
                arrayValues={[1, 2, 5, 10]}
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
        <Wrapper cs={styles.userInfo}>
            <div className={styles.userInfoContent}>
              <h2>{pageProps.link.User?.username}</h2>
              <p>Поддержите автора отправив ему TON</p>
            </div>
            <div className={styles.avatar}>
              <span>{String(pageProps.link.User?.username)[0].toUpperCase()}</span>
            </div>
            <div className={styles.donatesButton}>
              <Button
                type={TypeButton.primary}
                onClick={address == '' ? () => open() : () => handleDonate()}
                size={ButtonSize.medium}
                style={{ width: "100%" }}
              >
                {address == '' ? 'Подключить кошелк' : 'Отправить донат'}
              </Button>
              <Link className={styles.lk} href={'/articles/quick'}>
                Как это работает?
              </Link>
            </div>
        </Wrapper>
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

  const slugDonateLink = slug_donate as string;
  const response = await api.GetLinkBySlug(slugDonateLink);

  if (!response || response?.error) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      link: response || {},
    },
  }
};

export default DonatePage;
