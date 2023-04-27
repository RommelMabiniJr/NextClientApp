import React, { useContext, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import axios from 'axios';
import Link from 'next/link';

// Components from PrimeReact
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';

const initialState = {
    user: null,
    reviews: [],
    isLoading: false,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setReviews(state, action) {
            state.reviews = action.payload;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    }
});

const middleware = [...getDefaultMiddleware(), thunk];

const store = configureStore({
    reducer: {
        user: userSlice.reducer
    },
    middleware
});

const Navbar = () => {
    const [isHidden, setIsHidden] = React.useState(false);
    const menuRef = useRef();

    const toggleMenuItemClick = () => {
        setIsHidden(prevState => !prevState);
    }

    return (
        <div id="home" className="landing-wrapper overflow-hidden">
            <div className="fixed py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                <Link href="/" className="flex align-items-center">
                    <img src={`/layout/logo.png`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" />
                    <span className="text-900 font-bold text-2xl line-height-3 mr-8">TagaTulong</span>
                </Link>
                <StyleClass nodeRef={menuRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick="true">
                    <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                </StyleClass>
                <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                    <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                        <li>
                            <a href="#home" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>Home</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#features" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>Reviews</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#highlights" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>About Us</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#pricing" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>Contact Us</span>
                                <Ripple />
                            </a>
                        </li>
                    </ul>
                    <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <Link href="auth/login"><Button label="Login" text rounded className="border-none font-light line-height-2 text-blue-500"></Button></Link>
                        <Link href="/register"><Button label="Register" rounded className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white"></Button></Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-nogutter surface-0 text-800">
                <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                    <section>
                        <span className="block text-6xl font-bold mb-1">Find your</span>
                        <div className="text-6xl text-primary font-bold mb-3">perfect caretaker with a tap</div>
                        <p className="mt-0 mb-4 text-700 line-height-3">From cleaning and cooking to laundry and childcare, we've got you covered. Say goodbye to the stress and hassle of managing your household tasks and hello to more free time and peace of mind.</p>

                        <Button label="Find a Nanny" type="button" className="mr-3 p-button-raised" />
                        <Button label="Apply as Nanny" type="button" className="p-button-outlined" />
                    </section>
                </div>
                <div className="col-12 md:col-6 overflow-hidden">
                    <img src="/layout/hero-resized.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                </div>
            </div>
    

        </div>
    );
}

export default Navbar;