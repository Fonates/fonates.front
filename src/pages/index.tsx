import { Button, TypeButton } from "@/Form/Button";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import { Fragment } from "react";

const Page = () => {
  const router = useRouter();

  return (
    <Fragment>
      <div className={styles.mainInfo}>
        <div className={styles.title}>
          <h1>Новая эра донатов</h1>
          <p>Отправка донатов стримерам через самый быстрый блокчейн в мире - <span>TON</span></p>
        </div>
        <Button 
          type={TypeButton.accentBorder}
          onClick={() => router.push('/articles/quick')} 
          style={{ width: 'fit-content' }}
        >
          Быстрый старт
        </Button>
      </div>
    </Fragment>
  );
}

export default Page;