"use client";
import { TextField, TextFieldType, TextareaField } from "src/Form/TextField";
import styles from "./style.module.css";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "src/Form/useForm";
import { QR } from "react-qr-rounded";
import { SelectButtons } from "src/Form/SelectButtons";
import useMediaQuery from "src/hooks/useMediaQuery";
import { Layout } from "src/components/Layout";
import { Button, TypeButton } from "src/Form/Button";
import { useRouter } from "next/navigation";
import { CopyField } from "src/Form/CopyField";

const BASE_URL = "https://fonates.com/donates/<wallet_address>";

const Page = () => {
  const { form, setFormValue } = useForm();
  const [link, setLink] = useState(BASE_URL);
  const [isCopy, setIsCopy] = useState(false);
  const isMobileWidth = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const isDisabledLink = (form?.address == '' || !form?.address) || (form?.username == '' || !form?.username);

  console.log(form)

  useEffect(() => {
      if (form?.address != '') {
        setLink(new URL(BASE_URL.replace("<wallet_address>", form.address)).href);
      } else {
        setLink(BASE_URL);
      }
  }, [form])

  const onCopy = () => {
      setIsCopy(true);
  }

  return (
    <Layout>
      <div className={styles.wrapper}>
            <div className={styles.form}>
                  <div className={styles.wrapperForm}>
                        <TextField
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
                              setForm={setFormValue}
                              inputProps={{
                                    placeholder: "Введите адрес кошелька",
                                    name: "name",
                              }}
                        />
                        <hr />
                        <div className={styles.linkWrapper}>
                              <CopyField value={link} onCopy={onCopy} disabled={isDisabledLink} fieldName="Ссылка на оплату" />
                              <p>Ссылка для публикации в социальных сетях или на стриминговых сервисах</p>
                        </div>
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
                                    {link}
                              </QR>
                        </div>
                        <span className={styles.qrHint}>
                              Вы можете скачать QR-код для публикации в социальных сетях
                        </span>
                  </div>
                  )}
            </div>
            {isCopy && (
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
    </Layout>
  );
};

export default Page;
