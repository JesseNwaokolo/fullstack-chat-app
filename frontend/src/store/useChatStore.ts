import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

type ChatProps = {
  users: {
    _id: string;
    email: string;
    fullName: string;
    profilePic: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  }[];
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string | undefined) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  sendMessage : (data: { text?: string; image?: string | null })=>Promise<void>
  selectedUser: {
    _id: string;
    email: string;
    fullName: string;
    profilePic: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  } | null;

  setSelectedUser: (user: SelectedUserProps) => void;

  theme: "dark" | "light";
  setTheme: (data: "dark" | "light") => void;

  // getMessages : (id:string)=> Promise<>
  messages:
    | {
        senderId: string;
        receiverId: string;
        text?: string;
        image?: string;
        _id: string;
        createdAt: string;
      }[]
    | [];
};

type SelectedUserProps = {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
} | null;

export const useChatStore = create<ChatProps>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  theme: "light",

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message);
        }
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message);
        }
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket?.on(
      "newMessage",
      (data: {
        senderId: string;
        receiverId: string;
        text?: string;
        image?: string;
        _id: string;
        createdAt: string;
      }) => {
        if (data.senderId !== selectedUser._id) return;
        set({ messages: [...get().messages, data] });
      }
    );
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  setSelectedUser: (selectedUser: SelectedUserProps) => set({ selectedUser }),

  sendMessage: async (data) => {
    const { messages, selectedUser } = get();

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser?._id}`,
        data
      );
      set({ messages: [...messages, res.data] });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) toast.error(error.response.data.message);
        console.log(error);
      }
    }
  },

  setTheme: (data) => {
    set({ theme: data });
  },
}));
