import { TextField, TextareaField } from "@/Form/TextField";
import styles from "./style.module.css";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "@/Form/useForm";
import { SelectButtons } from "@/Form/SelectButtons";
import { Dropdown } from "@/components/Dropdown";
import { Button, ButtonSize, TypeButton } from "@/Form/Button";
import ApiLinks, { ILink } from "@/API/links";
import { GetServerSideProps, NextPage } from "next";
import { Address, Builder, Cell, beginCell, fromNano, toNano } from "@ton/core";
import { Wrapper } from "@/components/Wrapper";
import Link from "next/link";
import { useTonAddress, useTonConnectModal, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import axios from "axios";
import ApiDonates, { IDonate } from "@/API/donate";
import { SMART_CONTRACT_FORWARDER } from "@/constants/globals";
import { Avatar, AvatarSize } from "@/components/Avatar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { sliceWalletAddress } from "@/utils/sliceAddress";
import { formatNumber } from "@/utils/formatNumber";
import { Skeleton } from "@/components/Skeleton";
import IconWallet96 from '@/assets/icons/wallet_96.svg'
import { useRouter } from "next/router";

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
      b_0.storeUint(2018962093, 64);
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

const api = new ApiDonates({
  baseURL: process.env.NEXT_PUBLIC_API_URL_V1 || '',
  headers: {},
});

const tonapiAppKey = 'AEIJAIYB36JEQXYAAAAN4XYISZAZMTY75D3JTBEEDPJH36D3TJ2ZBKYCRBZFEFEVZVKO6KY'

enum Currencies {
  ton = 'ton',
  usd = 'usd'
}

const requestRates = async (tokens: string[], currencies: Currencies[]) => {
  try {
    const tokensStr = tokens.join(',')
    const currenciesStr = currencies.join(',')

    const { data } = await axios.get(`https://tonapi.io/v2/rates?tokens=${tokensStr}&currencies=${currenciesStr}`, {
      headers: {
        'Authorization': `Bearer ${tonapiAppKey}`
      }
    })

    if (!data?.rates) {
      throw new Error('Rates not found');
    }

    return data.rates 
  } catch (error) {
    console.error(error)
    return null
  }
}


const DonatePage: NextPage<IDonatePage> = (pageProps) => {
  const router = useRouter();
  const { form, setFormValue } = useForm();
  const { open } = useTonConnectModal();
  const isMobileWidth = useMediaQuery('(max-width: 768px)')
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const address = useTonAddress();
  const [isMounted, setIsMounted] = useState(false);

  const [financeInfo, setFinanceInfo] = useState({
    balance: 0.00,
    currencies: {
      TON: 0.00,
      USD: 0.00,
    },
    isWallet: false,
    isCurrency: false,
  })

  const isShowFinance = financeInfo.isCurrency && financeInfo.isWallet;
  const amount = Number(form?.amount || 0) * 10 ** 9;

  const danate: Donate = {
    $$type: 'Donate',
    to: Address.parse(String(pageProps.link.User?.address || '')),
    text: `ton.fonates|${form.name}|${form.comment}` || '',
    value: toNano(String(amount)),
  }

  const body = beginCell().
    store(storeDonate(danate)).
    endCell().
    toBoc().
    toString('base64');

  // const deeplink = `ton://transfer/${'EQCUed4SHlw2Cr2SWywVvmOytRGCfHZXw5ORtz1njNuEUNhf'}?amount=${amount}&bin=${toBase64Url(body)}`;

  const requestAccountTonapi = async (address: string) => {
    try {
      const { data } = await axios.get(`https://tonapi.io/v2/accounts/${address}`, {
        headers: {
          'Authorization': `Bearer ${tonapiAppKey}`
        }
      })
      if (!data?.balance) {
        throw new Error('Account is not wallet')
      }

      return data
    } catch (error) {
      console.error(error)
      return null
    }
  }

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
            payload: body,
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

      const result = await api.Create({
        hash: hash,
        amount: amount,
        username: form.name,
        comment: form.comment,
        linkId: pageProps.link.id,
      });

      if (!result) {
        throw new Error('[ERROR]: handleCreateDonate');
      }
    } catch (error) {
      console.error(error);
      alert('Во время отправки произошла ошибка');
    }
  }

  const buttonDisabled = () => {
    if (address == '') return false;
    if (address != '' && !isShowFinance) return true;
    if (form?.name == '' || !form?.name) return true;
    if (address == '' || form.amount == 0) return true;
    return false;
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

  const handleGetWallet = async () => {
    const wallet = await requestAccountTonapi(address);
    if (!wallet) return

    setFinanceInfo((items: any) => ({
      ...items,
      balance: Number(fromNano(wallet?.balance)),
      isWallet: true,
    }));
  }

  const handleGetRates = async () => {
    const rates = await requestRates(['TON'], [Currencies.ton, Currencies.usd])
    if (!rates) return

    setFinanceInfo((items: any) => ({
      ...items,
      isCurrency: true,
      currencies: rates['TON'].prices,
    }));
  }

  const handleGetFinanceInfo = async () => {
    setTimeout(() => {
      handleGetWallet().then(() => {
        setTimeout(() => {
          handleGetRates()
          setInterval(() => {
            handleGetRates()
          }, 5000)
        }, 1000)
      })
    }, 1000)
  }

  useEffect(() => {
    if (address != '' && isMounted) {
      handleGetFinanceInfo()
    }
  }, [isMounted, address])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const skeletonStyle = { width: '100%', height: '19px' };

  return (
    <Fragment>
      <div className={"wp__title"}>
        <h1>Отправить донат</h1>
        <div className={styles.wrapper}>
          <Wrapper cs={styles.wrapperForm}>
            <div className={styles.amountWrapper}>
                <SelectButtons
                  arrayValues={[1, 2, 5, 10]}
                  nameValue="TON"
                  value={form?.amount  || 0}
                  setForm={(name: string, value: any) => {
                    const valueToNumber = Number(value || 0)
                    if (valueToNumber <= financeInfo.balance) {
                      setFormValue(name, valueToNumber)
                    } else {
                      setFormValue(name, 0.0)
                    }
                  }}
                  fieldName="Сумма доната"
                  disabled={address == ''}
                  formName="amount"
                />
              </div>
              <TextField
                fieldName="Имя"
                formName="name"
                maxChars={20}
                value={form?.name}
                setForm={setFormValue}
                disabled={address == ''}
                inputProps={{
                  placeholder: "Введите ваше имя",
                  name: "name",
                }}
              />
              <TextareaField
                fieldName="Коментарий"
                maxLength={200}
                value={form?.comment}
                disabled={address == ''}
                formName="comment"
                setForm={setFormValue}
                inputProps={{
                  placeholder: "Введите коментарий",
                  name: "comment",
                  rows: 5,
                }}
              />
          </Wrapper>
          {address === '' && (
            <Wrapper cs={styles.userInfo} style={{ width: isMobileWidth ? '100%' : 'fit-content' }}>
                <div className={styles.emptyInfo}>
                  <div className={styles.hintsEmptyInfo}>
                    <IconWallet96 />
                    <p>Подключите кошелк для отправки</p>
                    <Link className={styles.lk} href={'/articles/quick'}>
                        Как это работает?
                    </Link>
                  </div>
                  <div className={styles.donatesButton}>
                    <Button
                      type={TypeButton.primary}
                      onClick={address == '' ? () => open() : () => handleDonate()}
                      size={ButtonSize.medium}
                      disabled={buttonDisabled()}
                      style={{ width: "100%"}}
                    >
                      <span>
                        {address == '' ? 'Подключить кошелк' : 'Отправить донат'}
                      </span>
                    </Button>
                  </div>
                </div>
            </Wrapper>
          )}
          {address !== '' && (
            <Wrapper cs={styles.userInfo} style={{ width: isMobileWidth ? '100%' : 'fit-content' }}>
              <div className={styles.userInfoContent}>
                <Avatar username={pageProps.link.User?.username || 'A'} size={AvatarSize.normal} />
                <h2>{pageProps.link.User?.username}</h2>
              </div>
              <div className={styles.infoPayment}>
                <div className={styles.row}>
                  <span className={styles.rowName}>Контракт</span>
                  <span className={styles.rowValue}>
                    <Link href={`https://tonviewer.com/${SMART_CONTRACT_FORWARDER}`} target={'_blank'}>
                      {sliceWalletAddress(SMART_CONTRACT_FORWARDER, 6)}
                    </Link>
                  </span>
                </div>

                <div className={styles.row}>
                  <span className={styles.rowName}>Коммисия</span>
                  <span className={styles.rowValue}>0%</span>
                </div>
              </div>
              <div className={styles.infoPayment}>
                <Skeleton show={isShowFinance} style={skeletonStyle}>
                  <div className={styles.row}>
                    <span className={styles.rowName}>Ваш баланс</span>
                    <span className={styles.rowValue}>{formatNumber(financeInfo.balance)} TON</span>
                  </div>
                </Skeleton>
                <Skeleton show={isShowFinance} style={skeletonStyle}>
                  <div className={styles.row}>
                    <span className={styles.rowName}>Цена TON</span>
                    <span className={styles.rowValue}>${formatNumber(financeInfo.currencies.USD)}</span>
                  </div>
                </Skeleton>
                <Skeleton show={isShowFinance} style={skeletonStyle}>
                  <div className={styles.row} style={{ alignItems: 'start' }}>
                    <span className={styles.rowName}>К&nbsp;оплате</span>
                    <span className={styles.rowValue}>
                      {formatNumber(Number(form.amount || 0), 4)}&nbsp;TON
                      ≈&nbsp;${formatNumber(Number(form.amount || 0) * financeInfo.currencies.USD, 4)}
                    </span>
                  </div>
                </Skeleton>
              </div>
              <div className={styles.donatesButton}>
                <Button
                  type={TypeButton.primary}
                  onClick={address == '' ? () => open() : () => handleDonate()}
                  size={ButtonSize.medium}
                  disabled={buttonDisabled()}
                  style={{ width: "100%"}}
                >
                  <span>
                    {address == '' ? 'Подключить кошелк' : 'Отправить донат'}
                  </span>
                </Button>
              </div>
            </Wrapper>
          )}
        </div>
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
