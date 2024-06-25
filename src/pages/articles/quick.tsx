import { Wrapper } from "@/components/Wrapper";
import Image from "next/image";
import { Fragment } from "react";

const Page = () => {
    return (
        <Fragment>
            <div className="article">
                <Wrapper cs={"aritces__img"}>
                    <Image src={'/quick_img2.jpg'} width={640} height={360} alt={'quick_img.jpg'} />
                </Wrapper>
                <div className="article__texts">
                    <h1>For viewers</h1>
                    <div>
                        <h3>Wallet installation</h3>
                        <p>
                            <a href="https://ton.org/ru/wallets?locale=ru&pagination[limit]=-1">Download and install</a> the mobile version of the wallet. Log into the app and follow the instructions.
                            Make sure to save the 24-word seed phrase in a safe place and do not share it with anyone — if you lose the seed phrase, you won&apos;t be able to recover your wallet.
                        </p>
                        <h3>Top-up balance</h3>
                        <p>
                            <a href="https://ton.org/ru/buy-toncoin?filters[exchange_groups][slug][$eq]=buy-with-card&pagination[page]=1&pagination[pageSize]=100">Top up your wallet</a> using a bank card or exchange from another cryptocurrency.
                        </p>
                        <h3>Sending a donation</h3>
                        <p>
                            Log in using one of the offered wallets. Go to the donation page, select the amount, and write a message to send. Click &ldquo;Send donation&ldquo; and confirm the transaction in the wallet.
                        </p>
                    </div>
                </div>
            </div>
            <br />
            <div className="article">
                <div className="article__texts">
                    <h1>For streamers</h1>
                    <div>
                        <h3>Wallet installation</h3>
                        <p>
                            <a href="https://ton.org/ru/wallets?locale=ru&pagination[limit]=-1">Download and install</a> the mobile version of the wallet. Log into the app and follow the instructions.
                            Make sure to save the 24-word seed phrase in a safe place and do not share it with anyone — if you lose the seed phrase, you won't be able to recover your wallet.
                        </p>
                        <h3>Authorization</h3>
                        <p>
                            To start receiving donations, go to the &quot;Constructor&quot; and log in using your TON wallet.
                        </p>
                        <h3>Generating a link</h3>
                        <p>
                            Click &quot;Generate link&quot; to get a unique donation link.
                        </p>
                        <h3>Activating the link</h3>
                        <p>
                            Activate your unique link through OBS: paste the link into the &quot;Browser&quot; source.
                        </p>
                        <h3>Sharing the link</h3>
                        <p>
                            Congratulations! Your link is created and activated, now you can share it, for example, add it to the description of your Twitch channel and receive donations.
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Page;
