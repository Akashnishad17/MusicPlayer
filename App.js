import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import color from "./app/config/color";
import AudioProvider from "./app/context/AudioProvider";
import Navigation from './app/navigation/Navigation';

const MyTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: color.APP_BG
	}
};

export default function App() {
	return (
		<AudioProvider>
			<NavigationContainer theme={MyTheme}>
				<Navigation />
			</NavigationContainer>
		</AudioProvider>
	);
};