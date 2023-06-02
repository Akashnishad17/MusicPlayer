import { NavigationContainer } from "@react-navigation/native";
import AudioProvider from "./app/context/AudioProvider";
import Navigation from './app/navigation/Navigation';

export default function App() {
	return (
		<AudioProvider>
			<NavigationContainer>
				<Navigation />
			</NavigationContainer>
		</AudioProvider>
	);
};