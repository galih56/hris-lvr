import ReactDOM from 'react-dom/client';
import '@/styles/index.css';
import Layout from '@/components/layout/dashboard-layout';

const App = () => {
    return (
        <Layout>
            
        </Layout>
    )
}

ReactDOM.createRoot(document.getElementById('app')!).render(<App />);