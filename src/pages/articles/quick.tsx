import { Fragment } from "react";

const Page = () => {
    return (
        <Fragment>
            <div className="article">
                <h1>Зрителям</h1>
                <br />
                <div>
                    <h3>Установка кошелька</h3>
                    <p>
                        <a href="https://ton.org/ru/wallets?locale=ru&pagination[limit]=-1" style={{ color: 'blue' }}>Загрузите и установите</a> мобильную версию кошелька. Войдите в приложение и следуйте рекомендациям. 
                        Обязательно сохраните seed-фразу из 24 слов в безопасное место и никому её не сообщайте — при потере seed-фразы восстановить кошелёк не получится.
                    </p>
                    <br />
                    <h3>Пополнение баланса</h3>
                    <p>
                        <a href="https://ton.org/ru/buy-toncoin?filters[exchange_groups][slug][$eq]=buy-with-card&pagination[page]=1&pagination[pageSize]=100" style={{ color: 'blue' }}>Пополните кошелёк</a> банковской картой или обменяйте с другой криптовалютой.
                    </p>
                    <br />
                    <h3>Отправка доната</h3>
                    <p>
                        Перейдите на страницу доната, выберите сумму и напишите текст для отправки.
                        Нажмите «Отправить донат» и подтвердите транзакцию в кошельке.
                    </p>
                </div>
            </div>
            <div className="article">
                <h1>Стримерам</h1>
                <br />
                <div>
                    <h3>Установка кошелька</h3>
                    <p>
                        <a href="https://ton.org/ru/wallets?locale=ru&pagination[limit]=-1" style={{ color: 'blue' }}>Загрузите и установите</a> мобильную версию кошелька. Войдите в приложение и следуйте рекомендациям. 
                        Обязательно сохраните seed-фразу из 24 слов в безопасное место и никому её не сообщайте — при потере seed-фразы восстановить кошелёк не получится.
                    </p>
                    <br />
                    <h3>Авторизация</h3>
                    <p>
                        Чтобы начать принимать пожертвования, перейдите в «Конструктор» и авторизуйтесь с помощью вашего TON кошелька.
                    </p>
                    <br />
                    <h3>Генерация ссылки</h3>
                    <p>
                        Нажмите по «Генерировать ссылку» чтобы получить уникальную ссылку для пожертвований
                    </p>
                    <br />
                    <h3>Активация ссылка</h3>
                    <p>
                        Активируйте вашу уникальную ссылку через OBS: вставьте ссылку в источник «Браузер». 
                    </p>
                    <br />
                    <h3>Распространение ссылки</h3>
                    <p>
                        Поздравляем! Ваша ссылка создана и активирована, теперь вы можете распространять её, например, добавить в описание Twitch канала и получать пожертвования.
                    </p>
                </div>
            </div>
        </Fragment>
    )
}

export default Page;