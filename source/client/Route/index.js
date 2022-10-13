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

  const [workbook, setWorkbook] = useState();

  const [sheetNameCollection, setSheetNameCollection] = useState([]);

  const [sheetActive, setSheetActive] = useState(/** @type {any} */ (null));

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

            setWorkbook(workbook);

            setSheetNameCollection(
              workbook.getPublishedSheetsInfo().map((sheet) => {
                return Object.values(sheet)[0].name;
              })
            );

            setSheetActive(activeSheet);
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

        <div className='d-flex'>
          <select
            className='form-select'
            onChange={(event) => {
              /** @type {any} */ (workbook).activateSheetAsync(
                event.target.value
              );
            }}
          >
            {sheetNameCollection.map((sheetName, index) => {
              return (
                <option key={index} value={sheetName}>
                  {sheetName}
                </option>
              );
            })}
          </select>

          <select
            className='form-select'
            onChange={(event) => {
              const region = event.target.value;

              region !== regionCollection[0]
                ? sheetActive.applyFilterAsync(
                    'Region',
                    region,
                    globalThis.tableau.FilterUpdateType.REPLACE
                  )
                : sheetActive.clearFilterAsync('Region');
            }}
          >
            {regionCollection.map((region, index) => {
              return (
                <option key={index} value={region}>
                  {region}
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
