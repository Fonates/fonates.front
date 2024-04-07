import { Fragment } from "react";

const Page = () => {
    return (
        <Fragment>
            {/* <video width="100%" src="https://media.theoceanic.io/fonates/media/TON%20Fonates%20Donation.mp4" autoPlay controls style={{ objectFit: 'cover' }}/> */}
            <div className="article">
                <h1>Как это работает?</h1>
                <br />
                <div>
                    <h3>Установка кошелька</h3>
                    <p>
                        <a href="https://ton.org/ru/wallets?locale=ru&pagination[limit]=-1" style={{ color: 'blue' }}>Загрузите и установите</a> мобильную версию кошелька;
                        Войдите в приложение и следуйте рекомендациям;
                        <br/>
                        Важно! Обязательно сохраните seed-фразу из 24 слов в безопасное место и никому её не сообщайте.
                    </p>
                    <br />
                    <h3>Пополнение баланса</h3>
                    <p>
                        <a href="https://ton.org/ru/buy-toncoin?filters[exchange_groups][slug][$eq]=buy-with-card&pagination[page]=1&pagination[pageSize]=100" style={{ color: 'blue' }}>Пополните кошелёк</a> банковской картой или обменяйте с другой криптовалютой.
                    </p>
                    <br />
                    <h3>Отправка доната</h3>
                    <p>
                        Перейдите на страницу доната, выберите сумму и напишите текст для отправки; <br />
                        Отсканируйте QR-код или нажмите «Оплатить донат»;<br />
                        Подтвердите и отправьте транзакцию. <br />
                    </p>
                </div>
            </div>
        </Fragment>
    )
}

export default Page;