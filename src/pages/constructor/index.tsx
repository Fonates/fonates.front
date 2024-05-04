import { TextField } from "@/Form/TextField";
import styles from "./style.module.css";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@/Form/useForm";
import { QR } from "react-qr-rounded";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button, ButtonSize, TypeButton } from "@/Form/Button";
import { useRouter } from "next/navigation";
import { CopyField } from "@/Form/CopyField";
import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import ApiLinks from "@/API/links";
import { Wrapper } from "@/components/Wrapper";
import { LinkActivationStatus, ProgressActivation } from "@/components/PrograssActivation";
import { STORE_KEYS, deleteItemFromStore, getFromStroe, setItemToStore } from "@/utils/localstore";
import * as htmlToImage from 'html-to-image';
import IconDownload from "@/assets/icons/download.svg";

const BASE_URL = "https://fonates.com/donates/<link_id>";

const apiLinks = new ApiLinks({
      baseURL: process.env.NEXT_PUBLIC_API_URL_V1 || '',
      headers: {},
});

const PageConstructor = () => {
  const tonAddress = useTonAddress();
  const { open } = useTonConnectModal();

  const store = getFromStroe(STORE_KEYS.KEY_CONSTRUCTOR_FORM)
  const dataFromStore = tonAddress != '' && tonAddress ? store : {};

  const { form, setFormValue } = useForm(dataFromStore?.data?.form);
  const [linkStatus, setLinkStatus] = useState<LinkActivationStatus>(dataFromStore?.data?.status || LinkActivationStatus.default);
  const [isCopy, setIsCopy] = useState(false);
  const isMobileWidth = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef(null);

  const isUserAddress = tonAddress == '' || !tonAddress;
  const isLinkName = form?.linkname == '' || !form?.linkname;

  const downloadQR = () => {
    const container = containerRef.current;

    try {
      if (!container) {
        throw new Error("Container is not defined");
      }

      htmlToImage.toPng(container)
        .then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = dataUrl;
            link.click();
        });
      } catch (error) {
        console.error(error);
      }
    };

  const onCopy = () => setIsCopy(true);

  async function handleGenerateLink() {
      if (isLinkName) return;

      try {
        const response = await apiLinks.GenerateLink({
          name: form.linkname || '',
          id: 0
        });

        if (response?.status != "ok") {
          throw new Error("Error generate link");    
        }

        const donateLink = new URL(BASE_URL.replace("<link_id>", response?.key)).href;
        
        const formData: any = {
            linkId: response?.key,
            fullLink: donateLink,
            linkname: form.linkname,
            isGenerated: true,
        }

        Object.keys(formData).forEach((key: string) => {
            setFormValue(key, formData[key]);
        });

        setLinkStatus(LinkActivationStatus.integration);
        setItemToStore(STORE_KEYS.KEY_CONSTRUCTOR_FORM, {
            form: formData,
            status: LinkActivationStatus.integration,
        });
      } catch (error) {
        console.error(error);
      }
  }

  async function checkLinkStatus() {
    try {
      if (!form?.linkId) {
        throw new Error("Link id is not defined");
      }

      const response = await apiLinks.GetLinkStatus(form?.linkId);
      if (response?.status === "INACTIVE") {
        return
      }

      setLinkStatus(LinkActivationStatus.active);
      setItemToStore(STORE_KEYS.KEY_CONSTRUCTOR_FORM, {
        form: form,
        isGenerated: true,
        status: LinkActivationStatus.active,
     });

    //  setTimeout(() => {
    //     deleteItemFromStore(STORE_KEYS.KEY_CONSTRUCTOR_FORM);
    //     router.refresh();
    //  }, 3000)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (form?.linkId) {
      const interval = setInterval(() => {
        checkLinkStatus();
      }, 1000 * 3)
      
      return () => clearInterval(interval);
    }
  }, [form?.linkId])

  return (
      <div className={styles.wrapper}>
            <div className={"wp__title"}>
              <h1>Конструктор ссылок</h1>
              <div className={styles.form}>
                    <Wrapper cs={styles.wpController}>
                        <div className={styles.wrapperForm}>
                          <div className={styles.btnController}>
                              <TextField
                                  disabled={form?.isGenerated || isUserAddress}
                                  fieldName="Название ссылки"
                                  formName="linkname"
                                  value={form?.linkname || ''}
                                  setForm={setFormValue}                          
                                  maxChars={100}
                                  inputProps={{
                                      placeholder: "Введите ваше имя или никнейм",
                                      name: "name",
                                  }}
                              />
                              {!isUserAddress ? (
                                  <Button type={TypeButton.secondary} size={ButtonSize.medium} disabled={form?.isGenerated || isLinkName} onClick={handleGenerateLink}>
                                      Генерировать ссылку
                                  </Button>
                              ) : (
                                  <Button type={TypeButton.secondary} size={ButtonSize.medium} onClick={open}>
                                      Подключить кошелек
                                  </Button>
                              )}
                          </div>
                          <hr />
                          <div className={styles.linkWrapper}>
                                <CopyField 
                                  value={form?.fullLink || BASE_URL}
                                  onCopy={onCopy}
                                  disabled={isLinkName || !form?.isGenerated}
                                  fieldName="Ссылка на странцу доната"
                                  />
                          </div>
                        </div>
                        {!isMobileWidth && (
                          <div className={`${styles.qrWrapper} ${form?.isGenerated ? '' : styles.qrInactive}`}>
                            <div className={`${styles.qrTitle} ${form?.isGenerated ? styles.qrTitleActive : ''}`} onClick={form?.isGenerated ? downloadQR : () => {}}>
                                <span><IconDownload /></span>
                            </div>
                            <div ref={containerRef}>
                              <QR
                                  color="#000"
                                  backgroundColor="#17171900"
                                  rounding={100}
                                  width={225}
                                  height={225}
                                  errorCorrectionLevel="H"
                              >
                                  {form?.fullLink || BASE_URL}
                              </QR>
                            </div>
                          </div>
                        )}
                    </Wrapper>
              </div>
            </div>
            <div className="wp__title">
              <h2>Состояние ссылки</h2>
              <div className={styles.form}>
                  <ProgressActivation status={linkStatus} linkId={form?.linkId} />
              </div>
            </div>
      </div>
  );
};

export default PageConstructor;
