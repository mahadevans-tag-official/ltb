import React, { useRef, useState, useCallback, useEffect } from 'react';
import $ from 'jquery';

const regionFilterName = 'Region';

const regionFilterValueBlank = 'select region';

const Route = () => {
  const ref = useRef(/** @type {any} */ (null));

  const [workbook, workbookSet] = useState(/** @type {any} */ (null));

  const [sheetNameCollection, sheetNameCollectionSet] = useState([]);

  const [sheetActive, sheetActiveSet] = useState(/** @type {any} */ (null));

  const [regionFilterShow, regionFilterShowSet] = useState(false);

  const [regionFilterValueCollection, setRegionFilterValueCollection] =
    useState([]);

  const regionFilterInitialize = useCallback((_sheetActive) => {
    _sheetActive.getFiltersAsync().then((result) => {
      const _regionFilterShow = result.has(regionFilterName);

      _regionFilterShow &&
        setRegionFilterValueCollection([
          regionFilterValueBlank,
          ...result
            .get(regionFilterName)
            .getAppliedValues()
            .map(({ value }) => value)
        ]);

      regionFilterShowSet(_regionFilterShow);
    });
  }, []);

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

            const _workbook = viz.getWorkbook();

            const _sheetActive = _workbook.getActiveSheet();

            sheetNameCollectionSet(
              _workbook.getPublishedSheetsInfo().map((sheet) => {
                return Object.values(sheet)[0].name;
              })
            );

            regionFilterInitialize(_sheetActive);

            sheetActiveSet(_sheetActive);

            workbookSet(_workbook);
          }
        };
      })()
    );
  }, [regionFilterInitialize]);

  useEffect(() => {
    vizInitialize();
  }, [vizInitialize]);

  return (
    <div ref={ref} className='Route' css={{ width: '100%', height: 700 }}>
      <div className='w-100 h-100 d-flex flex-column'>
        <div className='viz'></div>

        <div className='d-flex'>
          <select
            className='form-select'
            onChange={(event) => {
              const sheetName = event.target.value;

              workbook.activateSheetAsync(sheetName).then((_sheetActive) => {
                regionFilterInitialize(_sheetActive);

                sheetActiveSet(_sheetActive);
              });
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

                region !== regionFilterValueBlank
                  ? sheetActive.applyFilterAsync(
                      regionFilterName,
                      region,
                      globalThis.tableau.FilterUpdateType.REPLACE
                    )
                  : sheetActive.clearFilterAsync(regionFilterName);
              }}
            >
              {regionFilterValueCollection.map((region, index) => {
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
