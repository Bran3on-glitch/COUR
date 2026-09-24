'use client';
import {useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';
export const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export function useUser(){const [u,setU]=useState(undefined);useEffect(()=>{supabase.auth.getUser().then(({data})=>setU(data.user));const {data}=supabase.auth.onAuthStateChange((_,s)=>setU(s?.user??null));return()=>data.subscription.unsubscribe()},[]);return u}
export async function anilist(query,variables){const r=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables})});return (await r.json()).data}
export const name=t=>t.english||t.romaji;
