import { Button, TypeButton } from "@/Form/Button";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import { Fragment } from "react";
import { Alert } from "./plugins/[slug_donate]/alert";
import useMediaQuery from "@/hooks/useMediaQuery";

const Page = () => {
  const router = useRouter();
  const isMobileWidth = useMediaQuery("(max-width: 768px)");

  return (
    <Fragment>
      <div className={styles.mainInfo}>
        <div className={styles.topSection}>
          <div className={styles.title}>
            <h1>Новая эра донатов</h1>
            <p>Отправка донатов стримерам через самый быстрый блокчейн в мире - <span>TON</span></p>
          </div>
          <Button 
            type={TypeButton.accentBorder}
            onClick={() => router.push(isMobileWidth ? '/constructor' : '/articles/quick')} 
            style={{ width: 'fit-content' }}
          >
            Быстрый старт
          </Button>
        </div>
        <div className={styles.wpObsView}>
          <img className={styles.mac} src="obs.png" alt="main" />
          <Alert 
            index={0}
            amountInTon={14}
            username="JimmyBobs"
            message="Атмосферные у тебя стримы, удачи в развитии"
            isVisible={true}
            key="key"
            position={{
              x: -450,
              y: 80,
              zIndex: 1
            }} 
          />
          <Alert 
            index={0} 
            amountInTon={24}
            username="Petrushka"
            message="Все видят это сообщение на стриме?"
            isVisible={true}
            key="key"
            position={{
              x: -250,
              y: 280,
              zIndex: 1
            }} 
          />
          <Alert 
            index={0} 
            amountInTon={14} 
            username="Hamirlay" 
            message="@bratishkinoff Здарова шеф, сегодня мемы ТГ будут?" 
            isVisible={true} 
            key="key" 
            position={{
              x: 750,
              y: 280,
              zIndex: 1
            }} 
          />
          <Alert 
            index={0} 
            amountInTon={32} 
            username="PewPells" 
            message="@JesusAVGN ля какая башня" 
            isVisible={true}
            key="key" 
            position={{
              x: 950,
              y: 80,
              zIndex: 1
            }} 
          />
        </div>
      </div>
    </Fragment>
  );
}

export default Page;