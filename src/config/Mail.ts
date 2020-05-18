interface IMailDriver {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      name: string;
      adress: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      name: 'Edson Rodrigo',
      adress: 'edson_nt2@hotmail.com',
    },
  },
} as IMailDriver;
