import slugify from 'slugify';

export default function(name: string): string {
  const date = new Date();
  const hash = `${date.getDay() + date.getSeconds()}${date.getFullYear()}${date.getMonth() + date.getMilliseconds()}`;
  const slug = slugify(name, { lower: true });
  return `${slug}-${hash}`;
}
