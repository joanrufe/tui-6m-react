import React from 'react';
import Loader from 'tui-components/lib/atoms/Loader/Loader';
import Button, { ButtonTypes } from 'tui-components/lib/atoms/Button/Button';
import L10n from '@tuicom/l10n/l10n';
import translations from '../../l10n/translations.json';
import './App.scss';

const App = ({ locale }) => {
  const l10n = new L10n(translations, locale);
  return (
    <div>
      <Loader />
      {l10n.t('Hello World!')}
      <Button type={ButtonTypes.primary}>{l10n.t('React & 6M')}</Button>
    </div>
  );
};

export default App;
