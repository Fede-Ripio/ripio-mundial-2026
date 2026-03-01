import { redirect } from 'next/navigation'

// /bracket redirige a /cuadro
export default function BracketRedirect() {
  redirect('/cuadro')
}
