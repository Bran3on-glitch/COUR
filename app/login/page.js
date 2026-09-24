'use client';
import {useState} from 'react';
import {supabase} from '../../lib';
export default function Login(){const [mode,setMode]=useState('in');const [err,setErr]=useState('');const [msg,setMsg]=useState('');
async function go(e){e.preventDefault();setErr('');const f=new FormData(e.target);const email=f.get('email'),password=f.get('password');
const r=mode==='in'?await supabase.auth.signInWithPassword({email,password}):await supabase.auth.signUp({email,password,options:{data:{username:f.get('username').toLowerCase()}}});
if(r.error)return setErr(r.error.message);if(mode==='up'&&!r.data.session)return setMsg('Check your email to confirm your account, then log in.');location.href='/'}
return <form className="stack" onSubmit={go}><h1>{mode==='in'?'Log in':'Create your account'}</h1>
{mode==='up'&&<input name="username" placeholder="Username" pattern="[a-zA-Z0-9_]{3,20}" title="3 to 20 letters, numbers or underscores" required/>}
<input name="email" type="email" placeholder="Email" required/><input name="password" type="password" placeholder="Password (6+ characters)" minLength={6} required/>
<button>{mode==='in'?'Log in':'Sign up'}</button>{err&&<p role="alert" style={{color:'#b3261e'}}>{err}</p>}{msg&&<p>{msg}</p>}
<button type="button" className="ghost" onClick={()=>setMode(mode==='in'?'up':'in')}>{mode==='in'?'New here? Create an account':'Have an account? Log in'}</button></form>}
