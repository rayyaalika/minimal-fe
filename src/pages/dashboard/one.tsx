import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

const metadata = { title: `Halaman Data Produk | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductView title="Data Produk" />
    </>
  );
}
