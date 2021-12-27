import { promises as fs } from 'fs';
import { OpenAPIObject } from '@nestjs/swagger';

const FILENAME = 'swagger-spec.json';

export type SwaggerType = 'create' | 'json' | 'auto';

export async function writeDocumentInJSON(
  document: OpenAPIObject,
): Promise<void> {
  await fs
    .writeFile(`./${FILENAME}`, JSON.stringify(document))
    .then((res) => console.log('created swagger file', res))
    .catch((err) => console.log(err));
}

export async function readDocumentInJSON(): Promise<OpenAPIObject> {
  return JSON.parse(
    (await fs.readFile(`${__dirname}/../${FILENAME}`)).toString(),
  );
}
