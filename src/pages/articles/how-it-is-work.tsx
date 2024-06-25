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
                    <h1>How does it work?</h1>
                    <div>
                        <h3>Wallet Installation</h3>
                        <p>
                            <a href="https://ton.org/ru/wallets?locale=ru&pagination[limit]=-1">Download and install</a> the mobile wallet. Log into the app and follow the instructions. 
                            Make sure to save the 24-word seed phrase in a safe place and do not share it with anyone — if you lose the seed phrase, you won&rsquo;t be able to recover your wallet.
                        </p>
                        <h3>Top-up Balance</h3>
                        <p>
                            <a href="https://ton.org/ru/buy-toncoin?filters[exchange_groups][slug][$eq]=buy-with-card&pagination[page]=1&pagination[pageSize]=100">Top up your wallet</a> using a bank card or exchange from another cryptocurrency.
                        </p>
                        <h3>Sending a Donation</h3>
                        <p>
                            Go to the donation page, select the amount, and write a message to send.
                            <br/>Click &quot;Send Donation&quot; and confirm the transaction in the wallet.
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Page;
