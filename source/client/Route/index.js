import React, { useRef, useState, useCallback, useEffect } from 'react';
import $ from 'jquery';

const regionFilterName = 'Region';

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
  const ref = useRef(/** @type {any} */ (null));

  const [workbook, setWorkbook] = useState(/** @type {any} */ (null));

  const [sheetNameCollection, setSheetNameCollection] = useState([]);

  const [sheetActive, setSheetActive] = useState(/** @type {any} */ (null));

  const [regionFilterShow, setRegionFilterShow] = useState(false);

  const vizInitialize = useCallback(() => {
    new globalThis.tableau.Viz(
      $(ref.current).find('.viz').get(0),
      'https://public.tableau.com/views/WorldIndicators/GDPpercapita',
      (() => {
        const { width, height } = ref.current.getBoundingClientRect();

        return {
          width,
          height,
          hideTabs: true,
          hideToolbar: true,
          onFirstInteractive(_tableau) {
            const viz = _tableau.getViz();

            viz.addEventListener(
              globalThis.tableau.TableauEventName.TAB_SWITCH,
              () => {
                setSheetActive(workbook.getActiveSheet());
              }
            );

            const workbook = viz.getWorkbook();

            const sheetActive = workbook.getActiveSheet();

            setWorkbook(workbook);

            setSheetNameCollection(
              workbook.getPublishedSheetsInfo().map((sheet) => {
                return Object.values(sheet)[0].name;
              })
            );

            setSheetActive(sheetActive);
          }
        };
      })()
    );
  }, []);

  useEffect(() => {
    vizInitialize();
  }, []);

  useEffect(() => {
    sheetActive &&
      sheetActive.getFiltersAsync().then((result) => {
        setRegionFilterShow(result.has(regionFilterName));
      });
  }, [sheetActive]);

  return (
    <div ref={ref} className='Route' css={{ width: '100%', height: 700 }}>
      <div className='w-100 h-100 d-flex flex-column'>
        <div className='viz'></div>

        <div className='d-flex'>
          <select
            className='form-select'
            onChange={(event) => {
              const sheetName = event.target.value;

              workbook.activateSheetAsync(sheetName);
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

          {regionFilterShow && (
            <select
              className='form-select'
              onChange={(event) => {
                const region = event.target.value;

                region !== regionCollection[0]
                  ? sheetActive.applyFilterAsync(
                      regionFilterName,
                      region,
                      globalThis.tableau.FilterUpdateType.REPLACE
                    )
                  : sheetActive.clearFilterAsync(regionFilterName);
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Route;
