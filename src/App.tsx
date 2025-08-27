
import { Provider } from "react-redux";
import store from './store/store';

import AppRouter from "./routes/AppRouter";
import { ConfigProvider } from "antd";


function App() {
  return (
   <ConfigProvider theme={{
   }}>
    <Provider store={store}>
       <AppRouter />
    </Provider>
   </ConfigProvider>
  );
}

export default App;
