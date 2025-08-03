
// This file defines a Vercel Serverless Function that acts as a CORS proxy.
// IT IS NO LONGER USED in this version of the app, which relies on static data.
// It is kept here for reference but is effectively disabled.

export default async function handler(req: any, res: any) {
  res.status(404).send('Not Found: This proxy is no longer used in the current version of the application.');
}
