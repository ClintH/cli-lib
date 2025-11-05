import { expect, test } from 'vitest';
import { splitFolderName } from './ensure-path.js'

test(`splitFolderName`, t => {


  expect(splitFolderName(`c:\\`)).toStrictEqual([ `c:\\`, `` ]);
  expect(splitFolderName(`c:\\file.ext`)).toStrictEqual([ `c:\\`, `file.ext` ]);
  expect(splitFolderName(`c:\\folder\\`)).toStrictEqual([ `c:\\folder\\`, `` ]);
  expect(splitFolderName(`c:\\folder.blah\\`)).toStrictEqual([ `c:\\folder.blah\\`, `` ]);
  expect(splitFolderName(`c:\\folder.blah\\file.ext`)).toStrictEqual([ `c:\\folder.blah\\`, `file.ext` ]);

  expect(splitFolderName(`/Users/test/file.ext`)).toStrictEqual([ `/Users/test/`, `file.ext` ]);
  expect(splitFolderName(`/Users/test/`)).toStrictEqual([ `/Users/test/`, `` ]);

  // AMBIGUOUS
  // By default, assumes files must have a period ('.')
  expect(splitFolderName(`/Users/test`)).toStrictEqual([ `/Users/test`, `` ]);

  expect(splitFolderName(`/Users/test`, { filesWithPeriods: false })).toStrictEqual([ `/Users/`, `test` ]);
  expect(splitFolderName(`/Users/test`, { filesWithPeriods: false, trailingSlashFolder: true })).toStrictEqual([ `/Users/`, `test` ]);
  expect(splitFolderName(`/Users/test/`, { filesWithPeriods: false, trailingSlashFolder: true })).toStrictEqual([ `/Users/test/`, `` ]);


})