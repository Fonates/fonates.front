import { TextField } from "@/Form/TextField";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import { useForm } from "@/Form/useForm";
import { QR } from "react-qr-rounded";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button, ButtonSize, TypeButton } from "@/Form/Button";
import { useRouter } from "next/navigation";
import { CopyField } from "@/Form/CopyField";
import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import ApiLinks from "@/API/links";
import { Wrapper } from "@/components/Wrapper";

const BASE_URL = "https://fonates.com/donates/<wallet_address>";

const apiLinks = new ApiLinks({
      baseURL: process.env.NEXT_PUBLIC_API_URL_V1 || '',
      headers: {},
});

const PageConstructor = () => {
  const router = useRouter();
  const { form, setFormValue } = useForm();
  const [link, setLink] = useState(BASE_URL);
  const [isCopy, setIsCopy] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const isMobileWidth = useMediaQuery("(max-width: 768px)");
  const tonAddress = useTonAddress();
  const { open } = useTonConnectModal();

  const isUserAddress = tonAddress == '' || !tonAddress;
  const isUserName = form?.username == '' || !form?.username;
  const isDisabledLink = (
      isUserName ||
      isUserAddress
  );

  const onCopy = () => setIsCopy(true);

  async function handleGenerateLink() {
      if (isDisabledLink) return;

      const donateLink = new URL(BASE_URL.replace("<wallet_address>", form.address)).href;
      const response = await apiLinks.GenerateLink({
            address: tonAddress,
            username: form.username,
            link: donateLink,
            status: "active",
      });

      if (response?.status == "ok") {
            setLink(donateLink);
            setIsGenerated(true);
            return;
      }

      if (response?.link) {
            setLink(response.link);
            setIsGenerated(true);
            return;
      }
  }

  function downloadPlugin() {
      const url = `${process.env.NEXT_PUBLIC_API_URL_V1}plugin/${tonAddress}/generate`;
      console.log(url);
      window.open(url, "_blank");
  }

  useEffect(() => {
      if (form?.address == '') {
        setLink(BASE_URL);
      }
  }, [form])

  return (
      <div className={styles.wrapper}>
            <div className={styles.wpTitle}>
                  <h2>Состояние ссылки</h2>
                  <div className={styles.form}>
                        <Wrapper cs={styles.wrapperForm}>
                              {/* <TextField
                                    disabled={isUserAddress}
                                    fieldName="Ваше имя (никнейм)"
                                    formName="username"
                                    setForm={setFormValue}
                                    regExp={/^[a-zA-Zа-яА-Я0-9\s]+$/}
                                    maxChars={30}
                                    inputProps={{
                                          placeholder: "Введите ваше имя или никнейм",
                                          name: "name",
                                    }}
                              /> */}
                              <CopyField value={tonAddress || 'Ваше имя (никнейм)'} onCopy={onCopy} disabled={isUserAddress} fieldName="Никнейм" />
                              <CopyField value={tonAddress || 'Адрес кошелька'} onCopy={onCopy} disabled={isUserAddress} fieldName="Адрес кошелька" />
                              {!isUserAddress ? (
                                    <Button type={TypeButton.secondary} size={ButtonSize.medium} disabled={isGenerated || isDisabledLink} onClick={handleGenerateLink}>
                                          Генерировать ссылку
                                    </Button>
                              ) : (
                                    <Button type={TypeButton.secondary} size={ButtonSize.medium} onClick={open}>
                                          Подключить кошелек
                                    </Button>
                              )}
                              <hr />
                              <div className={styles.linkWrapper}>
                                    <CopyField value={link} onCopy={onCopy} disabled={isDisabledLink || !isGenerated} fieldName="Ссылка на оплату" />
                                    {/* <p>Ссылка для публикации в социальных сетях или на стриминговых сервисах</p> */}
                              </div>
                        </Wrapper>
                        <Wrapper cs={styles.qrCodeWrapper}>
                              <div className={styles.qrWrapper}>
                                    <QR
                                          color="#000"
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
                                          {link}
                                    </QR>
                              </div>
                              <span className={styles.qrHint}>
                                    Вы можете скачать QR-код для публикации в социальных сетях
                              </span>
                        </Wrapper>
                  </div>
            </div>
            {isGenerated && (
                  <div className={styles.wpTitle}>
                        <h2>Состояние ссылки</h2>
                        <Wrapper cs={styles.wrapperInfo}>
                              <div className={styles.infoTitle}>
                                    <h3>Интеграция в OBS Studio</h3>
                                    <p>Установите данную ссылку в OBS Studio или сториню программу для стрименга - используйте новый поток данных как Браузер, и установите ссылку.</p>
                              </div>
                              <CopyField value={`https://fonates.com/plugin/${tonAddress}/alerts`} onCopy={onCopy} />
                        </Wrapper>
                  </div>
            )}
      </div>
  );
};

export default PageConstructor;
