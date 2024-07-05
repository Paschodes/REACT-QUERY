import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";
import { useInfiniteQuery } from "@tanstack/react-query";

const baseUrl = "https://swapi-node.vercel.app";
const initialUrl = baseUrl + "/api/people";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } = useInfiniteQuery({
    queryKey: ["sw-people"],
    queryFn: ({pageParam = initialUrl}) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next ? baseUrl + lastPage.next : undefined;
    },
  });

  if (isLoading) {
    return <div className="loading">Loading o...</div>
  }
  if (isError) {
    return <div>Error o! {Error.toString()}</div>
  }

  return (
    <>
    {/* //to indicate to de user dat more data is loading as dey scroll towards de page end */}
    {isFetching && <div className="loading">chill...loading...</div>}   
    
    <InfiniteScroll initialLoad={false} loadMore={() => {
      if (!isFetching) {
        fetchNextPage()
      }
    }} hasMore={hasNextPage}>
      {data.pages.map((pageData) => {
        return pageData.results.map((person) => {
          return (
            <Person key={person.fields.name} name={person.fields.name} hairColor={person.fields.hair_color} eyeColor={person.fields.eye_color}/>
          );
        });
      })}
    </InfiniteScroll>
    </>
  );
}
