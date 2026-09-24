'use client';
import {useEffect,useState,useCallback} from 'react';
import {useParams} from 'next/navigation';
import {supabase,useUser,anilist,name} from '../../../lib';
import Card from '../../../components/Card';
const Q=`query($id:Int){Media(id:$id,type:ANIME){id title{romaji english}coverImage{large}description seasonYear episodes}}`;
export default function Anime(){const {id}=useParams();const u=useUser();const [a,setA]=useState(null);const [logs,setLogs]=useState([]);const [msg,setMsg]=useState('');
const load=useCallback(async()=>{const {data}=await supabase.from('logs').select('*,profiles(username),likes(user_id)').eq('anime_id',id).order('created_at',{ascending:false});setLogs(data||[])},[id]);
useEffect(()=>{anilist(Q,{id:+id}).then(d=>setA(d.Media));load()},[id,load]);
const mine=logs.find(l=>l.user_id===u?.id);
async function save(e){e.preventDefault();const f=new FormData(e.target);const {error}=await supabase.from('logs').upsert({user_id:u.id,anime_id:+id,title:name(a.title),cover:a.coverImage.large,rating:+f.get('rating'),review:f.get('review')},{onConflict:'user_id,anime_id'});setMsg(error?error.message:'Saved to your diary.');load()}
if(!a)return <p>Loading…</p>;
return <><div className="card"><img src={a.coverImage.large} alt="" style={{width:120,height:180}}/><div><h1 style={{margin:0}}>{name(a.title)}</h1><small>{a.seasonYear}, {a.episodes||'?'} episodes</small><p>{(a.description||'').replace(/<[^>]+>/g,'')}</p></div></div>
{u?<form className="stack" onSubmit={save} key={mine?.id||'new'}><h2>{mine?'Update your log':'Log this anime'}</h2><select name="rating" defaultValue={mine?.rating||4} aria-label="Rating">{[1,2,3,4,5,6,7,8,9,10].map(i=><option key={i} value={i/2}>{i/2} stars</option>)}</select><textarea name="review" rows={4} placeholder="What did you think?" defaultValue={mine?.review||''}/><button>Save</button>{msg&&<p>{msg}</p>}</form>:<p><a href="/login"><b>Log in</b></a> to log this anime.</p>}
<h2>Reviews</h2>{logs.length?logs.map(l=><Card key={l.id} log={l} me={u} onChange={load}/>):<p>No reviews yet. Be the first.</p>}</>}
