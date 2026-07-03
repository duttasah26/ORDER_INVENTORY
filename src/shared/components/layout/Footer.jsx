import './Footer.css';

/** Simple static footer shared by CustomerLayout and PublicLayout. */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__text">© {currentYear} Order Inventory Management</p>
    </footer>
  );
}

export default Footer;
