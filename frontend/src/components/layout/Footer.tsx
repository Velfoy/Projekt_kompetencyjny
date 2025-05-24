import '@styles/components/footer.css'; 

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-card">
          <h3>RezerwujA7</h3>
          <p>System rezerwacji, który uproszcza zarządzanie salami i niezbędnym wyposażeniem.</p>
          <ul>
            <li>📍 Aleja Politechniki 16, Łódź</li>
            <li>📞 Grzegorz: +48 509 236 646</li>
            <li>📞 Agnieszka: +48 509 526 435</li>
            <li>✉️ 248777@edu.p.lodz.pl</li>
          </ul>
        </div>

        {/* Center Section */}
        <div className="footer-center">
          <div className="footer-links">
            <h5>Linki</h5>
            <ul>
              <li><a href="#">Polityka prywatności</a></li>
              <li><a href="#">RODO</a></li>
              <li><a href="#">Deklaracja dostępności</a></li>
            </ul>
          </div>
          <div className="footer-logo">
            <p>Przy pomocy:</p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Politechnika_Lodzka_logo.svg"
              alt="Politechnika Łódzka"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-card">
          <h5>Godziny otwarcia:</h5>
          <ul>
            <li>🕒 Poniedziałek: 10:00 - 18:00</li>
            <li>🕒 Wtorek: 10:00 - 18:00</li>
            <li>🕒 Środa: 10:00 - 18:00</li>
            <li>🕒 Czwartek: 10:00 - 18:00</li>
            <li>🕒 Piątek: 10:00 - 18:00</li>
            <li>🕒 Sobota: 10:00 - 18:00</li>
            <li>🕒 Niedziela: 10:00 - 18:00</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Strona internetowa stworzona przy pomocy studentów Politechniki Łódzkiej
          <br />
          Copyright ©2025 Politechnika Łódzka
        </p>
      </div>
    </footer>
  );
};

export default Footer;
