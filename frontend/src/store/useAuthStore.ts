interface AuthStore {
  authUser: {
    _id: string;
    email: string;
    fullName: string;
    profilePic: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>; // Async function
  isSigningUp: boolean;
  signUp: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;

  logout: () => Promise<void>;

  login: (data: { email: string; password: string }) => Promise<void>;

  isLoggingIn: boolean;

  socket : Socket | null

  isUpdatingProfile: boolean;


  connectSocket: () => void;
  disconnectSocket: () => void;
  onlineUsers : string[]

  updateProfile: (data: { profilePic: string | null }) => Promise<void>;
}

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const baseUrl = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("res", res);

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("error in check", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message);
        }
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) toast.error(error.response.data.message);
      } else {
        toast.error("Issue with Logout");
      }
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) toast.error(error.response.data.message);
      } else {
        toast.error("Issue with Login");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) toast.error(error.response.data.message);
      } else {
        toast.error("Issue with image upload");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(baseUrl, {
      query : {
        userId : authUser._id
      }
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers : userIds})
    })
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
