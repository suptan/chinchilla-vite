import MaleLogo from "@/assets/male.svg";
import FemaleLogo from "@/assets/female.svg";
import { Product } from "@/hooks/queries/useProducts";

type CardProps = Product;

function Card({ album, birthday, displayPrice, gender, title, source }: CardProps) {
  const genderLogo = gender === "男の子" ? MaleLogo : FemaleLogo;
  const enGender = gender === "男の子" ? "male" : "female";

  return (
    <article className="flex flex-col gap-2 border rounded-xl border-gray-500">
      <div className="flex flex-col gap-2 items-center">
        {album.length > 0 && (
          <img className="rounded-t-xl" src={album[0].src} width="719" height="719" alt={title} />
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
          <span aria-label="birthday">🎂 {birthday}</span>
          <span aria-label="price">💰 {displayPrice}</span>
          <span aria-label="shop">🛒 {source}</span>
        </div>
      </div>
    </article>
  );
}

export default Card;
