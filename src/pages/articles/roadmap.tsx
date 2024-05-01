import { Wrapper } from "@/components/Wrapper";
import Image from "next/image";
import { Fragment } from "react";

const Page = () => {
    return (
        <Fragment>
            {/* <video width="100%" src="https://media.theoceanic.io/fonates/media/TON%20Fonates%20Donation.mp4" autoPlay controls style={{ objectFit: 'cover' }}/> */}
            <div className="article">
                <Wrapper cs={"aritces__img"}>
                    <Image src={'/roadmap_img.jpg'} width={640} height={360} alt={'quick_img.jpg'} />
                </Wrapper>
                <h1>Roadmap</h1>
                <div>
                    <Image src={'/roadmap.svg'} width={640} height={360} alt={'roadmap.jpg'} />
                </div>
            </div>
        </Fragment>
    )
}

export default Page;