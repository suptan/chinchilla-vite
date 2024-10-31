import MaleLogo from "@/assets/male.svg";
import FemaleLogo from "@/assets/female.svg";
import { Product } from "@/hooks/queries/useProducts";
import { useState } from "react";

type CardProps = Product;

function Card({ album, birthday, displayPrice, gender, title, source }: CardProps) {
  const genderLogo = gender === "男の子" ? MaleLogo : FemaleLogo;
  const enGender = gender === "男の子" ? "male" : "female";
  const [mainImg, setMainImg] = useState<string | undefined>(album[0].src);

  const handleGalleryClick = (i: number) => () => {
    setMainImg(album[i].src);
  };

  return (
    <article className="flex flex-col gap-2 border rounded-xl border-gray-500">
      <div className="flex flex-col gap-2 items-center">
        {album.length > 0 && (
          <div className="flex flex-col gap-2 overflow-hidden">
            <img className="rounded-t-xl" src={mainImg} width="719" height="719" alt={title} />
            <figure className="flex gap-2 flex-1 overflow-x-auto">
              {album.map(({ src }, i) => (
                <img
                  key={`gallery-${i}`}
                  className="w-1/4"
                  src={src}
                  alt={title}
                  onClick={handleGalleryClick(i)}
                />
              ))}
            </figure>
          </div>
        )}
        <div className="flex gap-2 p-2 items-center">
          <img
            src={genderLogo}
            className="h-4 w-4"
            height={16}
            width={16}
            alt={`${gender} ${enGender} logo"`}
          />
          <h4 className="text-base font-bold">{title}</h4>
        </div>
        <div className="flex gap-2 justify-center items-center m-2 text-base">
          <span aria-label="birthday">
            🎂
            <br />
            {birthday}
          </span>
          <span aria-label="price">
            💰
            <br />
            {displayPrice}
          </span>
          <span aria-label="shop">
            🛒
            <br />
            {source}
          </span>
        </div>
      </div>
    </article>
  );
}

export default Card;
