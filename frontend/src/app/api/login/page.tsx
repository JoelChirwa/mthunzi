"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage(){

const[email,setEmail]=useState("");
const[password,setPassword]=useState("");

async function handleLogin(){

await signIn(

"credentials",

{

email,
password,

redirect:true,

callbackUrl:"/admin"

}

);

}

return(

<div className="h-screen flex justify-center items-center">

<div className="w-[400px] space-y-4 border p-8 rounded-xl">

<h1 className="text-2xl font-bold">

Mthunzi Admin Login

</h1>

<Input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<Input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<Button
className="w-full"
onClick={handleLogin}
>

Login

</Button>

</div>

</div>

)

}