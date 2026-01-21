
import React, { useState, useEffect, useRef } from 'react';
import { Chat, ChatMessage, UserRole } from '../types';

interface ChatSystemProps {
  currentUserId: string;
  role: UserRole;
  chats: Chat[];
  onSendMessage: (chatId: string, text: string) => void;
  onFinalizeSale: (chatId: string) => void;
  onClose: () => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ currentUserId, role, chats, onSendMessage, onFinalizeSale, onClose }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(chats[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const otherParticipant = activeChat?.participants.find(p => p.id !== currentUserId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeChatId) return;
    onSendMessage(activeChatId, inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[80vh] rounded-[2.5rem] shadow-2xl flex overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300">
        
        {/* Sidebar */}
        <div className="w-full sm:w-80 border-r dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-900/50">
          <div className="p-6 border-b dark:border-slate-800">
            <h3 className="font-black text-xl tracking-tighter uppercase">Messages</h3>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
            {chats.map(chat => {
              const other = chat.participants.find(p => p.id !== currentUserId);
              return (
                <button 
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeChatId === chat.id ? 'bg-white dark:bg-slate-800 shadow-md ring-1 ring-togo-green/20' : 'hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center bg-slate-200 dark:bg-slate-800 shrink-0">
                    {other?.avatar ? <img src={other.avatar} className="w-full h-full object-cover" /> : <span className="text-xl">👤</span>}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="font-black text-sm truncate">{other?.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{other?.role}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{chat.messages[chat.messages.length - 1]?.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden sm:flex flex-1 flex-col bg-white dark:bg-slate-900">
          {activeChat ? (
            <>
              <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
                    {otherParticipant?.avatar ? <img src={otherParticipant.avatar} className="w-full h-full object-cover" /> : <span>👤</span>}
                  </div>
                  <div>
                    <h4 className="font-black text-lg leading-none">{otherParticipant?.name}</h4>
                    <p className="text-[10px] text-togo-green font-black uppercase mt-1">En ligne</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {role === 'seller' && activeChat.relatedProductId && (
                    <button 
                      onClick={() => onFinalizeSale(activeChat.id)}
                      className="bg-togo-yellow text-togo-green px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                    >
                      Générer Commande 📄
                    </button>
                  )}
                  <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-xl">&times;</button>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {activeChat.messages.map(msg => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-4 rounded-[1.5rem] shadow-sm ${isMe ? 'bg-togo-green text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'}`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                        <p className={`text-[9px] mt-1 font-bold uppercase ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex gap-4">
                  <input 
                    type="text"
                    placeholder="Écrivez votre message..."
                    className="flex-1 bg-white dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-togo-green outline-none shadow-inner"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={handleSend}
                    className="w-14 h-14 bg-togo-green text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
               <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl">💬</div>
               <h3 className="text-2xl font-black">Lumina Chat</h3>
               <p className="text-slate-500 max-w-sm">Sélectionnez une conversation pour commencer à discuter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
