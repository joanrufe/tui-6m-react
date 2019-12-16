import React from 'react';
import { Button, Loader } from 'semantic-ui-react';
import L10n from '@tuicom/l10n/l10n';
import translations from '../../l10n/translations.json';
import 'semantic-ui-css/semantic.min.css';

const App = ({ locale, number }) => {
  const l10n = new L10n(translations, locale);
  return (
    <div>
      {number && <p>Random number fetched: {number}</p>}
      <Loader />
      <br />
      {l10n.t('Hello World!')}
      <br />
      <Button primary>{l10n.t('React & 6M')}</Button>
      <br />
    </div>
  );
};

export default App;
