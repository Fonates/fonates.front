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
  comment: string;
}

export function storeDonate(src: Donate) {
  return (builder: Builder) => {
      let b_0 = builder;
      b_0.storeUint(753836423, 32);
      b_0.storeAddress(src.to);
      b_0.storeStringRefTail(src.comment);
  };
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

  const danate: Donate = {
    $$type: 'Donate',
    to: Address.parse(String(pageProps.link.User?.address || '')),
    comment: `ton.fonates|${form.name}|${form.comment}` || '',
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

  const requestTxTonapi = async (hash: string): Promise<{ amount: number, status: boolean }> => {
    try {
      const { data } = await axios.get(`https://tonapi.io/v2/events/${hash}`)
      if (!data?.actions || !Array.isArray(data?.actions)) {
        throw new Error('[ERROR]: requestTxTonapi');
      }
      if (data.actions.length === 0) {
        throw new Error('[ERROR]: array actions is null');
      }

      const isSuccessExecute = data.actions[0]?.status == "ok"
      const isSuccessTransfer = data.actions[1]?.status == "ok"

      return {
        amount: data.actions[1]?.TonTransfer?.amount || Number(form.amount) * 1000000000,
        status: (isSuccessExecute && isSuccessTransfer) || false
      }
    } catch (error) {
      console.error(error);
      return {
        amount: Number(form?.amount) * 1000000000,
        status: false
      }
    }
  }

  const handleDonate = async () => {
    try {
      const tx = await tonConnectUI.sendTransaction({
        messages: [
          {
            address: SMART_CONTRACT_FORWARDER,
            amount: toNano(Number(form?.amount || 0)).toString(),
            payload: body,
          }
        ],
        validUntil: Date.now() + 60
      }, {
        modals: ['before', 'success', 'error'],
        notifications: ['before', 'success', 'error']
      });

      const hash = Cell.fromBase64(tx.boc).hash().toString('hex');
      const txData = await requestTxTonapi(hash)
        
      if (!txData.status) {
        throw new Error('[ERROR]: send donate');
      }

      const result = await api.Create({
        id: 0,
        hash: hash,
        amount: txData.amount,
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
      name: "Why TON Fonates?",
      value: "Transaction speed surpasses regular transfers in banking apps. Your funds won't be frozen if you don't broadcast for a certain period. TON Fonates doesn't have the concept of a personal account balance, and all donations are sent directly to the streamer's wallet. You can send and receive donations from any country despite regulatory restrictions. You will become an active user of Web3 technologies in the near future."
    },
    {
      name: "How to install and create a TON wallet?",
      value: "Go to the App Store or Google Play on your mobile device and find the Tonkeeper app. Download and install it on your device. After installing the Tonkeeper app, launch it on your device and select 'Create a new wallet.' Create a strong password for your new TON wallet in Tonkeeper. After this, you may be prompted to back up your wallet. Be sure to save the seed phrase (a set of words) which will allow you to restore access to your wallet if you lose your password."
    },
    {
      name: "How to top up the balance?",
      value: "You can purchase TON for fiat currency or by exchanging another cryptocurrency on exchanges or P2P markets. If you are a beginner, we recommend using the option to buy TON for fiat currency on the P2P market Telegram Wallet. This is the easiest and fastest way to acquire TON."
    },
    {
      name: "How to send a donation?",
      value: "Log in using your wallet. Go to the donation page, select the amount, and write a message to send. Click 'Send donation.' Confirm and send the transaction in the Tonkeeper wallet."
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
        <h1>Send Donation</h1>
        <div className={styles.wrapper}>
          <Wrapper cs={styles.wrapperForm}>
            <div className={styles.amountWrapper}>
              <SelectButtons
                arrayValues={[1, 2, 5, 10]}
                nameValue="TON"
                value={form?.amount || 0}
                setForm={(name: string, value: any) => {
                  const valueToNumber = Number(value || 0)
                  if (valueToNumber <= financeInfo.balance) {
                    setFormValue(name, valueToNumber)
                  } else {
                    setFormValue(name, 0.0)
                  }
                }}
                fieldName="Donation Amount"
                disabled={address == ''}
                formName="amount"
              />
            </div>
            <TextField
              fieldName="Name"
              formName="name"
              maxChars={20}
              value={form?.name}
              setForm={setFormValue}
              disabled={address == ''}
              inputProps={{
                placeholder: "Enter your name",
                name: "name",
              }}
            />
            <TextareaField
              fieldName="Comment"
              maxLength={200}
              value={form?.comment}
              disabled={address == ''}
              formName="comment"
              setForm={setFormValue}
              inputProps={{
                placeholder: "Enter your comment",
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
                  <p>Connect a wallet to send a donation</p>
                  <Link className={styles.lk} href={'/articles/quick'}>
                    How does it work?
                  </Link>
                </div>
                <div className={styles.donatesButton}>
                  <Button
                    type={TypeButton.primary}
                    onClick={address == '' ? () => open() : () => handleDonate()}
                    size={ButtonSize.medium}
                    disabled={buttonDisabled()}
                    style={{ width: "100%" }}
                  >
                    <span>
                      {address == '' ? 'Connect Wallet' : 'Send Donation'}
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
                  <span className={styles.rowName}>Contract</span>
                  <span className={styles.rowValue}>
                    <Link href={`https://tonviewer.com/${SMART_CONTRACT_FORWARDER}`} target={'_blank'}>
                      {sliceWalletAddress(SMART_CONTRACT_FORWARDER, 6)}
                    </Link>
                  </span>
                </div>
  
                <div className={styles.row}>
                  <span className={styles.rowName}>Commission</span>
                  <span className={styles.rowValue}>0%</span>
                </div>
              </div>
              <div className={styles.infoPayment}>
                <Skeleton show={isShowFinance} style={skeletonStyle}>
                  <div className={styles.row}>
                    <span className={styles.rowName}>Your Balance</span>
                    <span className={styles.rowValue}>{formatNumber(financeInfo.balance)} TON</span>
                  </div>
                </Skeleton>
                <Skeleton show={isShowFinance} style={skeletonStyle}>
                  <div className={styles.row}>
                    <span className={styles.rowName}>TON Price</span>
                    <span className={styles.rowValue}>${formatNumber(financeInfo.currencies.USD)}</span>
                  </div>
                </Skeleton>
                <Skeleton show={isShowFinance} style={skeletonStyle}>
                  <div className={styles.row} style={{ alignItems: 'start' }}>
                    <span className={styles.rowName}>To Pay</span>
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
                  style={{ width: "100%" }}
                >
                  <span>
                    {address == '' ? 'Connect Wallet' : 'Send Donation'}
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
  