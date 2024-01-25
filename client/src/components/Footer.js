import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { ImSphere } from "react-icons/im";
const Footer = () => {
  return (
    <footer className="bg-slate-200 pt-20 lg:pl-20 lg:pr-20 pb-40 md:pb-20 pr-12 pl-12">
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mb-3 flex items-start justify-start lg:justify-center sm:mb-0 w-full sm:w-auto sm:mr-3">
          <div className="flex items-start space-x-2">
            <div className=" mx-2">
              <FaPhoneAlt className="text-xl" />
            </div>
            <div className="">
              <p>
                <span className="font-semibold">PHONE : </span>
                <br />{" "}
                <span className="text-slate-600 font-semibold">
                  <a href="tel:+917969459250"> IN +91 7969459250</a>
                </span>
                <br />
                <span className="text-slate-600 font-semibold">
                  <a href="tel:+33426837301"> FR +33 426837301</a>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-start justify-start lg:justify-center sm:mb-0 w-full sm:w-auto sm:mr-3">
          {" "}
          <div className="flex items-start space-x-2">
            <div className="mx-2">
              <FaLocationDot className="text-xl" />
            </div>

            <div>
              <p className="">
                <span className="font-semibold"> ADDRESS : </span> <br />
                <span className="text-slate-600 font-semibold">
                  Tour du Crédit Lyonnais,
                  <br /> 129 Rue Servient, 69003 Lyon, France.
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-start justify-start lg:justify-center sm:mb-0 w-full sm:w-auto sm:mr-3">
          <div className="flex items-start space-x-2">
            <div className="mx-2">
              <MdEmail className="text-xl" />
            </div>
            <div>
              <p className="">
                <span className="font-semibold"> EMAIL: </span> <br />
                <span className="text-slate-600">
                  <a
                    href="mailto:admissions@ligmr.fr"
                    className="font-semibold"
                  >
                    admissions@ligmr.fr
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-start lg:justify-center sm:w-auto">
          <div className="flex items-start space-x-2">
            <div className="mx-2">
              <ImSphere className="text-xl" />
            </div>
            <p className="">
              <span className="font-semibold"> WEBSITE : </span> <br />
              <span className="text-slate-600 font-semibold">
                <a
                  href="https://www.ligmr.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.ligmr.fr
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
