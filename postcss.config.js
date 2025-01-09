/*
 * @Author: Elk
 * @Date: 2025-01-03 16:19:48
 * @FilePath: /lemon9-admin/postcss.config.js
 * @Description: postcss配置
 */
// @ts-check

/** @type {import('postcss-load-config').Config} */
export default {
    plugins: {
        "postcss-import": {},
        "tailwindcss/nesting": {},
        tailwindcss: {},
        autoprefixer: {},
        ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {})
    }
};
