
import * as React from 'react';
import ReactDOM from 'react-dom';

async function clientRender(PageDom) {
    const mountDom = window.document.querySelector('#react-root');
    const renderFnc = mountDom.childNodes.length ? 'hydrate' : 'render';
    (ReactDOM)[renderFnc](
        <PageDom/>,
        mountDom
    )
}

export default clientRender;