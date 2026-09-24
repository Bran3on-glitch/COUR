'use client';
import {useEffect,useState,useCallback} from 'react';
import {useParams} from 'next/navigation';
import {supabase,useUser} from '../../../lib';
import Card from '../../../components/Card';
export default function Profile(){const {username}=useParams();const u=useUser();const [p,setP]=useState(undefined);const [logs,setLogs]=useState([]);const [fol,setFol]=useState(false);const [n,setN]=useState([0,0]);
const load=useCallback(async()=>{const {data:pr}=await supabase.from('profiles').select('*').eq('username',username).maybeSingle();setP(pr);if(!pr)return;
const {data}=await supabase.from('logs').select('*,profiles(username),likes(user_id)').eq('user_id',pr.id).order('created_at',{ascending:false});setLogs(data||[]);
const a=await supabase.from('follows').select('*',{count:'exact',head:true}).eq('following',pr.id);const b=await supabase.from('follows').select('*',{count:'exact',head:true}).eq('follower',pr.id);setN([a.count||0,b.count||0]);
if(u){const {data:f}=await supabase.from('follows').select('follower').match({follower:u.id,following:pr.id});setFol(f?.length>0)}},[username,u]);
useEffect(()=>{load()},[load]);
async function toggle(){if(!u){location.href='/login';return}const k={follower:u.id,following:p.id};fol?await supabase.from('follows').delete().match(k):await supabase.from('follows').insert(k);load()}
if(p===undefined)return <p>Loading…</p>;if(!p)return <p>No one here by that username.</p>;
return <><div className="row"><h1 style={{margin:0}}>@{p.username}</h1>{u&&u.id!==p.id&&<button className={fol?'ghost':''} onClick={toggle}>{fol?'Following':'Follow'}</button>}</div><p>{logs.length} logged, {n[0]} followers, {n[1]} following</p>
{logs.length?<div className="grid">{logs.map(l=><a key={l.id} href={`/anime/${l.anime_id}`}><img src={l.cover} alt=""/><b>{l.title}</b><small className="stars">{'★'.repeat(Math.floor(l.rating))}{l.rating%1?'½':''}</small></a>)}</div>:<p>Nothing logged yet.</p>}
<h2>Reviews</h2>{logs.filter(l=>l.review).map(l=><Card key={l.id} log={l} me={u} onChange={load}/>)}</>}
