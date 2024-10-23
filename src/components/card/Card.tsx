import maleLogo from "@/assets/male.svg";
import { Product } from "@/hooks/queries/useProducts";

type CardProps = Product;

function Card({ birthday, title, displayPrice, source }: CardProps) {
  return (
    <article className="flex flex-col gap-2 border rounded-xl border-gray-500">
      <div className="flex flex-col gap-2 items-center">
        <img
          className="rounded-t-xl"
          src="https://chinchillagallery.royalchinchilla.com/wp-content/uploads/2024/10/IMG_2907.jpeg"
          width="719"
          height="719"
          alt={title}
        />
        <div className="flex gap-2 p-2 items-center">
          <img src={maleLogo} className="h-4 w-4" height={16} width={16} alt="Male logo" />
          <h4 className="text-base font-bold">{title}</h4>
        </div>
        <div className="flex gap-2 justify-center items-center m-2">
          <span className="text-base">{birthday}</span>
          <span className="text-base">{displayPrice}</span>
          <span className="text-base">{source}</span>
        </div>
      </div>
    </article>
  );
}

export default Card;
