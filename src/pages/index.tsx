// import reactLogo from '../assets/react.svg'
// import viteLogo from '/vite.svg'
import "../App.css";
import { useProducts } from "@/hooks/queries/useProducts";
import { Card } from "@/components/card";

function Home() {
  const { data } = useProducts();

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">CHA-LA-CHIN-CHI-LA</h2>
      <ul className="grid gap-3">
        {data?.map(({ id, ...rest }) => (
          <li key={id}>
            <Card id={id} {...rest} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Home;
