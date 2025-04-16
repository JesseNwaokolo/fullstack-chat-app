
import ChatContainer from "../components/my/ChatContainer";
import NoChatSelcted from "../components/my/NoChatSelcted";
import Sidebar from "../components/my/Sidebar";
import { useChatStore } from "../store/useChatStore";


function HomePage() {
  const { selectedUser } = useChatStore();
  


  return (
    <div className="bg-primary-foreground min-h-screen text-seconadry-foreground">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className=" shadow-2xl rounded-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">

            <Sidebar />

            {
              !selectedUser ? <NoChatSelcted /> : <ChatContainer />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
