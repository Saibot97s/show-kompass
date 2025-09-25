import { Link, NavLink } from 'react-router-dom'

export default function Header(){
  return (
    <header>
      <div className="container nav">
        <Link to="/" className="brand" aria-label="Marke">
          <div className="logo" aria-hidden="true" />
          <span>ShowKompass</span>
        </Link>
        {/*
        <nav>
          <NavLink className="btn" to="/#kurse">Startseite</NavLink>
          <NavLink className="btn" to="/#kurse">Kontakt</NavLink>
        </nav>
        */}
      </div>
    </header>
  )
}