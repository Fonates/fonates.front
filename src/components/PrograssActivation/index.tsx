import { Fragment } from "react";
import { Wrapper } from "../Wrapper";

import IconCheckmarkCircle from '@/assets/icons/checkmark.circle.svg';
import IconCircle from '@/assets/icons/circle.svg';

import styles from './styles.module.css';
import { CopyField } from "@/Form/CopyField";

export enum LinkActivationStatus {
    default = 'default',
    generated = 'generated',
    integration = 'integration',
    active = 'active',
}

interface IStep {
    title: string;
    subtitle: string;
    status: LinkActivationStatus;
};

const STEPS: IStep[] = [
    {
        title: 'Генерация ссылки',
        subtitle: 'Для создания ссылки оплаты подключите кошелёк, заполните форму и нажмите по кнопке «Генерировать ссылку»',
        status: LinkActivationStatus.default,
    },
    // {
    //     title: 'Генерация завершена',
    //     subtitle: 'Дождитесь получения уникальной ссылки, скопируйте её и опубликуйте в социальных сетях',
    //     status: LinkActivationStatus.generated,
    // },
    {
        title: 'Интеграция в OBS Studio',
        subtitle: 'Скопируйте и вставьте полученную ссылку в источник «Браузер» вашего OBS для активации окна оплаты',
        status: LinkActivationStatus.integration,
    },
    {
        title: 'Активация',
        subtitle: 'Теперь вы можете делиться ссылкой и получать пожертвования',
        status: LinkActivationStatus.active
    },
];

const ItemProgress = ({ isActive, isLine, index }: { isActive?: boolean; isLine?: boolean; index?: number }) => {
    return (
        <Fragment>
            <div className={`${styles.wpProgress} ${isActive ? styles.active : ''}`}>
                {isActive ? (
                    <IconCheckmarkCircle />
                ) : (
                    <Fragment>
                        <IconCircle />
                        <span className={styles.index}>{index}</span>
                    </Fragment>
                )}
            </div>
            {!isLine && (
                <div className={`${styles.line} ${isActive ? styles.activeLine : ''}`} />
            )}
        </Fragment>
    )
}

const Progress = (props: { info: IStep }) => {
    return (
        <div className={styles.progress}>
            {props.info.status === LinkActivationStatus.default && (
               <Fragment>
                    {STEPS.map((step, index) => {
                        return (
                            <ItemProgress 
                                key={`item-progress-${index}`} 
                                isLine={STEPS.length - 1 == index}
                                index={index+1}
                            />
                        )
                    })}
               </Fragment>
            )}
            {props.info.status === LinkActivationStatus.generated && (
               <Fragment>
                    {STEPS.map((step, index) => {
                        return (
                            <ItemProgress 
                                key={`item-progress-${index}`}
                                isLine={STEPS.length - 1 == index} 
                                isActive={index < 1}
                                index={index+1}
                            />
                        )
                    })}
               </Fragment>
            )}
            {props.info.status === LinkActivationStatus.integration && (
               <Fragment>
                    {STEPS.map((step, index) => {
                        return (
                            <ItemProgress 
                                key={`item-progress-${index}`}
                                isActive={index < 1}
                                isLine={STEPS.length - 1 == index} 
                                index={index+1}
                            />
                        )
                    })}
               </Fragment>
            )}
            {props.info.status === LinkActivationStatus.active && (
               <Fragment>
                    {STEPS.map((step, index) => {
                        return (
                            <ItemProgress 
                                key={`item-progress-${index}`} 
                                isActive 
                                isLine={STEPS.length - 1 == index} 
                                index={index+1}
                            />
                        )
                    })}
               </Fragment>
            )}
        </div>
    )
}

interface IProgressActivation {
    status: LinkActivationStatus;
    linkId: string;
};

export const ProgressActivation: React.FC<IProgressActivation> = (props) => {
    const { status } = props;
    const info = STEPS.find(step => step.status === status);

    if (!info) {
        return null;
    }

    const pluginUrl = `https://fonates.com/plugins/${props.linkId}/alert`;

    return (
        <Wrapper>
            <Progress info={info} />
            <div className={styles.wpInfo}>
                <h2>{info?.title}</h2>
                <p>{info?.subtitle}</p>
                {status == LinkActivationStatus.integration && (
                    <CopyField value={pluginUrl} className={styles.copyAlertPlagin} />
                )}
            </div>
        </Wrapper>
    )
};