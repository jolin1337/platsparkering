import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import { token, components } from './theme';
import { ApolloClient, InMemoryCache, ApolloProvider  } from '@apollo/client';
import locale from 'antd/locale/sv_SE';
import {allQueryMocks, allResolverMocks} from './mock';


const cache = new InMemoryCache();
allQueryMocks.forEach(m => m(cache));
const client = new ApolloClient({
  //uri: 'https://flyby-router-demo.herokuapp.com/',
  uri: 'http://localhost:5000/',
  cache,
  resolvers: {
    ...allResolverMocks
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider
      locale={locale}
      theme={{
        token,
        components
      }}
    >
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
