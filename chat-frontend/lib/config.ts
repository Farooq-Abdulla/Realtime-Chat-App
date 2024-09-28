
const production = {
  url: process.env.NEXT_PUBLIC_PROD_Backend_URL,
};
const development = {
  url: process.env.NEXT_PUBLIC_DEV_Backend_URL,
};

export const config =process.env.NODE_ENV === 'development' ? development : production;
