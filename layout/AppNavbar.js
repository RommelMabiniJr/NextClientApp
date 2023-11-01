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
import { useRouter } from "next/router";

// Components from PrimeReact
import { StyleClass } from "primereact/styleclass";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";
import styles from "../styles/landingpage.module.css";
import { carousel } from "primereact/carousel";
import { router } from "websocket";

const Navbar = () => {
  const [isHidden, setIsHidden] = React.useState(false);
  const menuRef = useRef();

  const toggleMenuItemClick = () => {
    setIsHidden((prevState) => !prevState);
  };

  const router = useRouter();

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

            {/* <Button
              label="Get Started"
              type="button"
              className="mr-3 p-button-raised"
            /> */}
            <Button
              label="Get Started"
              type="button"
              className="p-button-outlined"
              onClick={() => {
                router.push("/aboutus");
              }}
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
      {/* second part */}
      <section style={{ marginBottom: "2rem" }}>
        <div className="flex flex-col justify-center mt-7 mr-6 ml-6 mb-8 lg:flex-row lg:justify-between">
          <div className="grid card bg-teal-100">
            <div className="col-12 md:col-6 lg:w-1/3 ">
              <div className="sm:w-1/3 ">
                <img src="/layout/cleaning.svg" className="h-10 w-10 mr-5" />
              </div>
            </div>
            <div className="col-12 md:col-6 lg:w-2/3 p-6 text-center md:text-left flex flex-col justify-center">
              {/* <div className="fadeinright animation-duration-1000 animation-iteration-1"> */}
              <div>
                <h2 className="text-6xl font-bold text-black-alpha-90 mb-5">
                  Your trust, security, and satisfaction are our top priorities
                </h2>
                <p className="text-800  text-black-alpha-90 mb-5  line-height-3 text-justify  overflow-hidden">
                  KasambahayKo is a hybrid on-demand gig platform that connects
                  you to a network of pre-screened, qualified, and trustworthy
                  household, pet, and elderly care professionals. Our goal is to
                  make it easier for you to find the right person to help you
                  with your household tasks so you can focus on what matters
                  most.
                </p>

                <Link href="/aboutus">
                  <Button
                    label="About Us"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="Get Started">
        <div className="flex justify-content-center flex-wrap ">
          <div className="mb-2 p-7 ">
            <div className="grid gap-auto">
              <div className="col-12 lg:col-4 ">
                <Card
                  className={`md:w-20rem bg-yellow-100 ${styles["rounded-card"]}`}
                  title="Kasambahay"
                  subTitle="look for your Employer"
                  style={{ width: "300px" }} // Set the width and height here
                  header={
                    <img
                      alt=""
                      src="/layout/babysitting.jpg"
                      className={styles["rounded-image"]}
                    />
                  }
                >
                  <p className="texl-1xl ">
                    Find a dependable family and home services in one location
                    with a single tap.
                  </p>
                  <div className="flex justify-content-center">
                    <Button
                      className="font-semibold"
                      rounded
                      onClick={() => {
                        window.location.href = "/register";
                      }}
                    >
                      Apply as Kasambahay
                    </Button>
                  </div>
                </Card>
              </div>
              <div className="col-12 lg:col-4">
                <Card
                  className={`md:w-20rem bg-cyan-100 ${styles["rounded-card"]}`}
                  title="Employer"
                  subTitle="Look for your Kasambahay"
                  style={{ width: "300px" }}
                  header={
                    <img
                      alt=""
                      src="/layout/house keeoing.jpg"
                      className={styles["rounded-image"]}
                    />
                  }
                >
                  <p className="text-1xl">
                    Search for a dependable Kasambahay to help you with your
                    household tasks with one tap.
                  </p>
                  <div className="flex justify-content-center">
                    <Button
                      className="font-semibold"
                      rounded
                      onClick={() => {
                        window.location.href = "/register";
                      }}
                    >
                      Find your Kasambahay
                    </Button>
                  </div>
                </Card>
              </div>
              <div className="col-12 lg:col-4">
                <Card
                  className={`md:w-20rem bg-pink-100 ${styles["rounded-card"]}`}
                  title="KasambahayKo Inc."
                  subTitle="Who we are"
                  style={{ width: "300px" }}
                  header={
                    <img
                      alt=""
                      src="/layout/pet care.jpg"
                      className={styles["rounded-image"]}
                    />
                  }
                >
                  <p className="text-1xl">
                    We are the KasambahayKo Inc. We are here to help you find
                    the right person to help you with your household tasks.
                  </p>
                  <div className="flex justify-content-center">
                    <Button
                      className="font-semibold"
                      rounded
                      onClick={() => {
                        router.push("/aboutus");
                      }}
                    >
                      Learn more
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="p-7">
          <div>
            <h2 className="flex justify-content-center text-5xl font-bold text-primary mb-5">
              Connecting Families through services
            </h2>
          </div>
          <div className="flex justify-content-center">
            <div className="grid">
              <div className="col-3">
                <div className="card">
                  <div className="content-center text-center">
                    <img
                      align="center"
                      src="layout/2.png"
                      className="h-8 w-8"
                    />
                  </div>
                  <p
                    className="text-center font-bold mt-2"
                    style={{ maxWidth: "300px" }}
                  >
                    Childcare
                  </p>
                  <p className="text-center mt-2" style={{ maxWidth: "300px" }}>
                    Connects you with pre-screened, qualified, and trustworthy
                    professionals who can take care of your children while
                    you're away.
                  </p>
                </div>
              </div>
              <div className="col-3">
                <div className="card">
                  <div className="content-center text-center">
                    <img src="/layout/3.png" className="h-8 w-8" />
                  </div>
                  <p
                    className="text-center font-bold mt-2"
                    style={{ maxWidth: "300px" }}
                  >
                    Elderly Care
                  </p>
                  <p className="text-center mt-2" style={{ maxWidth: "300px" }}>
                    Connects you with pre-screened, qualified, and trustworthy
                    professionals who can take care of your elderly loved ones
                    and provide companionship.
                  </p>
                </div>
              </div>

              <div className="col-3">
                <div className="card">
                  <div className="content-center text-center">
                    <img src="layout/1.png" className="h-8 w-8" />
                  </div>
                  <p
                    className="text-center font-bold mt-2"
                    style={{ maxWidth: "300px" }}
                  >
                    Pet Care
                  </p>
                  <p className="text-center mt-2" style={{ maxWidth: "300px" }}>
                    Connects you with pre-screened, qualified, and trustworthy
                    professionals who can take care of your pets while you're
                    away.
                  </p>
                </div>
              </div>
              <div className="col-3">
                <div className="card">
                  <div className="content-center text-center">
                    <img src="layout/4.png" className="h-8 w-8" />
                  </div>

                  <p
                    className="text-center font-bold mt-2"
                    style={{ maxWidth: "300px" }}
                  >
                    Housekeeping
                  </p>
                  <p className="text-center mt-2" style={{ maxWidth: "300px" }}>
                    Connects you with pre-screened, qualified, and trustworthy
                    professionals who can help you with your household tasks
                    such as cleaning and laundry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* fourth part */}
      <div className="surface-0 p-5">
        <div className="text-900 font-bold text-4xl mb-4 text-center">
          Testimonials from our customers
        </div>
        <div className="text-700 text-1xl mb-6 text-center line-height-3">
          We are proud to have helped families find the perfect household help.
          Here's what some of them have to say about our service.
        </div>

        <div className="grid">
          <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
              <div
                className="shadow-2 p-3 h-full flex flex-column"
                style={{ borderRadius: "6px" }}
              >
                {" "}
                <div className="p-4">
                  <p className="text-center font-bold mt-2 text-lg text-gray-700">
                    "I am very happy with the service. I was able to find a
                    trustworthy and reliable nanny for my kids. I will
                    definitely recommend this to my friends."
                  </p>
                  <p className="text-center font-bold mt-2 text-gray-600">
                    - Maria
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
              <div
                className="shadow-2 p-3 h-full flex flex-column"
                style={{ borderRadius: "6px" }}
              >
                {" "}
                <div className="p-4">
                  <p className="text-center font-bold mt-2 text-lg text-gray-700">
                    "I needed someone to take care of my dog while I was away on
                    vacation and KasambahayKo helped me find the perfect pet
                    sitter. I will definitely use this service again in the
                    future."
                  </p>
                  <p className="text-center font-bold mt-2 text-gray-600">
                    - Seno
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
              <div
                className="shadow-2 p-3 h-full flex flex-column"
                style={{ borderRadius: "6px" }}
              >
                <div className="p-4">
                  <p className="text-center font-bold mt-2 text-lg text-gray-700">
                    "I was hesitant to try this service at first, but I'm so
                    glad I did. The housekeeper I found through KasambahayKo is
                    amazing and has made my life so much easier."
                  </p>
                  <p className="text-center font-bold mt-2 text-gray-600">
                    - Rommel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sixth part */}
      <div className="mt-5">
        <section>
          <footer className="bg-blue-100 pt-10 sm:mt-10 pt-10">
            <div className="text-center">
              <span className="text-3xl font-bold content-center text-black-alpha-90 mt-2">
                <img
                  src={`/layout/logo.png`}
                  alt="Sakai Logo"
                  height="50"
                  className="mr-0 lg:mr-2"
                />
                KasambahayKo Inc.
              </span>
            </div>

            <div className="max-w-6xl m-auto text-black-alpha-90 flex justify-content-center">
              <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                <div className="text-xs uppercase text-black-alpha-90 font-medium mb-6">
                  About KasambahayKo
                </div>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Services
                </a>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Pricing
                </a>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Testimonials
                </a>
              </div>
              <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                <div className="text-xs uppercase text-black-alpha-90 font-medium mb-6">
                  Services & Support
                </div>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Find a Nanny
                </a>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Apply as Nanny
                </a>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Contact Us
                </a>
              </div>
              <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                <div className="text-xs uppercase text-black-alpha-90 font-medium mb-6">
                  Community
                </div>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  GitHub
                </a>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Discord
                </a>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Twitter
                </a>
              </div>
              <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                <div className="text-xs uppercase text-black-alpha-90 font-medium mb-6">
                  Company
                </div>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  About Us
                </a>
                <a
                  href="/aboutus"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Careers
                </a>
                <a
                  href="/"
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="pt-2 flex justify-content-right">
              <div className="flex pb-5 px-3 m-auto pt-5 border-t border-gray-500 text-gray-400 text-sm flex-col md:flex-row max-w-6xl">
                <div className="mt-2 text-black-alpha-90">
                  © 2023 KasambahayKo. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default Navbar;
