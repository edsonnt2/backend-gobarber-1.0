import fs from 'fs';
import Handlebars from 'handlebars';
import ITemplateMailProvider from '../models/ITemplateMailProvider';
import ITemplateMailDTO from '../Dtos/ITemplateMailDTO';

class HandlebarsTemplateProvider implements ITemplateMailProvider {
  public async parse({ body, variables }: ITemplateMailDTO): Promise<string> {
    const parseTemplate = await fs.promises.readFile(body, {
      encoding: 'utf-8',
    });

    const template = Handlebars.compile(parseTemplate);
    return template(variables);
  }
}

export default HandlebarsTemplateProvider;
