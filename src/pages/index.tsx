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
            <h1>New era of donations</h1>
            <p>Send donations to streamers via the fastest blockchain in the world - <span>TON</span></p>
          </div>
          <Button 
            type={TypeButton.accentBorder}
            onClick={() => router.push(isMobileWidth ? '/constructor' : '/articles/quick')} 
            style={{ width: 'fit-content' }}
          >
            Quick Start
          </Button>
        </div>
        <div className={styles.wpObsView}>
          <img className={styles.mac} src="obs.png" alt="main" />
          <Alert 
            index={0}
            amountInTon={14}
            username="JimmyBobs"
            message="Your streams have a great atmosphere, good luck with your development"
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
            message="Is everyone seeing this message on the stream?"
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
            message="@bratishkinoff Hey boss, are we having Telegram memes today?" 
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
            message="@JesusAVGN Wow, what a tower" 
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
