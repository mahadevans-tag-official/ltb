import React, { useRef, useCallback, useEffect } from 'react';
import { css } from '@emotion/react';

const Route = () => {
  const ref = useRef();

  const vizInitialize = useCallback(() => {
    new globalThis.tableau.Viz(
      ref.current,
      'https://public.tableau.com/views/WorldIndicators/GDPpercapita',
      (() => {
        const element = /** @type {any} */ (ref.current);

        return {
          width: element.offsetWidth,
          height: element.offsetHeight,
          hideTabs: true,
          hideToolbar: true,
          onFirstInteractive(tableau) {
            const viz = tableau.getViz();
            const workbook = viz.getWorkbook();
            const activeSheet = workbook.getActiveSheet();
            console.log(activeSheet);
          }
        };
      })()
    );
  }, []);

  useEffect(() => {
    vizInitialize();
  }, []);

  return (
    <div
      ref={ref}
      css={{ width: '100%', height: '100vh' }}
      className='Route'
    ></div>
  );
};

export default Route;
