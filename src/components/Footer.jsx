export default function Footer(){
  const year = new Date().getFullYear()
  return (
    <footer id="kontakt" className="container">
      <p>© <span>{year}</span> ShowKompass · Impressum · Datenschutz</p>
    </footer>
  )
}