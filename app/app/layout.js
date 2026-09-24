import './globals.css';
import Nav from '../components/Nav';
export const metadata={title:'cour',description:'A home for anime lovers. Log what you watch, review it, follow friends.'};
export default function L({children}){return <html lang="en"><body><Nav/><main>{children}</main></body></html>}
