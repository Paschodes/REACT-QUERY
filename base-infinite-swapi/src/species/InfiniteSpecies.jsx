import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const baseUrl = "https://swapi-node.vercel.app";
const initialUrl = baseUrl + "/api/species";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query
  const {data, fetchNextPage, hasNextPage, isFetching, isLoading, isError} = useInfiniteQuery({
    queryKey: ["sw-people"],
    queryFn: ({pageParam = initialUrl}) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next ? baseUrl + lastPage.next : undefined;
    },
  });

  if (isLoading) {
    return <div className="loading">Loading eeh...</div>
  }

  if (isError) {
    return <div className="loading">Error eeh...{Error.toString()}</div>
  }

  return (
    <>
    {isFetching && <div className="loading">tuning in...</div>}
      <InfiniteScroll initialLoad={false} hasMore={hasNextPage} loadMore={() => {
        if (!isFetching) {
          fetchNextPage()
        }
      }}>
        {data.pages.map((pageData) => {
          return pageData.results.map((specie) => {
            return (
              <Species key={specie.fields.name} name={specie.fields.name} hairColor={specie.fields.hair_colors} eyeColor={specie.fields.eye_colors}/>
            )
          })
        })}
      </InfiniteScroll>
    </>
  );
}
