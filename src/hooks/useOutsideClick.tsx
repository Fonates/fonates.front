import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
    const router = useRouter();

    const handleClick = (e: MouseEvent) => {
        // Проверяем, был ли клик выполнен вне элемента, на который привязан хук
        if (ref.current && !ref.current.contains(e.target as Node)) {
            callback();
        }
    }

    useEffect(() => {
        // Добавляем обработчик клика при монтировании компонента
        document.addEventListener('mousedown', handleClick);

        return () => {
            // Удаляем обработчик клика при размонтировании компонента
            document.removeEventListener('mousedown', handleClick);
        }
    }, [ref]); // Обновляем эффект, когда изменяется ref

    useEffect(() => {
        // Дополнительный эффект для обновления при изменении router.asPath
        // Вызываем callback при изменении маршрута
        const handleRouteChange = () => {
            callback();
        };

        // Подписываемся на событие изменения маршрута
        router.events.on('routeChangeStart', handleRouteChange);

        // Отписываемся от события изменения маршрута при размонтировании компонента
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router, callback]);

    // Возвращаем ref для использования в компоненте
    return ref;
}