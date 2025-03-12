import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { ApiError, generateId } from '../../cma-client/src';
import type { OnUploadProgressInfo } from '../src/resources/Upload';

describe('upload', () => {
  it.concurrent('upload local file', async () => {
    const client = await generateNewCmaClient();

    const progressInfos: OnUploadProgressInfo[] = [];

    const upload = await client.uploads.createFromLocalFile({
      localPath: `${__dirname}/fixtures/text.txt`,
      onProgress(info) {
        progressInfos.push(info);
      },
    });

    const infoTypes = new Set(progressInfos.map((info) => info.type));

    expect(infoTypes.has('REQUESTING_UPLOAD_URL')).toBeTruthy();
    expect(infoTypes.has('UPLOADING_FILE')).toBeTruthy();
    expect(infoTypes.has('CREATING_UPLOAD_OBJECT')).toBeTruthy();

    expect(upload.path.endsWith('text.txt')).toBeTruthy();

    try {
      await client.uploadTracks.create(upload, {
        url_or_upload_request_id: upload.url,
        type: 'subtitles',
        language_code: 'it-IT',
      });
    } catch (e) {
      if (!(e instanceof ApiError)) {
        throw e;
      }

      if (!e.findError('NOT_A_VIDEO')) {
        throw e;
      }
    }
  });

  it.concurrent('upload remote file', async () => {
    const client = await generateNewCmaClient();

    const progressInfos: OnUploadProgressInfo[] = [];

    const upload = await client.uploads.createFromUrl({
      url: 'https://www.datocms-assets.com/205/1525789775-dato.png',
      onProgress(info) {
        progressInfos.push(info);
      },
    });

    const infoTypes = new Set(progressInfos.map((info) => info.type));

    expect(infoTypes.has('DOWNLOADING_FILE')).toBeTruthy();
    expect(infoTypes.has('REQUESTING_UPLOAD_URL')).toBeTruthy();
    expect(infoTypes.has('UPLOADING_FILE')).toBeTruthy();
    expect(infoTypes.has('CREATING_UPLOAD_OBJECT')).toBeTruthy();

    expect(upload.path.endsWith('dato.png')).toBeTruthy();

    const secondUpload = await client.uploads.createFromUrl({
      url: 'https://www.datocms-assets.com/205/1525789775-dato.png',
      skipCreationIfAlreadyExists: true,
    });

    expect(secondUpload.id).toEqual(upload.id);
  });

  it.concurrent('references', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'article',
    });

    await client.fields.create(itemType, {
      label: 'Image',
      field_type: 'file',
      api_key: 'image',
      validators: { required: {} },
    });

    const upload = await client.uploads.createFromLocalFile({
      localPath: `${__dirname}/fixtures/image.png`,
    });

    await client.items.create({
      image: { upload_id: upload.id },
      item_type: itemType,
    });

    const items = await client.uploads.references(upload.id);

    expect(items.length).toEqual(1);
  });

  it.concurrent('create with explicit ID', async () => {
    const client = await generateNewCmaClient();

    const newId = generateId();

    const upload = await client.uploads.createFromLocalFile({
      id: newId,
      localPath: `${__dirname}/fixtures/text.txt`,
    });

    expect(upload.id).toEqual(newId);
  });
});
