import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/sections/scroll-to-top.jsx";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from './components/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>

		<BrowserRouter>
			<AuthProvider>
				<ScrollToTop />
				<App />
			</AuthProvider>
		</BrowserRouter>

	</React.StrictMode>
);
