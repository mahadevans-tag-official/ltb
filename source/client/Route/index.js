import React, { useRef, useState, useCallback, useEffect } from 'react';
import $ from 'jquery';

const regionCollection = [
  'select region',
  'Europe',
  'Middle East',
  'The Americas',
  'Oceania',
  'Asia',
  'Africa'
];

const Route = () => {
  const ref = useRef();

  const [activeSheet, setActiveSheet] = useState();

  const [, setRegion] = useState(regionCollection[0]);

  const vizInitialize = useCallback(() => {
    new globalThis.tableau.Viz(
      $(ref.current).find('.viz').get(0),
      'https://public.tableau.com/views/WorldIndicators/GDPpercapita',
      (() => {
        const { width, height } = /** @type {any} */ (
          ref.current
        ).getBoundingClientRect();

        return {
          width,
          height,
          hideTabs: true,
          hideToolbar: true,
          onFirstInteractive(_tableau) {
            const viz = _tableau.getViz();
            const workbook = viz.getWorkbook();
            const activeSheet = workbook.getActiveSheet();

            setActiveSheet(activeSheet);
          }
        };
      })()
    );
  }, []);

  useEffect(() => {
    vizInitialize();
  }, []);

  return (
    <div ref={ref} className='Route' css={{ width: '100%', height: 700 }}>
      <div className='w-100 h-100 d-flex flex-column'>
        <div className='viz'></div>

        <div>
          <select
            className='form-select'
            onChange={(event) => {
              const region = event.target.value;

              setRegion(region);

              /** @type {any} */ (activeSheet).applyFilterAsync(
                'Region',
                region,
                globalThis.tableau.FilterUpdateType.REPLACE
              );
            }}
          >
            {regionCollection.map((_region, index) => {
              return (
                <option key={index} value={_region}>
                  {_region}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Route;
