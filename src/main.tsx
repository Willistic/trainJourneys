import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
// import "./styles/index.css";
import "./styles/App.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<NuqsAdapter>
			<App />
		</NuqsAdapter>
	</StrictMode>
);
