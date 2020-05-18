export default interface ITemplateMailDTO {
  body: string;
  variables: {
    [key: string]: string | number;
  };
}
