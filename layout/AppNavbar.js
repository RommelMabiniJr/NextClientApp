import React, { useContext, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
  configureStore,
  createSlice,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import axios from "axios";
import Link from "next/link";

// Components from PrimeReact
import { StyleClass } from "primereact/styleclass";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";

const Navbar = () => {
  const [isHidden, setIsHidden] = React.useState(false);
  const menuRef = useRef();

  const toggleMenuItemClick = () => {
    setIsHidden((prevState) => !prevState);
  };

  return (
    <div id="home" className="landing-wrapper overflow-hidden relative">
      <div className="fixed top-0 left-0 py-4 px-4 mx-0 lg:px-6 flex align-items-center justify-content-between relative lg:static">
        <Link href="/" className="flex align-items-center">
          <img
            src={`/layout/logo.png`}
            alt="Sakai Logo"
            height="50"
            className="mr-0 lg:mr-2"
          />
          <span className="text-900 font-bold text-2xl line-height-3 mr-8">
            KasambahayKo
          </span>
        </Link>
        <StyleClass
          nodeRef={menuRef}
          selector="@next"
          enterClassName="hidden"
          leaveToClassName="hidden"
          hideOnOutsideClick="true"
        >
          <i
            ref={menuRef}
            className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"
          ></i>
        </StyleClass>
        <div
          className={classNames(
            "align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2",
            { hidden: isHidden }
          )}
          style={{ top: "100%" }}
        >
          <ul className="list-none p-0 m-0 ml-8 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
            <li>
              <a
                href="#home"
                onClick={toggleMenuItemClick}
                className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
              >
                <span>Home</span>
                <Ripple />
              </a>
            </li>
            <li>
              <a
                href="#review"
                onClick={toggleMenuItemClick}
                className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
              >
                <span>Reviews</span>
                <Ripple />
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={toggleMenuItemClick}
                className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
              >
                <span>About Us</span>
                <Ripple />
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={toggleMenuItemClick}
                className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
              >
                <span>Contact Us</span>
                <Ripple />
              </a>
            </li>
          </ul>
          <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
            <Link href="auth/login">
              <Button
                label="Login"
                text
                rounded
                className="border-none font-light line-height-2 text-blue-500"
              ></Button>
            </Link>
            <Link href="/register">
              <Button
                label="Register"
                rounded
                className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white"
              ></Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-nogutter surface-0 text-800  mr-7 ml-7 pb-5">
        <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
          <section>
            <span className="block text-6xl font-bold mb-1">Find your</span>
            <div className="text-6xl text-primary font-bold mb-3">
              perfect caretaker with a tap
            </div>
            <p className="mt-0 mb-4 text-800 text-1xl line-height-3">
              From cleaning and cooking to laundry and childcare, we've got you
              covered. Say goodbye to the stress and hassle of managing your
              household tasks and hello to more free time and peace of mind.
            </p>

            <Button
              label="Find a Nanny"
              type="button"
              className="mr-3 p-button-raised"
            />
            <Button
              label="Apply as Nanny"
              type="button"
              className="p-button-outlined"
            />
          </section>
        </div>
        <div className="col-12 md:col-6 overflow-hidden">
          <img
            src="/layout/hero-resized.png"
            alt="hero-1"
            className="md:ml-auto block md:h-full"
            style={{ clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" }}
          />
        </div>
      </div>
      <div></div>
      {/* second part */}
      <div className="flex justify-content-center mt-7 mb-7 mr-6 ml-5">
        <figure className="col-12 md:col-6  ">
          <img src="/layout/cleaning.svg" className="h-10 w-10 mr-5" />
        </figure>
        <div className="col-12 md:col-6 p-6 text-center md:text-left flex flex-align-items  ">
          <section>
            <h2 className="text-6xl font-bold text-black-alpha-90 mb-5">
              Your trust, security, and satisfaction are our top priorities
            </h2>
            <p className="text-800 mb-5 line-height-3 text-justify">
              KasambahayKo is a hybrid on-demand gig platform that connects you
              to a network of pre-screened, qualified, and trustworthy
              household, pet, and elderly care professionals. Our goal is to
              make it easier for you to find the right person to help you with
              your household tasks so you can focus on what matters most.
            </p>

            <Link href="Landing/aboutus">
              <Button
                label="About Us"
                icon="pi pi-arrow-right"
                iconPos="right"
              />
            </Link>
          </section>
        </div>
      </div>
      {/* thrid part */}
      <div className="mr-8 ml-8 mt-7 mt-7">
        <section>
          {/* <h2 className="flex justify-content-center text-4xl font-bold text-black-alpha-90 mb-5"> */}
          <h2 className="flex justify-content-center text-5xl font-bold text-primary mb-5">
            Connecting Families through services
          </h2>
        </section>
        <div className="flex justify-content-center gap-5">
          <div className="flex justify-content-center items-center">
            <div className="card w-1/4 p-4">
              <img
                src="/layout/child.png"
                alt="Service 1"
                className="h-3 w-3"
              />
              <p className="text-center font-bold mt-2">Childcare</p>
              <p className="text-center mt-2">
                Our childcare service connects you with pre-screened, qualified,
                and trustworthy professionals who can take care of your children
                while you're away.
              </p>
            </div>
          </div>
          <div className="flex justify-content-center items-center">
            <div className="card w-1/4 p-4">
              <img
                src="/layout/grandfather.png"
                alt="Service 2"
                className="h-3 w-3"
              />
              <p className="text-center font-bold mt-2">Elderly Care</p>
              <p className="text-center mt-2">
                Our elderly care service connects you with pre-screened,
                qualified, and trustworthy professionals who can take care of
                your elderly loved ones and provide companionship.
              </p>
            </div>
          </div>
          <div className="flex justify-content-center gap-5 items-center">
            <div className="card w-1/4 p-4">
              <img
                src="layout/pawprint.png"
                alt="Service 3"
                className="h-3 w-3"
              />
              <p className="text-center font-bold mt-2">Pet Care</p>
              <p className="text-center mt-2">
                Our pet care service connects you with pre-screened, qualified,
                and trustworthy professionals who can take care of your pets
                while you're away.
              </p>
            </div>
          </div>
          <div className="flex justify-content-center gap-5 items-center">
            <div className="card w-1/4 p-4">
              <img
                src="layout/bucket.png"
                alt="Service 4"
                className="h-3 w-3"
              />
              <p className="text-center font-bold mt-2">Housekeeping</p>
              <p className="text-center mt-2">
                Our housekeeping service connects you with pre-screened,
                qualified, and trustworthy professionals who can help you with
                your household tasks such as cleaning and laundry.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* fourth part */}
      <div className=" flex ">
        <div className="mr-7 ml-7 mt-7 ">
          <section>
            <h2 className="flex justify-content-center text-5xl font-bold text-primary mb-5">
              What our customers say
            </h2>
          </section>
          <div className="flex justify-content-center">
            <Card>
              <div className="p-4">
                <div className="flex justify-content-center">
                  <img
                    src="/layout/qmark.png"
                    alt="Quote"
                    className="h-2 w-2"
                  />
                </div>
                <p className="text-center font-bold mt-2">
                  "I am very happy with the service. I was able to find a
                  trustworthy and reliable nanny for my kids. I will definitely
                  recommend this to my friends."
                </p>
                <p className="text-center font-bold mt-2">- Maria</p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="flex justify-content-center">
                  <img
                    src="/layout/qmark.png"
                    alt="Quote"
                    className="h-2 w-2"
                  />
                </div>
                <p className="text-center font-bold mt-2">
                  "I was hesitant to try this service at first, but I'm so glad
                  I did. The housekeeper I found through KasambahayKo is amazing
                  and has made my life so much easier."
                </p>
                <p className="text-center font-bold mt-2">- Rommel</p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="flex justify-content-center">
                  <img
                    src="/layout/qmark.png"
                    alt="Quote"
                    className="h-2 w-2"
                  />
                </div>
                <p className="text-center font-bold mt-2">
                  "I needed someone to take care of my dog while I was away on
                  vacation and KasambahayKo helped me find the perfect pet
                  sitter. I will definitely use this service again in the
                  future."
                </p>
                <p className="text-center font-bold mt-2">- Seno</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
