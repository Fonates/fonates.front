'use client';
import { Layout } from "src/components/Layout";
import styles from "./style.module.css";
import { Button, TypeButton } from "src/Form/Button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className={styles.mainInfo}>
        <div className={styles.title}>
          <h1>Новая эра донатов</h1>
          <p>Отправка донатов стримерам через самый быстрый блокчейн в мире - <span>TON</span></p>
        </div>
        <Button 
          type={TypeButton.accentBorder}
          onClick={() => router.push('/articles/how-it-is-works?')} 
          style={{ width: 'fit-content' }}
        >
          Быстрый старт
        </Button>
      </div>
    </Layout>
  );
}

export default Page;