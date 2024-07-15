"use client";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session } = useSession();

  return (
    <div className="m-2 border rounded shadow">
      <div className="p-2 bg-gradient-to-b from-white to-slate-200 text-slate-600 text-center">
        Profile
      </div>

      <div className="grid grid-cols-2 p-2 gap-2">
        <p className="p-2 text-slate-400">Name:</p>
        <p className="p-2 text-slate-950">{session?.user.name}</p>
        <p className="p-2 text-slate-400">Email:</p>
        <p className="p-2 text-slate-950">{session?.user.email}</p>
        <p className="p-2 text-slate-400">Access Token:</p>
        <p className="p-2 text-slate-950 break-words">
          {session?.backendTokens.accessToken}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
