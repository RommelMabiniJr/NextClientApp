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
                href="#aboutus"
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
      <Divider />
      {/* second part */}
      <section id="#aboutus">
        <div className="flex flex-col justify-center mt-7 mb-7 mr-6 ml-5 lg:flex-row lg:justify-between">
          <figure className="col-12 md:col-6 lg:w-1/3">
            <img src="/layout/cleaning.svg" className="h-10 w-10 mr-5" />
          </figure>
          <div className="col-12 md:col-6 lg:w-2/3 p-6 text-center md:text-left flex flex-col justify-center">
            <section>
              <h2 className="text-6xl font-bold text-black-alpha-90 mb-5">
                Your trust, security, and satisfaction are our top priorities
              </h2>
              <p className="text-800 mb-5 line-height-3 text-justify">
                KasambahayKo is a hybrid on-demand gig platform that connects
                you to a network of pre-screened, qualified, and trustworthy
                household, pet, and elderly care professionals. Our goal is to
                make it easier for you to find the right person to help you with
                your household tasks so you can focus on what matters most.
              </p>

              <Link href="/aboutus">
                <Button
                  label="About Us"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                />
              </Link>
            </section>
          </div>
        </div>
      </section>

      <Divider />
      {/* third part */}
      <section>
        {" "}
        <div className="mr-8 ml-8">
          <div>
            <h2 className="flex justify-content-center text-5xl font-bold text-primary mb-5">
              Connecting Families through services
            </h2>
          </div>
          <div className="grid flex justify-content-center">
            <div className="col-3 flex-grow border-circle">
              <div className="card w-1/4 p-4 ">
                <div className="content-center text-center">
                  <img
                    align="center"
                    src="/layout/child.png"
                    className="h-3 w-3"
                  />
                </div>
                <p
                  className="text-center font-bold mt-2"
                  style={{ maxWidth: "300px" }}
                >
                  Childcare
                </p>
                <p className="text-center mt-2" style={{ maxWidth: "300px" }}>
                  Our childcare service connects you with pre-screened,
                  qualified, and trustworthy professionals who can take care of
                  your children while you're away.
                </p>
              </div>
            </div>
            <div className="col-3 flex-grow">
              <div className="card w-1/4 p-4">
                <div className="content-center text-center">
                  <img src="/layout/grandfather.png" className="h-3 w-3" />
                </div>
                <p
                  className="text-center font-bold mt-2"
                  style={{ maxWidth: "300px" }}
                >
                  Elderly Care
                </p>
                <p className="text-center mt-2" style={{ maxWidth: "300px" }}>
                  Our elderly care service connects you with pre-screened,
                  qualified, and trustworthy professionals who can take care of
                  your elderly loved ones and provide companionship.
                </p>
              </div>
            </div>

            <div className="col-3 flex-grow">
              <div className="card w-1/4 p-4">
                <div className="content-center text-center">
                  <img src="layout/pawprint.png" className="h-3 w-3" />
                </div>
                <p
                  className="text-center font-bold mt-2"
                  style={{ maxWidth: "300px" }}
                >
                  Pet Care
                </p>
                <p className="text-center mt-2" style={{ maxWidth: "300px" }}>
                  Our pet care service connects you with pre-screened,
                  qualified, and trustworthy professionals who can take care of
                  your pets while you're away.
                </p>
              </div>
            </div>
            <div className="col-3 flex-grow">
              <div className="card w-1/4 p-4">
                <div className="content-center text-center">
                  <img src="layout/bucket.png" className="h-3 w-3" />
                </div>

                <p
                  className="text-center font-bold mt-2"
                  style={{ maxWidth: "300px" }}
                >
                  Housekeeping
                </p>
                <p className="text-center mt-2" style={{ maxWidth: "300px" }}>
                  Our housekeeping service connects you with pre-screened,
                  qualified, and trustworthy professionals who can help you with
                  your household tasks such as cleaning and laundry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Divider />
      {/* fourth part */}
      <div className="  ">
        <div className="mr-7 ml-7 mt-7 ">
          <section>
            {/* <h2 className=" flex justify-content-center text-5xl font-bold text-primary mb-5">
            What our customers say
            </h2> */}
            <Divider className="text-5xl font-bold text-primary mb-5 ">
              <h2>Testimonials</h2>
            </Divider>
          </section>
          <div className=" flex justify-content-center">
            {/* <Card> */}
            <div className="p-4">
              <div className="flex justify-content-center">
                <img src="/layout/qmark.png" alt="Quote" className="h-2 w-2" />
              </div>
              <p className="text-center font-bold mt-2">
                "I am very happy with the service. I was able to find a
                trustworthy and reliable nanny for my kids. I will definitely
                recommend this to my friends."
              </p>
              <p className="text-center font-bold mt-2">- Maria</p>
            </div>
            {/* </Card> */}
            {/* <Card> */}
            <div className="p-4">
              <div className="flex justify-content-center">
                <img src="/layout/qmark.png" alt="Quote" className="h-2 w-2" />
              </div>
              <p className="text-center font-bold mt-2">
                "I was hesitant to try this service at first, but I'm so glad I
                did. The housekeeper I found through KasambahayKo is amazing and
                has made my life so much easier."
              </p>
              <p className="text-center font-bold mt-2">- Rommel</p>
            </div>
            {/* </Card> */}
            {/* <Card> */}
            <div className="p-4">
              <div className="flex justify-content-center">
                <img src="/layout/qmark.png" alt="Quote" className="h-2 w-2" />
              </div>
              <p className="text-center font-bold mt-2">
                "I needed someone to take care of my dog while I was away on
                vacation and KasambahayKo helped me find the perfect pet sitter.
                I will definitely use this service again in the future."
              </p>
              <p className="text-center font-bold mt-2">- Seno</p>
            </div>
            {/* </Card> */}
          </div>
        </div>
      </div>

      {/* fifth part */}
      <div className="text-center mt-5">
        <section>
          <footer className="bg-blue-800 pt-10 sm:mt-10 pt-10">
            <div className="max-w-6xl m-auto text-gray-800 flex justify-content-center flex-wrap">
              <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                  About KasambahayKo
                </div>

                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Services
                </a>
                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Pricing
                </a>
                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Testimonials
                </a>
              </div>

              <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                  Services & Support
                </div>

                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Find a Nanny
                </a>
                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Apply as Nanny
                </a>
                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Contact Us
                </a>
              </div>

              <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                  Community
                </div>

                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  GitHub
                </a>
                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Discord
                </a>
                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Twitter
                </a>
              </div>

              <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                  Company
                </div>

                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  About Us
                </a>
                <a
                  href="/aboutus"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Careers
                </a>
                <a
                  href="/"
                  className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Contact Us
                </a>
              </div>
            </div>
            {/* Footer Bottom */}
            <div className="pt-2 flex justify-content-center">
              <div
                className="flex pb-5 px-3 m-auto pt-5 
          border-t border-gray-500 text-gray-400 text-sm 
          flex-col md:flex-row max-w-6xl"
              >
                <div className="mt-2">
                  © 2023 KasambahayKo. All rights reserved.
                </div>
              </div>
            </div>
          </footer>{" "}
        </section>
      </div>
    </div>
  );
};

export default Navbar;
