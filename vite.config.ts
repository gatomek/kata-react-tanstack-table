import {type ConfigEnv, defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({command}:ConfigEnv) => {
    return {
        base: command === 'build' ? '/kata-react-tanstack-table/' : '/',
        plugins: [react()],
    }
})
