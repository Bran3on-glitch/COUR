'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {supabase,useUser} from '../lib';
export default function Nav(){const u=useUser();const [me,setMe]=useState(null);
useEffect(()=>{if(u)supabase.from('profiles').select('username').eq('id',u.id).single().then(({data})=>setMe(data?.username));else setMe(null)},[u]);
return <nav><Link href="/"><b><img src="/logo.svg" alt=""/>cour</b></Link>
<form action="/search"><input name="q" placeholder="Search anime" aria-label="Search anime" style={{width:'100%'}}/></form>
{me?<><Link href={`/u/${me}`}>@{me}</Link><button className="ghost" style={{color:'#fff',borderColor:'#fff'}} onClick={async()=>{await supabase.auth.signOut();location.href='/'}}>Log out</button></>:u===null&&<Link href="/login">Log in</Link>}</nav>}
