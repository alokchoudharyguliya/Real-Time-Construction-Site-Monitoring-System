"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';

type Contractor = { id: string | number; name: string; avatar?: string };
type Message = { id: string; fromMe: boolean; text: string; time: string };

const sampleContractors: Contractor[] = [
  { id: '1', name: 'ABC Constructions' },
  { id: '2', name: 'BuildRight Pvt Ltd' },
  { id: '3', name: 'Skyline Contractors' },
];

const sampleMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', fromMe: false, text: 'Hello, interested in discussing Site A timeline.', time: '10:02 AM' },
    { id: 'm2', fromMe: true, text: 'Sure — what are the current blockers?', time: '10:04 AM' },
  ],
  '2': [
    { id: 'm3', fromMe: false, text: 'Can you share resource availability?', time: '9:15 AM' },
  ],
  '3': [
    { id: 'm4', fromMe: true, text: 'We finished the last milestone.', time: 'Yesterday' },
  ],
};

export default function ChatPage() {
  const router = useRouter();
  const params = useSearchParams();
  const partner = params?.get('partner') || sampleContractors[0].id.toString();

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => sampleMessages[partner] ?? []);

  const partnerInfo = useMemo(() => sampleContractors.find((c) => String(c.id) === String(partner)) || sampleContractors[0], [partner]);

  const send = () => {
    if (!messageText.trim()) return;
    const m: Message = { id: String(Date.now()), fromMe: true, text: messageText.trim(), time: 'Now' };
    setMessages((s) => [...s, m]);
    setMessageText('');
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Chat with {partnerInfo.name}</h1>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Contractors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleContractors.map((c) => (
                    <div key={c.id} className={`p-2 rounded cursor-pointer ${String(c.id) === String(partner) ? 'bg-gray-100 dark:bg-gray-800' : ''}`} onClick={() => router.push(`/chat?partner=${c.id}`)}>
                      <div className="font-medium">{c.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-2">
            <Card className="h-[60vh] flex flex-col">
              <CardHeader>
                <CardTitle>{partnerInfo.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`max-w-lg ${m.fromMe ? 'ml-auto text-right' : ''}`}>
                    <div className={`inline-block px-3 py-2 rounded ${m.fromMe ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'}`}>
                      {m.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{m.time}</div>
                  </div>
                ))}
              </CardContent>

              <div className="p-4 border-t dark:border-t-gray-800">
                <div className="flex gap-2">
                  <Input value={messageText} onChange={(e) => setMessageText((e.target as HTMLInputElement).value)} placeholder="Type a message" />
                  <Button onClick={send}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
