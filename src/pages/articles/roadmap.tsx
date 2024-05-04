import { Wrapper } from "@/components/Wrapper";
import Image from "next/image";
import { Fragment } from "react";

const Page = () => {
    return (
        <Fragment>
            <div className="article">
                <Wrapper cs={"aritces__img"}>
                    <Image src={'/roadmap_img.jpg'} width={640} height={360} alt={'quick_img.jpg'} />
                </Wrapper>
                <div className="article__texts">
                    <h1>Roadmap</h1>
                    <div>
                        <Image src={'/roadmap.svg'} width={640} height={360} alt={'roadmap.jpg'} />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Page;