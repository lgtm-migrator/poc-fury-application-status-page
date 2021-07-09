/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../public/locales/en_us/translation.json';
import itTranslations from '../public/locales/it_it/translation.json';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
	EN: {
		translation: enTranslations,
	},
	IT: {
		translation: itTranslations,
	},
};

/**
 * Loads the translation file. Make sure the promise is resolved before using the translating function
 */
export const initialize = i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: 'EN',

		keySeparator: false, // we do not use keys in form messages.welcome

		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});

export default i18n;
