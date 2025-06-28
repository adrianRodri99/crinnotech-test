import { Post } from "@/app/types/post";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostsState {
  posts: Post[];
  selectedPost: Post | null;
}

const initialState: PostsState = {
  posts: [],
  selectedPost: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      state.posts = state.posts.map(
        (p: Post): Post => (p.id === action.payload.id ? action.payload : p)
      );
    },
    deletePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts.filter((p: Post) => p.id !== action.payload);
    },
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },
  },
});

export const { setPosts, addPost, updatePost, deletePost, setSelectedPost } =
  postsSlice.actions;

export default postsSlice.reducer;
