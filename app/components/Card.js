'use client';
import Link from 'next/link';
import {supabase} from '../lib';
export default function Card({log,me,onChange}){
const liked=log.likes.some(l=>l.user_id===me?.id);
async function like(){if(!me){location.href='/login';return}const k={user_id:me.id,log_id:log.id};liked?await supabase.from('likes').delete().match(k):await supabase.from('likes').insert(k);onChange()}
return <div className="card">{log.cover&&<img src={log.cover} alt=""/>}<div><Link href={`/anime/${log.anime_id}`}><b>{log.title}</b></Link> <span className="stars" aria-label={`${log.rating} stars`}>{'★'.repeat(Math.floor(log.rating))}{log.rating%1?'½':''}</span>
<p>{log.review}</p><small><Link href={`/u/${log.profiles.username}`}>@{log.profiles.username}</Link> <button onClick={like} aria-label="Like">{liked?'♥':'♡'} {log.likes.length}</button></small></div></div>}
