import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import './index.css';

import App from './App';
import Header from "./components/header/header.js";
import Footer from "./components/footer/footer.js";
import Login  from "./components/login/login.js";
import Home   from "./components/home/home.js";

const Layout = () => {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	)
};

const router = createBrowserRouter([
	{
		element: <Layout />,

		children: [
			{
				path: '/',
				element: <Login />
			},
			{
				path: '/home',
				element: <Home />
			}	
		]
	}
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
    	<RouterProvider router={router} />
  	</React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
