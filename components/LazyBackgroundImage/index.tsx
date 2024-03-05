import React from "react";

type Props = {
  img: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export default function LazyBackgroundImage({ img, children, style }: Props) {
  return (
    <div
      style={{          
        backgroundImage: `url(${img})`,
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    >
      <div>{children}</div>
    </div>
  );
}