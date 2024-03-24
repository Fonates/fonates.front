import { TextField } from "@/Form/TextField";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import { useForm } from "@/Form/useForm";
import { QR } from "react-qr-rounded";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button, TypeButton } from "@/Form/Button";
import { useRouter } from "next/navigation";
import { CopyField } from "@/Form/CopyField";
import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import ApiLinks from "@/API/links";

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
            address: form.address,
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
      <div className={styles.form}>
            <div className={styles.wrapperForm}>
                  <TextField
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
                  />
                  <TextField
                        disabled
                        fieldName="Адрес кошелька"
                        formName="address"
                        value={tonAddress}
                        setForm={setFormValue}
                        inputProps={{
                              placeholder: "Введите адрес кошелька",
                              name: "name",
                        }}
                  />
                  {!isUserAddress ? (
                        <Button type={TypeButton.secondary} disabled={isGenerated || isDisabledLink} onClick={handleGenerateLink}>
                              Генерировать ссылку
                        </Button>
                  ) : (
                        <Button type={TypeButton.secondary} onClick={open}>
                              Подключить кошелек
                        </Button>
                  )}
                  <hr />
                  <div className={styles.linkWrapper}>
                        <CopyField value={link} onCopy={onCopy} disabled={isDisabledLink || !isGenerated} fieldName="Ссылка на оплату" />
                        {/* <p>Ссылка для публикации в социальных сетях или на стриминговых сервисах</p> */}
                  </div>
            </div>
            <div className={styles.wrapperForm} style={{ width: isMobileWidth ? '100%' : "fit-content" }}>
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
                              {link}
                        </QR>
                  </div>
                  <span className={styles.qrHint}>
                        Вы можете скачать QR-код для публикации в социальных сетях
                  </span>
            </div>
      </div>
      {isGenerated && (
            <div className={styles.msgWrapper}>
                  <p>Чтобы активировать ссылку установите плагин в OBS Studio</p>
                  <div className={styles.btnWrapper}>
                        <Button type={TypeButton.secondary} onClick={() => router.push('/articles/how-it-is-works?')}>
                              Как установить плагин в OBS?
                        </Button>
                        <Button type={TypeButton.primary} onClick={downloadPlugin}>
                              Скачать плагин
                        </Button>
                  </div>
            </div>
      )}
      </div>
  );
};

export default PageConstructor;
