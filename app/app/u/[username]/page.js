'use client';
import {useEffect,useState,useCallback} from 'react';
import {useParams} from 'next/navigation';
import {supabase,useUser} from '../../../lib';
import Card from '../../../components/Card';
const S=r=>'★'.repeat(Math.floor(r))+(r%1?'½':'');
const CSS=`.ph{background:var(--navy);color:#fff;border-radius:16px;padding:20px;display:flex;flex-wrap:wrap;gap:16px;align-items:center}
.av{width:84px;height:84px;border-radius:50%;background:#F5B841;color:#17287A;display:grid;place-items:center;font-size:38px;font-weight:700}
.who{flex:1;min-width:160px}.who h1{margin:0}.who small{opacity:.7}
.ph button{background:#F5B841;color:#17287A;font-weight:600}.ph button.ghost{background:none;color:#fff;border:1px solid #fff}
.stats{list-style:none;display:flex;gap:28px;margin:8px 0 0;padding:16px 0 0;border-top:1px solid #ffffff33;width:100%}.stats li{display:grid;font-size:13px}.stats b{font-size:26px}
.tabs{display:flex;gap:20px;margin:20px 0 8px;border-bottom:1px solid #dde3f7}.tabs button{background:none;color:var(--mute);padding:8px 0;border-radius:0;border-bottom:3px solid transparent}.tabs button.on{color:var(--ink);border-color:var(--amber);font-weight:600}
.strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px}.strip img{width:100%;aspect-ratio:2/3;object-fit:cover;border-radius:6px}.strip small{display:block;text-align:center}
.mo{margin:20px 0 4px;color:var(--mute)}.dia{width:100%;border-collapse:collapse}.dia td{padding:8px 6px;border-bottom:1px solid #dde3f7;vertical-align:middle}.dia img{width:40px;height:60px;object-fit:cover;border-radius:4px;display:block}.dia .d{width:32px;font-size:20px;color:var(--mute)}.dia .x{background:none;color:var(--mute);padding:4px}`;
export default function Profile(){const {username}=useParams();const u=useUser();
const [p,setP]=useState(undefined),[logs,setLogs]=useState([]),[fol,setFol]=useState(false),[n,setN]=useState([0,0]),[tab,setTab]=useState('profile');
useEffect(()=>{setTab(new URLSearchParams(location.search).get('tab')||'profile')},[]);
const load=useCallback(async()=>{const {data:pr}=await supabase.from('profiles').select('*').eq('username',username).maybeSingle();setP(pr);if(!pr)return;
const {data}=await supabase.from('logs').select('*,profiles(username),likes(user_id)').eq('user_id',pr.id).order('created_at',{ascending:false});setLogs(data||[]);
const a=await supabase.from('follows').select('*',{count:'exact',head:true}).eq('following',pr.id);const b=await supabase.from('follows').select('*',{count:'exact',head:true}).eq('follower',pr.id);setN([a.count||0,b.count||0]);
if(u){const {data:f}=await supabase.from('follows').select('follower').match({follower:u.id,following:pr.id});setFol(f?.length>0)}},[username,u]);
useEffect(()=>{load()},[load]);
async function toggle(){if(!u){location.href='/login';return}const k={follower:u.id,following:p.id};fol?await supabase.from('follows').delete().match(k):await supabase.from('follows').insert(k);load()}
async function del(id){if(confirm('Remove this from your diary?')){await supabase.from('logs').delete().eq('id',id);load()}}
function go(t){setTab(t);history.replaceState(null,'','?tab='+t)}
if(p===undefined)return <p>Loading…</p>;if(!p)return <p>No one here by that username.</p>;
const mine=u?.id===p.id,yr=new Date().getFullYear(),thisYear=logs.filter(l=>new Date(l.created_at).getFullYear()===yr).length,rev=logs.filter(l=>l.review),months={};
logs.forEach(l=>{const k=new Date(l.created_at).toLocaleString('en',{month:'long',year:'numeric'});(months[k]=months[k]||[]).push(l)});
return <><style>{CSS}</style>
<header className="ph"><div className="av">{p.username[0].toUpperCase()}</div><div className="who"><h1>@{p.username}</h1><small>Joined {new Date(p.created_at).toLocaleString('en',{month:'long',year:'numeric'})}</small></div>{u&&!mine&&<button className={fol?'ghost':''} onClick={toggle}>{fol?'Following':'Follow'}</button>}
<ul className="stats"><li><b>{logs.length}</b>Anime</li><li><b>{thisYear}</b>This year</li><li><b>{n[0]}</b>Followers</li><li><b>{n[1]}</b>Following</li></ul></header>
<div className="tabs" role="tablist">{[['profile','Profile'],['diary','Diary'],['reviews','Reviews']].map(([k,t])=><button key={k} role="tab" aria-selected={tab===k} className={tab===k?'on':''} onClick={()=>go(k)}>{t}</button>)}</div>
{tab==='profile'&&<><h2>Recent activity</h2>{logs.length?<div className="strip">{logs.slice(0,8).map(l=><a key={l.id} href={`/anime/${l.anime_id}`}><img src={l.cover} alt={l.title} title={l.title}/><small className="stars">{S(l.rating)}</small></a>)}</div>:<p>Nothing logged yet.{mine&&' Search for an anime to add your first.'}</p>}
<h2>Recent reviews</h2>{rev.length?rev.slice(0,5).map(l=><Card key={l.id} log={l} me={u} onChange={load}/>):<p>No reviews yet.</p>}</>}
{tab==='diary'&&(logs.length?Object.entries(months).map(([m,ls])=><section key={m}><h3 className="mo">{m}</h3><table className="dia"><tbody>{ls.map(l=><tr key={l.id}><td className="d">{new Date(l.created_at).getDate()}</td><td><a href={`/anime/${l.anime_id}`}><img src={l.cover} alt=""/></a></td><td><a href={`/anime/${l.anime_id}`}><b>{l.title}</b></a></td><td className="stars">{S(l.rating)}</td><td title="Has a review">{l.review?'✎':''}</td>{mine&&<td><button className="x" onClick={()=>del(l.id)} aria-label="Remove from diary">✕</button></td>}</tr>)}</tbody></table></section>):<p>The diary is empty.</p>)}
{tab==='reviews'&&(rev.length?rev.map(l=><Card key={l.id} log={l} me={u} onChange={load}/>):<p>No reviews yet.</p>)}</>}
