// import reactLogo from '../assets/react.svg'
// import viteLogo from '/vite.svg'
import "../App.css";
import { useProducts } from "@/hooks/queries/useProducts";
import { Card } from "@/components/card";
import InfiniteScroll from "react-infinite-scroll-component";
import { Bars } from "@/components/loader/bars";
import { useParams } from "react-router-dom";

function Shop() {
  const { slug } = useParams();
  const { data, isFetching, hasNextPage, fetchNextPage } = useProducts();
  // useQuery({
  //   queryKey: ["ad"],
  //   queryFn: ({ signal }) => axios.get("/api/v1/health", { signal }),
  // });
  // console.log("safd", lll);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">CHA-LA-CHIN-CHI-LA</h2>
      <Bars show={isFetching} />
      {/* https://builtin.com/articles/react-infinite-scroll */}
      <InfiniteScroll
        dataLength={data?.length || 0}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<h4>Loading...</h4>}
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map(({ id, ...rest }) => (
            <li key={id} className="sm:flex">
              <Card id={id} {...rest} />
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </section>
  );
}

export default Shop;
