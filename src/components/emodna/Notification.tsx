interface NotificationProps {
  message: string;
  icon: string;
}

export default function Notification({ message, icon }: NotificationProps) {
  return (
    <div className="fixed bottom-[30px] right-[30px] z-[300] bg-card rounded-2xl py-4 px-6 shadow-elevated border-l-4 border-l-primary flex items-center gap-3 animate-slide-in-right max-w-[320px]">
      <span className="text-[1.3rem]">{icon}</span>
      <span className="text-[0.85rem] font-semibold text-dark">{message}</span>
    </div>
  );
}
