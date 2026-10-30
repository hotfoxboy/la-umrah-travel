import type {NextConfig} from 'next';
const config:NextConfig={distDir:process.env.NEXT_DIST_DIR||'.next',async headers(){return [{source:'/sw.js',headers:[{key:'Cache-Control',value:'no-cache, no-store, must-revalidate'},{key:'Service-Worker-Allowed',value:'/'}]},{source:'/api/:path*',headers:[{key:'Cache-Control',value:'no-store'}]}];},images:{qualities:[60,75],remotePatterns:[{protocol:'https',hostname:'images.unsplash.com'}]},turbopack:{rules:{'*.css':{loaders:['@tailwindcss/turbopack'],as:'*.css'}}}};
export default config;
