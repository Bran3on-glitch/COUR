'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {supabase,useUser} from '../lib';
export default function Nav(){const u=useUser();const [me,setMe]=useState(null);
useEffect(()=>{if(!u){setMe(null);return}
(async()=>{let {data}=await supabase.from('profiles').select('username').eq('id',u.id).maybeSingle();
if(!data){const base=String(u.user_metadata?.username||u.email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,12).padEnd(3,'x');
for(const name of [base,base+Math.floor(1000+Math.random()*9000)]){const r=await supabase.from('profiles').insert({id:u.id,username:name}).select('username').maybeSingle();if(r.data){data=r.data;break}}}
setMe(data?.username||null)})()},[u]);
return <nav><style>{`nav{flex-wrap:wrap}.links{display:flex;gap:16px;align-items:center}.links a{padding:4px 0;border-bottom:2px solid transparent}.links a:hover{border-color:#F5B841}nav form{min-width:160px}`}</style>
<Link href="/"><b><img src="/logo.svg" alt=""/>cour</b></Link>
<div className="links"><Link href="/">Home</Link><Link href="/search">Search</Link>{me&&<><a href={`/u/${me}`}>Profile</a><a href={`/u/${me}?tab=diary`}>Diary</a></>}</div>
<form action="/search"><input name="q" placeholder="Search anime" aria-label="Search anime" style={{width:'100%'}}/></form>
{u?<button className="ghost" style={{color:'#fff',borderColor:'#fff'}} onClick={async()=>{await supabase.auth.signOut();location.href='/'}}>Log out</button>:u===null&&<Link href="/login"><button>Log in</button></Link>}</nav>}
