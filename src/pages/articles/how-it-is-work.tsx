import { Wrapper } from "@/components/Wrapper";
import Image from "next/image";
import { Fragment } from "react";

const Page = () => {
    return (
        <Fragment>
            {/* <video width="100%" src="https://media.theoceanic.io/fonates/media/TON%20Fonates%20Donation.mp4" autoPlay controls style={{ objectFit: 'cover' }}/> */}
            <div className="article">
                <Wrapper cs={"aritces__img"}>
                    <Image src={'/how_img.jpg'} width={640} height={360} alt={'quick_img.jpg'} />
                </Wrapper>
                <div className="article__texts">
                    <h1>Как это работает?</h1>
                    <div>
                        <h3>Установка кошелька</h3>
                        <p>
                            <a href="https://ton.org/ru/wallets?locale=ru&pagination[limit]=-1">Загрузите и установите</a> мобильную версию кошелька. Войдите в приложение и следуйте рекомендациям. 
                            Обязательно сохраните seed-фразу из 24 слов в безопасное место и никому её не сообщайте — при потере seed-фразы восстановить кошелёк не получится.
                        </p>
                        <h3>Пополнение баланса</h3>
                        <p>
                            <a href="https://ton.org/ru/buy-toncoin?filters[exchange_groups][slug][$eq]=buy-with-card&pagination[page]=1&pagination[pageSize]=100">Пополните кошелёк</a> банковской картой или обменяйте с другой криптовалютой.
                        </p>
                        <h3>Отправка доната</h3>
                        <p>
                            Перейдите на страницу доната, выберите сумму и напишите текст для отправки.
                            Нажмите «Отправить донат» и подтвердите транзакцию в кошельке.
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Page;