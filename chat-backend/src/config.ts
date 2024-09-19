const production = {
    url: 'https://realtime-chat.101xdev.com/'
  };
  const development = {
    url: 'http://localhost:3000'
  };
  export const config = process.env.NODE_ENV === 'development' ? development : production;