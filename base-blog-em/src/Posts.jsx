import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  //delete mutation
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });
  //update mutation
  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId)
  })

  //using useEffect to aid change in the current page ("Dis is for isFetching")
  useEffect(() => {
    //using de IF statemnt first to put a restriction so we dont fetch data beyond wat we know is there
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage])


  // replace with useQuery      //destructuring de data property returned from useQuery
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts", currentPage],         //when de query key changes
    queryFn: () => fetchPosts(currentPage),   //it have to alert useQuery dat dere is a new query nd de data has to be refreshed
    staleTime: 2000,   //2secs
  });  
  // if ( !data ) { return <div />} //if dere is no data, return an empty div 
  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (isError) {
    return <div>
      <h3>Something went wrong... oops</h3> 
      <p>{error.toString()}</p>
    </div>
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li key={post.id} className="post-title"
            onClick={() => {deleteMutation.reset(); updateMutation.reset(); setSelectedPost(post);}}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <=1 }  //if you are in the home or first page disable previous page
         onClick={() => {setCurrentPage((previousValue) => previousValue - 1)}}>    
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage}
         onClick={() => {setCurrentPage((previousValue) => previousValue + 1)}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} deleteMutation={deleteMutation} updateMutation={updateMutation}/>}
    </>
  );
}
