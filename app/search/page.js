'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {anilist,name} from '../../lib';
const Q=`query($s:String){Page(perPage:24){media(search:$s,type:ANIME,sort:POPULARITY_DESC){id title{romaji english}coverImage{large}seasonYear}}}`;
export default function Search(){const [r,setR]=useState(null);const [q,setQ]=useState('');
useEffect(()=>{const s=new URLSearchParams(location.search).get('q')||'';setQ(s);if(!s){setR([]);return}anilist(Q,{s}).then(d=>setR(d.Page.media)).catch(()=>setR([]))},[]);
return <><h1>{q?`Results for "${q}"`:'Search for an anime'}</h1>{r===null?<p>Searching…</p>:r.length===0?<p>No anime found. Try another title.</p>:<div className="grid">{r.map(a=><Link key={a.id} href={`/anime/${a.id}`}><img src={a.coverImage.large} alt=""/><b>{name(a.title)}</b><small>{a.seasonYear}</small></Link>)}</div>}</>}
