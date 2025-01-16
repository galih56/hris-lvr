import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
// import visualizer from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/apps/employee-services/main.tsx',
                'resources/js/apps/hris-dashboard/main.tsx',
                'resources/js/apps/authentication/main.tsx'
            ],
            refresh: true,
        }),
        react(),
        // visualizer({
        //   open: true, // Automatically open the visualization in your default browser
        // }),
    ],
    resolve: {
        alias : {
            '@': path.resolve(__dirname, 'resources/js'),
            '@authentication' : '/resources/js/apps/authentication',
            '@hris-dashboard' : '/resources/js/apps/hris-dashboard',
        }
    },
    build: {
        rollupOptions: {
          input: {
            // employeeServices: path.resolve(__dirname, 'resources/js/apps/employee-services/App.tsx'),
            authentication: path.resolve(__dirname, 'resources/js/apps/authentication/main.tsx'),
            hrisDashboard: path.resolve(__dirname, 'resources/js/apps/hris-dashboard/main.tsx')
          },
        },
    },
});
