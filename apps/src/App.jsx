import React from 'react';
import { Layout } from 'antd';
import AppContext from './context/AppContext';
import useInitialState from './Hooks/useInitialState';
import { Aulas } from './views/Aulas';

const { Content, Footer } = Layout;

const App = () => {
  return (
    <AppContext.Provider value={useInitialState()}>
      {/* Layout principal de Ant Design */}
      <Layout style={{ minHeight: '100vh' }}>
        {/* Contenido */}
        <Content style={{ margin: '16px' }}>
          <Aulas />
        </Content>
        {/* Pie de página */}
        <Footer style={{ textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} - Centro de Entrenamiento
        </Footer>
      </Layout>
    </AppContext.Provider>
  );
};

export default App;