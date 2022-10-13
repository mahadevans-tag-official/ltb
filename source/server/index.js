import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

(() => {
  const nodeEnv = process.env.NODE_ENV;

  dotenv.config({ path: `.env.${nodeEnv}` });

  const port = process.env.PORT;

  return express()
    .set('view engine', 'ejs')
    .set('views', path.join(process.cwd(), 'source/server/view'))

    .use(express.static(path.join(process.cwd(), 'public/client')))

    .get('*', (request, response) => {
      return response.render('index', { title: process.env.npm_package_name });
    })

    .listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`${nodeEnv}-server: http://localhost${port}`);

      return null;
    });
})();
