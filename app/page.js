'use client';
import {useEffect,useState,useCallback} from 'react';
import Link from 'next/link';
import {supabase,useUser} from '../lib';
import Card from '../components/Card';
export default function Home(){const u=useUser();const [logs,setLogs]=useState(null);const [mine,setMine]=useState(false);
const load=useCallback(async()=>{if(u===undefined)return;let ids=[];if(u){const {data}=await supabase.from('follows').select('following').eq('follower',u.id);ids=(data||[]).map(f=>f.following)}
let q=supabase.from('logs').select('*,profiles(username),likes(user_id)').order('created_at',{ascending:false}).limit(30);if(ids.length)q=q.in('user_id',ids);setMine(ids.length>0);const {data}=await q;setLogs(data||[])},[u]);
useEffect(()=>{load()},[load]);
return <>{!u&&<section className="hero"><h1>A home for anime lovers.</h1><p>Log what you watch, write what you think, and follow friends to see their latest cours.</p><Link href="/login"><button>Join cour</button></Link></section>}
<h2>{mine?'From people you follow':'Latest reviews'}</h2>
{logs===null?<p>Loading…</p>:logs.length===0?<p>Nothing here yet. Search for an anime and be the first to log it.</p>:logs.map(l=><Card key={l.id} log={l} me={u} onChange={load}/>)}</>}
