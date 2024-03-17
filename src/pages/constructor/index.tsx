import { TextField, TextFieldType, TextareaField } from "@/Form/TextField";
import styles from "./style.module.css";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "@/Form/useForm";
import { QR } from "react-qr-rounded";
import { SelectButtons } from "@/Form/SelectButtons";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Layout } from "@/components/Layout";
import { Button, TypeButton } from "@/Form/Button";
import { useRouter } from "next/navigation";
import { CopyField } from "@/Form/CopyField";
import { useTonConnectModal } from "@tonconnect/ui-react";

const BASE_URL = "https://fonates.com/donates/<wallet_address>";

const Page = () => {
  const router = useRouter();
  const { form, setFormValue } = useForm();
  const [link, setLink] = useState(BASE_URL);
  const [isCopy, setIsCopy] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const isMobileWidth = useMediaQuery("(max-width: 768px)");
  const { state, open, close } = useTonConnectModal();

  const isUserAddress = form?.address != '' && form?.address;

  const isDisabledLink = (
      (form?.address == '' || !form?.address) ||
      (form?.username == '' || !form?.username) ||
      !isGenerated
  );

  const onCopy = () => setIsCopy(true);

  function handleGenerateLink() {
      if (isDisabledLink) return;
      setIsGenerated(true);
  }

  useEffect(() => {
      if (form?.address != '') {
        setLink(new URL(BASE_URL.replace("<wallet_address>", form.address)).href);
      } else {
        setLink(BASE_URL);
      }
  }, [form])

  return (
      <div className={styles.wrapper}>
      <div className={styles.form}>
            <div className={styles.wrapperForm}>
                  <TextField
                        disabled={!isUserAddress}
                        fieldName="Ваше имя (никнейм)"
                        formName="username"
                        setForm={setFormValue}
                        inputProps={{
                              placeholder: "Введите ваше имя или никнейм",
                              name: "name",
                        }}
                  />
                  <TextField
                        fieldName="Адрес кошелька"
                        formName="address"
                        disabled
                        setForm={setFormValue}
                        inputProps={{
                              placeholder: "Введите адрес кошелька",
                              name: "name",
                        }}
                  />
                  {isUserAddress ? (
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
                        <CopyField value={link} onCopy={onCopy} disabled={isDisabledLink} fieldName="Ссылка на оплату" />
                        <p>Ссылка для публикации в социальных сетях или на стриминговых сервисах</p>
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
                        <Button type={TypeButton.primary} onClick={() => router.push('/articles/how-it-is-works?')}>
                              Скачать плагин
                        </Button>
                  </div>
            </div>
      )}
      </div>
  );
};

export default Page;