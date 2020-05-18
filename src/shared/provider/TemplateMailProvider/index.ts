import { container } from 'tsyringe';

import ITemplateMailProvider from './models/ITemplateMailProvider';
import HandlebarsTemplateProvider from './implementations/HandlebarsTemplateProvider';

container.registerSingleton<ITemplateMailProvider>(
  'TemplateMailProvider',
  HandlebarsTemplateProvider,
);
