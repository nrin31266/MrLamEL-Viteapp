
import { Provider } from "react-redux";
import store from './store/store';

import AppRouter from "./routes/AppRouter";
import { ConfigProvider } from "antd";


function App() {
  return (
   <ConfigProvider>
    <Provider store={store}>
       <AppRouter />
    </Provider>
   </ConfigProvider>
  );
}

export default App;
