import React from "react";

const Footer = () => {
  return (
    <footer className="m-4">
      <div className="flex justify-around">
        <div className="font-semibold">
          <p>Phone:+917969459250</p>
        </div>

        <div>
          {" "}
          <p className="font-semibold">
            Address: Tour du Crédit Lyonnais,
            <br /> 129 Rue Servient, 69003 Lyon,France.
          </p>
        </div>
        <div>
          <a href="mailto:admissions@ligmr.fr" className="font-semibold">
            admissions@ligmr.fr
          </a>
        </div>

        <div>
          <p className="font-semibold">
            <a
              href="https://www.ligmr.fr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.ligmr.fr
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
