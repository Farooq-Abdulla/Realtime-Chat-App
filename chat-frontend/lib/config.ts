const production = {
    url: 'https://realtime-chat-app-backend-5e2i.onrender.com'
  };
  const development = {
    url: 'http://localhost:3001'
  };
  export const config = process.env.NODE_ENV === 'development' ? development : production;