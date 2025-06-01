import '@styles/components/footer.css'; 
import logopl from "@assets/img/logo_pl.png";

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-card footer-info">
          <h3>RezerwujA7</h3>
          <p>System rezerwacji, który uproszcza zarządzanie salami i niezbędnym wyposażeniem.</p>
          <ul>
            <li><i className="fa-solid fa-location-dot"></i><span>Address:</span>  ul. Wólczańska 177B,Łódź</li>
            <li><i className="fa-solid fa-headset"></i><span>Call Us:</span> +48 509 236 646, Grzegosz<br/>albo +48 093 366 3245, Agnieszka</li>
            <li><i className="fa-solid fa-paper-plane"></i><span>Email:</span> email@edu.p.lodz.pl</li>
          </ul>
        </div>

        {/* Center Section */}
        <div className="footer-center">
          <div className="footer-links">
            <h5>Linki</h5>
            <ul>
              <li><a href="#"><i className="fa-solid fa-circle-info"></i>Polityka prywatności</a></li>
              <li><a href="#"><i className="fa-solid fa-circle-info"></i>RODO</a></li>
              <li><a href="#"><i className="fa-solid fa-circle-info"></i>Deklaracja dostępności</a></li>
            </ul>
          </div>
          <div className="footer-logo">
            <p>Przy pomocy:</p>
            <div className='image_logo'> <a href='https://p.lodz.pl/' target='blank'><img src={logopl} alt="Politechnika Łódzka"/></a></div>
           
          </div>
        </div>

        {/* Right Section */}
        <div className="footer_hours">
          <div className='hours_all'>
            <div className='hours_left'>
              <h5>Godziny otwarcia:</h5>
              <p><i className="fa-solid fa-clock-rotate-left"></i>Poniedziałek: 10:00 - 18:00</p>
              <p><i className="fa-solid fa-clock-rotate-left"></i>Wtorek: 10:00 - 18:00</p>
              <p><i className="fa-solid fa-clock-rotate-left"></i>Środa: 10:00 - 18:00</p>
            </div>
            <div className='hours_right'>
              <p><i className="fa-solid fa-clock-rotate-left"></i>Czwartek: 10:00 - 18:00</p>
              <p><i className="fa-solid fa-clock-rotate-left"></i>Piątek: 10:00 - 18:00</p>
              <p><i className="fa-solid fa-clock-rotate-left"></i>Sobota: 10:00 - 18:00</p>
              <p><i className="fa-solid fa-clock-rotate-left"></i>Niedziela: 10:00 - 18:00</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              Strona internetowa stworzona przy pomocy studentów Politechniki Łódzkiej
              <br />
              Copyright ©2025 Politechnika Łódzka
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
